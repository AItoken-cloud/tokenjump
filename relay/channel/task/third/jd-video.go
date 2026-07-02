package third

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/logger"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/relay/channel/task/doubao"
	"github.com/QuantumNous/new-api/relay/channel/task/taskcommon"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/service"
	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/samber/lo"
)

type MediaURL struct {
	URL string `json:"url,omitempty"`
}

// 生成视频的宽高比例（Seedance 2.0）枚举值：16:9、4:3、1:1、3:4、9:16、21:9、adaptive
func CheckRatio(ratio *dto.StringValue) error {
	if ratio != nil && !lo.Contains([]string{"16:9", "4:3", "1:1", "3:4", "9:16", "21:9", "adaptive"}, (string)(*ratio)) {
		return errors.New("ratio must be one of 16:9, 4:3, 1:1, 3:4, 9:16, 21:9, adaptive")
	}
	return nil
}

// 生成视频时长，单位：秒
// - 支持 [4,12] 范围内的整数
// - 设置为 -1 表示由模型自主选择
func CheckDuration(duration *dto.IntValue) error {
	if duration != nil && *duration != -1 && (*duration < 4 || *duration > 12) {
		return errors.New("duration must be -1 or between 4 and 12 seconds")
	}
	return nil
}

// 任务超时阈值（仅Seedance 1.5 pro）
// 单位：秒，从创建时间戳开始计算
// 取值范围：[3600, 259200]
// 默认值：172800（48小时）
func CheckExecutionExpiresAfter(executionExpiresAfter *dto.IntValue) error {
	if executionExpiresAfter != nil && (*executionExpiresAfter < 3600 || *executionExpiresAfter > 259200) {
		return errors.New("execution_expires_after must be between 3600 and 259200 seconds")
	}
	return nil
}

// 视频分辨率（Seedance 2.0）
// 枚举值：480p、720p、1080p
func CheckResolution(resolution *dto.StringValue) error {
	if resolution != nil && !lo.Contains([]string{"480p", "720p", "1080p"}, (string)(*resolution)) {
		return errors.New("resolution must be one of 480p, 720p, 1080p")
	}
	return nil
}

// 生成视频的帧数（Seedance 2.0 & Seedance 1.5 pro暂不支持）
// - 通过帧数可灵活控制视频长度，支持小数秒
// - 计算公式：帧数 = 时长 × 帧率(24)
// - 取值范围：[29, 289] 满足 25+4n 格式的整数
func CheckFrames(frames *dto.IntValue) error {
	if frames != nil && (*frames < 29 || *frames > 289 || (*frames-25)%4 != 0) {
		return errors.New("frames must be between 29 and 289, and must be 25+4n format")
	}
	return nil
}

// 种子整数，用于控制生成内容的随机性
// 取值范围：[-1, 2^32-1]
func CheckSeed(seed *dto.IntValue) error {
	if seed != nil && (*seed < -1 || *seed > 2<<32-1) {
		return errors.New("seed must be between -1 and 2^32-1")
	}
	return nil
}

// 服务等级类型（仅Seedance 1.5 pro）
// default：在线推理模式，RPM和并发数配额较低
// flex：离线推理模式，TPD配额更高
func CheckServiceTier(serviceTier *dto.StringValue) error {
	if serviceTier != nil && !lo.Contains([]string{"default", "flex"}, (string)(*serviceTier)) {
		return errors.New("service_tier must be one of default, flex")
	}
	return nil
}

type JdDoubaoVideoCommonAdaptor struct {
	taskcommon.BaseBilling
	ChannelType int
	apiKey      string
	baseURL     string
}

type responsePayload struct {
	RequestId string `json:"requestId,omitempty"`
	Error     *struct {
		Cause   string `json:"cause"`
		Code    int    `json:"code"`
		Message string `json:"message"`
		Status  string `json:"status"`
	} `json:"error"`
	Result responsePayloadResult `json:"result,omitempty"`
}

