package third

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"
	"github.com/QuantumNous/new-api/service"

	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/relay/channel"
	"github.com/QuantumNous/new-api/relay/channel/task/taskcommon"
	relaycommon "github.com/QuantumNous/new-api/relay/common"

	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
	"github.com/samber/lo"
)

// ============================
// Request / Response structures
// ============================

type multiLiveVideoDanceContentItem struct {
	Type     string    `json:"type,omitempty"`
	Text     *string   `json:"text,omitempty"`
	ImageURL *MediaURL `json:"image_url,omitempty"`
	VideoURL *MediaURL `json:"video_url,omitempty"`
	AudioURL *MediaURL `json:"audio_url,omitempty"`
	Role     *string   `json:"role,omitempty"`
}

type multiLiveVideoDanceRequestPayload struct {
	Content         []multiLiveVideoDanceContentItem `json:"content"`
	GenerateAudio   *dto.BoolValue                   `json:"generate_audio,omitempty"`
	Ratio           *dto.StringValue                 `json:"ratio,omitempty"`
	Duration        *dto.IntValue                    `json:"duration,omitempty"`
	Watermark       *dto.BoolValue                   `json:"watermark,omitempty"`
	Resolution      *dto.StringValue                 `json:"resolution,omitempty"`
	ReturnLastFrame *dto.BoolValue                   `json:"return_last_frame,omitempty"`
}

type multiLiveVideoDanceResponsePayload struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data string `json:"data"`
}

type multiLiveVideoDanceFetchTaskResponse struct {
	Msg  string `json:"msg"`
	Code int    `json:"code"`
	Data struct {
		Seed                  int `json:"seed"`
		ExecutionExpiresAfter int `json:"execution_expires_after"`
		Usage                 struct {
			CompletionTokens int `json:"completion_tokens"`
			TotalTokens      int `json:"total_tokens"`
		} `json:"usage"`
		CreatedAt     int64  `json:"created_at"`
		GenerateAudio bool   `json:"generate_audio"`
		Priority      int    `json:"priority"`
		Resolution    string `json:"resolution"`
		Content       struct {
			VideoURL string `json:"video_url,omitempty"`
		} `json:"content"`
		Duration        int    `json:"duration"`
		FramesPerSecond int    `json:"framespersecond"`
		UpdatedAt       int64  `json:"updated_at"`
		Draft           bool   `json:"draft"`
		Model           string `json:"model"`
		ServiceTier     string `json:"service_tier"`
		ID              string `json:"id"`
		Status          string `json:"status"`
		Ratio           string `json:"ratio"`
	} `json:"data"`
	Error struct {
		Message string `json:"message"`
		Code    int    `json:"code"`
	}
}

// ============================
// Adaptor implementation
// ============================

type JdDoubaoLiveVideoDanceAdaptor struct {
	ChannelType int
	apiKey      string
	baseURL     string
	JdDoubaoVideoCommonAdaptor
}

func (a *JdDoubaoLiveVideoDanceAdaptor) Init(info *relaycommon.RelayInfo) {
	a.ChannelType = info.ChannelType
	a.baseURL = info.ChannelBaseUrl
	a.apiKey = info.ApiKey
}

func (a *JdDoubaoLiveVideoDanceAdaptor) EstimateBilling(c *gin.Context, info *relaycommon.RelayInfo) map[string]float64 {
	req, err := relaycommon.GetTaskRequest(c)
	if err != nil {
		return nil
	}
	if len(req.Videos) > 0 {
		return map[string]float64{"video_input": 28.0 / 46.0}
	}

	return nil
}

func (a *JdDoubaoLiveVideoDanceAdaptor) BuildRequestHeader(c *gin.Context, req *http.Request, _ *relaycommon.RelayInfo) error {
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+a.apiKey)
	r, err := relaycommon.GetTaskRequest(c)
	if err != nil {
		return err
	}
	req.Header.Set("Input-Has-Video", strconv.FormatBool(len(r.Videos) > 0))
	return nil
}

// BuildRequestURL constructs the upstream URL.
func (a *JdDoubaoLiveVideoDanceAdaptor) BuildRequestURL(_ *relaycommon.RelayInfo) (string, error) {
	return fmt.Sprintf("%s/api/saas/plugin-u/v1/exec/dance-create", a.baseURL), nil
}

