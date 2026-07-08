package third

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/bytedance/gopkg/util/logger"
	"github.com/samber/lo"

	"github.com/QuantumNous/new-api/dto"
	"github.com/QuantumNous/new-api/model"
	"github.com/QuantumNous/new-api/relay/channel"
	"github.com/QuantumNous/new-api/relay/channel/task/taskcommon"
	relaycommon "github.com/QuantumNous/new-api/relay/common"

	"github.com/gin-gonic/gin"
	"github.com/pkg/errors"
)

// ============================
// Request / Response structures
// ============================

type textToVideoContentItem struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type textToVideoRequestParameters struct {
	Ratio                 *dto.StringValue `json:"ratio,omitempty"`
	Resolution            *dto.StringValue `json:"resolution,omitempty"`
	Duration              *dto.IntValue    `json:"duration,omitempty"`
	Frames                *dto.IntValue    `json:"frames,omitempty"`
	Seed                  *dto.IntValue    `json:"seed,omitempty"`
	CameraFixed           *dto.BoolValue   `json:"camera_fixed,omitempty"`
	Watermark             *dto.BoolValue   `json:"watermark,omitempty"`
	GenerateAudio         *dto.BoolValue   `json:"generate_audio,omitempty"`
	Draft                 *dto.BoolValue   `json:"draft,omitempty"`
	ServiceTier           *dto.StringValue `json:"service_tier,omitempty"`
	ExecutionExpiresAfter *dto.IntValue    `json:"execution_expires_after,omitempty"`
	Tools                 []struct {
		Type string `json:"type,omitempty"`
	} `json:"tools,omitempty"`
}

type TextToVideoRequestPayload struct {
	Model      string                        `json:"model"`
	Content    []textToVideoContentItem      `json:"content"`
	Parameters *textToVideoRequestParameters `json:"parameters,omitempty"`
}

// ============================
// Adaptor implementation
// ============================

type JdDoubaoTextToVideoAdaptor struct {
	JdDoubaoVideoCommonAdaptor
}

func (a *JdDoubaoTextToVideoAdaptor) Init(info *relaycommon.RelayInfo) {
	a.ChannelType = info.ChannelType
	a.baseURL = info.ChannelBaseUrl
	a.apiKey = info.ApiKey
}

func (a *JdDoubaoTextToVideoAdaptor) BuildRequestHeader(_ *gin.Context, req *http.Request, _ *relaycommon.RelayInfo) error {
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+a.apiKey)
	return nil
}

func (a *JdDoubaoTextToVideoAdaptor) BuildRequestURL(_ *relaycommon.RelayInfo) (string, error) {
	return fmt.Sprintf("%s/api/saas/plugin-u/v1/exec/d-text-to-video", a.baseURL), nil
}

func (a *JdDoubaoTextToVideoAdaptor) BuildRequestBody(c *gin.Context, info *relaycommon.RelayInfo) (io.Reader, error) {
	req, err := relaycommon.GetTaskRequest(c)
	if err != nil {
		return nil, err
	}

	body, err := a.convertToRequestPayload(&req)
	if err != nil {
		return nil, errors.Wrap(err, "convert request payload failed")
	}
	if info.IsModelMapped {
		body.Model = info.UpstreamModelName
	} else {
		info.UpstreamModelName = body.Model
	}
	data, err := common.Marshal(body)
	if err != nil {
		return nil, err
	}
	logger.Debugf("[jd video] text to video request payload: %s", string(data))
	return bytes.NewReader(data), nil
}

func (a *JdDoubaoTextToVideoAdaptor) convertToRequestPayload(req *relaycommon.TaskSubmitReq) (*TextToVideoRequestPayload, error) {
	r := TextToVideoRequestPayload{
		Model:      req.Model,
		Content:    []textToVideoContentItem{},
		Parameters: &textToVideoRequestParameters{},
	}

	metadata := req.Metadata
	if err := taskcommon.UnmarshalMetadata(metadata, &r.Parameters); err != nil {
		return nil, errors.Wrap(err, "unmarshal metadata failed")
	}

	if req.Duration > 0 {
		r.Parameters.Duration = lo.ToPtr(dto.IntValue(req.Duration))
	}
	CheckRatio(r.Parameters.Ratio)
	CheckResolution(r.Parameters.Resolution)
	CheckDuration(r.Parameters.Duration)
	CheckFrames(r.Parameters.Frames)
	CheckSeed(r.Parameters.Seed)
	CheckServiceTier(r.Parameters.ServiceTier)
	CheckExecutionExpiresAfter(r.Parameters.ExecutionExpiresAfter)

	r.Content = append(r.Content, textToVideoContentItem{
		Type: "text",
		Text: req.Prompt,
	})

	return &r, nil
}

func (a *JdDoubaoTextToVideoAdaptor) DoRequest(c *gin.Context, info *relaycommon.RelayInfo, requestBody io.Reader) (*http.Response, error) {
	return channel.DoTaskApiRequest(a, c, info, requestBody)
}

func (a *JdDoubaoTextToVideoAdaptor) ConvertToOpenAIVideo(originTask *model.Task) ([]byte, error) {
	var dResp fetchTaskResult
	if err := common.Unmarshal(originTask.Data, &dResp); err != nil {
		return nil, errors.Wrap(err, "unmarshal doubao task data failed")
	}

	openAIVideo := dto.NewOpenAIVideo()
	openAIVideo.ID = originTask.TaskID
	openAIVideo.TaskID = originTask.TaskID
	openAIVideo.Status = originTask.Status.ToVideoStatus()
	openAIVideo.SetProgressStr(originTask.Progress)
	if len(dResp.Content) > 0 && dResp.Content[0].VideoURL != nil {
		openAIVideo.SetMetadata("url", dResp.Content[0].VideoURL.URL)
	}
	openAIVideo.CreatedAt = originTask.CreatedAt
	openAIVideo.CompletedAt = originTask.UpdatedAt
	openAIVideo.Model = originTask.Properties.OriginModelName

	if dResp.TaskStatus == "failed" {
		openAIVideo.Error = &dto.OpenAIVideoError{
			Message: dResp.Error.Message,
			Code:    strconv.Itoa(dResp.Error.Code),
		}
	}

	return common.Marshal(openAIVideo)
}