type responsePayloadResult struct {
	Message string `json:"message,omitempty"`
	Status  string `json:"status,omitempty"`
	TaskID  string `json:"task_id,omitempty"`
}

type fetchTaskPayload struct {
	TaskID string `json:"taskId"`
}

type ResponseContentItem struct {
	Id       string    `json:"id"`
	VideoURL *MediaURL `json:"video_url,omitempty"`
}

type fetchTaskResult struct {
	TaskId     string `json:"task_id"`
	TaskStatus string `json:"task_status"`
	Error      struct {
		Type    string `json:"type"`
		Code    int    `json:"code"`
		Message string `json:"message"`
	} `json:"error"`
	Usage struct {
		VideoOutput   int    `json:"video_output"`
		HasVideoInput bool   `json:"has_video_input"`
		Resolution    string `json:"resolution"`
		ToolUsage     struct {
			WebSearch int `json:"web_search"`
		} `json:"tool_usage"`
	} `json:"usage"`
	Content []ResponseContentItem `json:"content"`
}

type cancelTaskPayload struct {
	TaskID string `json:"taskId"`
}

type cancelTaskResult struct {
	RequestId string `json:"requestId,omitempty"`
	Result    string `json:"result,omitempty"`
	Error     struct {
		Cause   string `json:"cause"`
		Code    int    `json:"code"`
		Message string `json:"message"`
		Status  string `json:"status"`
	} `json:"error"`
}

func (*JdDoubaoVideoCommonAdaptor) GetModelList() []string {
	return doubao.ModelList
}

func (*JdDoubaoVideoCommonAdaptor) GetChannelName() string {
	return doubao.ChannelName
}

// DoResponse handles upstream response, returns taskID etc.
func (*JdDoubaoVideoCommonAdaptor) DoResponse(c *gin.Context, resp *http.Response, info *relaycommon.RelayInfo) (taskID string, taskData []byte, taskErr *dto.TaskError) {
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		taskErr = service.TaskErrorWrapper(err, "read_response_body_failed", http.StatusInternalServerError)
		return
	}
	_ = resp.Body.Close()

	logger.LogDebug(c, "jd video common response body: %s", string(responseBody))
	// Parse Doubao response
	var dResp responsePayload
	if err := common.Unmarshal(responseBody, &dResp); err != nil {
		taskErr = service.TaskErrorWrapper(errors.Wrapf(err, "body: %s", responseBody), "unmarshal_response_body_failed", http.StatusInternalServerError)
		return
	}

	if dResp.Error != nil {
		taskErr = service.TaskErrorWrapper(fmt.Errorf("%s, %s", dResp.Error.Message, dResp.Error.Cause), "invalid_response", http.StatusInternalServerError)
		return
	}

	if dResp.Result.TaskID == "" {
		// 打印错误信息
		logger.LogError(c, "task_id is empty, response: %s", string(responseBody))
		taskErr = service.TaskErrorWrapper(fmt.Errorf("task_id is empty"), "invalid_response", http.StatusInternalServerError)
		return
	}

	ov := dto.NewOpenAIVideo()
	ov.ID = info.PublicTaskID
	ov.TaskID = info.PublicTaskID
	ov.CreatedAt = time.Now().Unix()
	ov.Model = info.OriginModelName

	c.JSON(http.StatusOK, ov)
	return dResp.Result.TaskID, responseBody, nil
}

func (*JdDoubaoVideoCommonAdaptor) FetchTask(baseUrl, key string, body map[string]any, proxy string) (*http.Response, error) {
	taskId, ok := body["task_id"].(string)
	if !ok {
		return nil, fmt.Errorf("invalid task_id")
	}

	uri := fmt.Sprintf("%s/api/saas/plugin-u/v1/exec/query-task", baseUrl)

	payload := fetchTaskPayload{
		TaskID: taskId,
	}
	data, err := common.Marshal(payload)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest(http.MethodPost, uri, bytes.NewReader(data))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+key)

	client, err := service.GetHttpClientWithProxy(proxy)
	if err != nil {
		return nil, fmt.Errorf("new proxy http client failed: %w", err)
	}
	return client.Do(req)
}