// BuildRequestBody converts request into Doubao specific format.
func (a *JdDoubaoLiveVideoDanceAdaptor) BuildRequestBody(c *gin.Context, info *relaycommon.RelayInfo) (io.Reader, error) {
	req, err := relaycommon.GetTaskRequest(c)
	if err != nil {
		return nil, err
	}

	body, err := a.convertToRequestPayload(&req)
	if err != nil {
		return nil, errors.Wrap(err, "convert request payload failed")
	}
	data, err := common.Marshal(body)
	if err != nil {
		return nil, err
	}
	logger.LogDebug(c, "[jd video] live request payload: %s", string(data))
	return bytes.NewReader(data), nil
}

func (a *JdDoubaoLiveVideoDanceAdaptor) DoResponse(c *gin.Context, resp *http.Response, info *relaycommon.RelayInfo) (taskID string, taskData []byte, taskErr *dto.TaskError) {
	responseBody, err := io.ReadAll(resp.Body)
	if err != nil {
		taskErr = service.TaskErrorWrapper(err, "read_response_body_failed", http.StatusInternalServerError)
		return
	}
	_ = resp.Body.Close()

	logger.LogDebug(c, "jd video dance response body: %s", string(responseBody))
	// Parse Doubao response
	var dResp multiLiveVideoDanceResponsePayload
	if err := common.Unmarshal(responseBody, &dResp); err != nil {
		taskErr = service.TaskErrorWrapper(errors.Wrapf(err, "body: %s", responseBody), "unmarshal_response_body_failed", http.StatusInternalServerError)
		return
	}

	if dResp.Code != 0 {
		taskErr = service.TaskErrorWrapper(fmt.Errorf("%s, %s", dResp.Msg, dResp.Data), "invalid_response", http.StatusInternalServerError)
		return
	}

	if dResp.Data == "" {
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
	return dResp.Data, responseBody, nil
}

func (a *JdDoubaoLiveVideoDanceAdaptor) convertToRequestPayload(req *relaycommon.TaskSubmitReq) (*multiLiveVideoDanceRequestPayload, error) {
	var r multiLiveVideoDanceRequestPayload
	metadata := req.Metadata
	if err := taskcommon.UnmarshalMetadata(metadata, &r); err != nil {
		return nil, errors.Wrap(err, "unmarshal metadata failed")
	}
	r.Content = lo.Reject(r.Content, func(c multiLiveVideoDanceContentItem, _ int) bool { return c.Type == "text" })
	r.Content = append(r.Content, multiLiveVideoDanceContentItem{
		Type: "text",
		Text: &req.Prompt,
	})
	if req.Duration > 0 {
		r.Duration = lo.ToPtr(dto.IntValue(req.Duration))
	}
	// 参考图片1～9张 视频，1～3个； 音频，1～3个。
	if len(req.Images) > 0 {
		if len(req.Images) > 9 {
			return nil, errors.New("max image count is 9")
		}
		for _, image := range req.Images {
			if image == "" {
				continue
			}
			r.Content = append(r.Content, multiLiveVideoDanceContentItem{
				Type:     "image_url",
				ImageURL: &MediaURL{URL: image},
				Role:     lo.ToPtr("reference_image"),
			})
		}
	}
	if len(req.Audios) > 0 {
		if len(req.Audios) > 3 {
			return nil, errors.New("max audio count is 3")
		}
		for _, audio := range req.Audios {
			if audio == "" {
				continue
			}
			r.Content = append(r.Content, multiLiveVideoDanceContentItem{
				Type:     "audio_url",
				AudioURL: &MediaURL{URL: audio},
				Role:     lo.ToPtr("reference_audio"),
			})
		}
	}
	if len(req.Videos) > 0 {
		if len(req.Videos) > 3 {
			return nil, errors.New("max video count is 3")
		}
		for _, video := range req.Videos {
			if video == "" {
				continue
			}
			r.Content = append(r.Content, multiLiveVideoDanceContentItem{
				Type:     "video_url",
				VideoURL: &MediaURL{URL: video},
				Role:     lo.ToPtr("reference_video"),
			})
		}
	}
	// check generate audio
	if r.GenerateAudio == nil {
		return nil, errors.New("generate_audio is required")
	}
	// check ratio
	if r.Ratio == nil {
		return nil, errors.New("ratio is required")
	}
	if !lo.Contains([]string{"16:9", "9:16", "1:1", "4:3", "3:4"}, (string)(*r.Ratio)) {
		return nil, errors.New("ratio must be 16:9, 9:16, 1:1, 4:3, or 3:4")
	}
	// check resolution
	if r.Resolution != nil && !lo.Contains([]string{"480p", "720p", "1080p"}, (string)(*r.Resolution)) {
		return nil, errors.New("resolution must be 480p, 720p, or 1080p")
	}
	// check duration
	if r.Duration == nil {
		return nil, errors.New("duration is required")
	}
	if *r.Duration < 4 || *r.Duration > 15 {
		return nil, errors.New("duration must be between 4 and 15")
	}
	return &r, nil
}

func (a *JdDoubaoLiveVideoDanceAdaptor) DoRequest(c *gin.Context, info *relaycommon.RelayInfo, requestBody io.Reader) (*http.Response, error) {
	return channel.DoTaskApiRequest(a, c, info, requestBody)
}

func (a *JdDoubaoLiveVideoDanceAdaptor) ConvertToOpenAIVideo(originTask *model.Task) ([]byte, error) {
	var dResp multiLiveVideoDanceFetchTaskResponse
	if err := common.Unmarshal(originTask.Data, &dResp); err != nil {
		return nil, errors.Wrap(err, "unmarshal doubao task data failed")
	}

	openAIVideo := dto.NewOpenAIVideo()
	openAIVideo.ID = originTask.TaskID
	openAIVideo.TaskID = originTask.TaskID
	openAIVideo.Status = originTask.Status.ToVideoStatus()
	openAIVideo.SetProgressStr(originTask.Progress)
	openAIVideo.SetMetadata("url", dResp.Data.Content.VideoURL)
	openAIVideo.CreatedAt = originTask.CreatedAt
	openAIVideo.CompletedAt = originTask.UpdatedAt
	openAIVideo.Model = originTask.Properties.OriginModelName

	if dResp.Data.Status == "failed" {
		openAIVideo.Error = &dto.OpenAIVideoError{
			Message: dResp.Error.Message,
			Code:    strconv.Itoa(dResp.Error.Code),
		}
	}

	return common.Marshal(openAIVideo)
}

func (a *JdDoubaoLiveVideoDanceAdaptor) FetchTask(baseUrl, key string, body map[string]any, proxy string) (*http.Response, error) {
	taskId, ok := body["task_id"].(string)
	if !ok {
		return nil, fmt.Errorf("invalid task_id")
	}

	uri := fmt.Sprintf("%s/api/saas/plugin-u/v1/exec/dance-query", baseUrl)

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

func (a *JdDoubaoLiveVideoDanceAdaptor) ParseTaskResult(respBody []byte) (*relaycommon.TaskInfo, error) {
	resTask := multiLiveVideoDanceFetchTaskResponse{}
	if err := common.Unmarshal(respBody, &resTask); err != nil {
		return nil, errors.Wrap(err, "unmarshal task result failed")
	}

	if resTask.Code != 0 {
		return nil, errors.New(resTask.Msg)
	}

	taskResult := relaycommon.TaskInfo{
		Code: 0,
	}

	switch resTask.Data.Status {
	case "queued":
		taskResult.Status = model.TaskStatusQueued
	case "pending":
		taskResult.Status = model.TaskStatusSubmitted
	case "running":
		taskResult.Status = model.TaskStatusInProgress
	case "succeeded":
		taskResult.Status = model.TaskStatusSuccess
		taskResult.Progress = "100%"
		taskResult.Url = resTask.Data.Content.VideoURL
		taskResult.CompletionTokens = resTask.Data.Usage.CompletionTokens
		taskResult.TotalTokens = resTask.Data.Usage.TotalTokens
	case "failed":
		taskResult.Status = model.TaskStatusFailure
		taskResult.Progress = "100%"
		taskResult.Reason = resTask.Error.Message
	case "cancelled":
		taskResult.Status = model.TaskStatusCancel
		taskResult.Progress = "100%"
	case "expired":
		taskResult.Status = model.TaskStatusExpired
		taskResult.Progress = "100%"
	default:
		taskResult.Status = model.TaskStatusInProgress
	}

	return &taskResult, nil
}