func (*JdDoubaoVideoCommonAdaptor) CancelTask(c *gin.Context, baseUrl, key string, body map[string]any, proxy string) *dto.TaskError {
	taskId, ok := body["task_id"].(string)
	if !ok {
		taskErr := service.TaskErrorWrapper(errors.New("invalid task_id"), "invalid_task_id", http.StatusBadRequest)
		return taskErr
	}

	uri := fmt.Sprintf("%s/api/saas/plugin-u/v1/exec/Cancel-task", baseUrl)

	payload := cancelTaskPayload{
		TaskID: taskId,
	}
	data, err := common.Marshal(payload)
	if err != nil {
		taskErr := service.TaskErrorWrapper(err, "marshal_cancel_payload_failed", http.StatusInternalServerError)
		return taskErr
	}

	req, err := http.NewRequest(http.MethodPost, uri, bytes.NewReader(data))
	if err != nil {
		taskErr := service.TaskErrorWrapper(err, "create_cancel_request_failed", http.StatusInternalServerError)
		return taskErr
	}

	req.Header.Set("Accept", "application/json")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+key)

	client, err := service.GetHttpClientWithProxy(proxy)
	if err != nil {
		taskErr := service.TaskErrorWrapper(fmt.Errorf("new proxy http client failed: %w", err), "create_http_client_failed", http.StatusInternalServerError)
		return taskErr
	}
	resp, err := client.Do(req)
	if err != nil {
		logger.LogError(c, "send cancel request failed: %s", err)
		taskErr := service.TaskErrorWrapper(err, "send_cancel_request_failed", http.StatusInternalServerError)
		return taskErr
	}
	responseBody, err := io.ReadAll(resp.Body)
	_ = resp.Body.Close()

	var dResp cancelTaskResult
	if err := common.Unmarshal(responseBody, &dResp); err != nil {
		taskErr := service.TaskErrorWrapper(errors.Wrapf(err, "body: %s", responseBody), "unmarshal_cancel_response_body_failed", http.StatusInternalServerError)
		return taskErr
	}

	if dResp.Error.Code != 0 {
		taskErr := service.TaskErrorWrapper(fmt.Errorf("cancel task failed: %s", dResp.Error.Message), "cancel_task_failed", http.StatusInternalServerError)
		return taskErr
	}

	return nil
}

func (*JdDoubaoVideoCommonAdaptor) ValidateRequestAndSetAction(c *gin.Context, info *relaycommon.RelayInfo) (taskErr *dto.TaskError) {
	// Accept only POST /v1/video/generations as "generate" action.
	return relaycommon.ValidateBasicTaskRequest(c, info, constant.TaskActionGenerate)
}

func (*JdDoubaoVideoCommonAdaptor) ParseTaskResult(respBody []byte) (*relaycommon.TaskInfo, error) {
	resTask := fetchTaskResult{}
	if err := common.Unmarshal(respBody, &resTask); err != nil {
		return nil, errors.Wrap(err, "unmarshal task result failed")
	}

	taskResult := relaycommon.TaskInfo{
		Code: 0,
	}

	switch resTask.TaskStatus {
	case "pending":
		taskResult.Status = model.TaskStatusSubmitted
	case "running":
		taskResult.Status = model.TaskStatusInProgress
	case "success":
		taskResult.Status = model.TaskStatusSuccess
		taskResult.Progress = "100%"
		if len(resTask.Content) > 0 && resTask.Content[0].VideoURL != nil {
			taskResult.Url = resTask.Content[0].VideoURL.URL
		}
		taskResult.CompletionTokens = resTask.Usage.VideoOutput
		taskResult.TotalTokens = resTask.Usage.VideoOutput
	case "failed":
		taskResult.Status = model.TaskStatusFailure
		taskResult.Progress = "100%"
		taskResult.Reason = resTask.Error.Message
	default:
		taskResult.Status = model.TaskStatusInProgress
	}

	return &taskResult, nil
}
