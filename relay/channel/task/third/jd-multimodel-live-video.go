package third

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"

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

type multiLiveVideoContentItem struct {
	Type     string    `json:"type,omitempty"`
	Text     *string   `json:"text,omitempty"`
	ImageURL *MediaURL `json:"image_url,omitempty"`
	VideoURL *MediaURL `json:"video_url,omitempty"`
	AudioURL *MediaURL `json:"audio_url,omitempty"`
	Role     *string   `json:"role,omitempty"`
}

// multiLiveVideoRequestParameters 对应图片中的 parameters 对象
type multiLiveVideoRequestParameters struct {
	Resolution            string           `json:"resolution,omitempty"`
	FramesPerSecond       *dto.IntValue    `json:"framespersecond,omitempty"`
	Seed                  *dto.IntValue    `json:"seed,omitempty"`
	GenerateAudio         *dto.BoolValue   `json:"generate_audio,omitempty"`
	Ratio                 *dto.StringValue `json:"ratio,omitempty"`
	Duration              *dto.IntValue    `json:"duration,omitempty"`
	Watermark             *dto.BoolValue   `json:"watermark,omitempty"`
	Draft                 *dto.BoolValue   `json:"draft,omitempty"`
	ServiceTier           *dto.StringValue `json:"service_tier,omitempty"`
	ExecutionExpiresAfter *dto.IntValue    `json:"execution_expires_after,omitempty"`
}

type requestPayload struct {
	Model      string                           `json:"model"`
	Content    []multiLiveVideoContentItem      `json:"content"`
	Parameters *multiLiveVideoRequestParameters `json:"parameters,omitempty"`
}

type responseTask struct {
	TaskId     string                           `json:"task_id"`
	TaskStatus string                           `json:"task_status"`
	Content    []multiLiveVideoContentItem      `json:"content"`
	Parameters *multiLiveVideoRequestParameters `json:"parameters,omitempty"`
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
}

// ============================
// Adaptor implementation
// ============================

type JdDoubaoLiveVideoAdaptor struct {
	ChannelType int
	apiKey      string
	baseURL     string
	JdDoubaoVideoCommonAdaptor
}

func (a *JdDoubaoLiveVideoAdaptor) Init(info *relaycommon.RelayInfo) {
	a.ChannelType = info.ChannelType
	a.baseURL = info.ChannelBaseUrl
	a.apiKey = info.ApiKey
}

func (a *JdDoubaoLiveVideoAdaptor) EstimateBilling(c *gin.Context, info *relaycommon.RelayInfo) map[string]float64 {
	req, err := relaycommon.GetTaskRequest(c)
	if err != nil {
		return nil
	}
	if len(req.Videos) > 0 {
		return map[string]float64{"video_input": 28.0 / 46.0}
	}

	return nil
}

func (a *JdDoubaoLiveVideoAdaptor) BuildRequestHeader(_ *gin.Context, req *http.Request, _ *relaycommon.RelayInfo) error {
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+a.apiKey)
	return nil
}

// BuildRequestURL constructs the upstream URL.
func (a *JdDoubaoLiveVideoAdaptor) BuildRequestURL(_ *relaycommon.RelayInfo) (string, error) {
	return fmt.Sprintf("%s/api/saas/plugin-u/v1/exec/Multimodal-live-video", a.baseURL), nil
}

// BuildRequestBody converts request into Doubao specific format.
func (a *JdDoubaoLiveVideoAdaptor) BuildRequestBody(c *gin.Context, info *relaycommon.RelayInfo) (io.Reader, error) {
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
	logger.LogDebug(c, "[jd video] live request payload: %s", string(data))
	return bytes.NewReader(data), nil
}

func (a *JdDoubaoLiveVideoAdaptor) convertToRequestPayload(req *relaycommon.TaskSubmitReq) (*requestPayload, error) {
	r := requestPayload{
		Model:   req.Model,
		Content: []multiLiveVideoContentItem{},
	}

	metadata := req.Metadata
	if err := taskcommon.UnmarshalMetadata(metadata, &r.Parameters); err != nil {
		return nil, errors.Wrap(err, "unmarshal metadata failed")
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
			r.Content = append(r.Content, multiLiveVideoContentItem{
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
			r.Content = append(r.Content, multiLiveVideoContentItem{
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
			r.Content = append(r.Content, multiLiveVideoContentItem{
				Type:     "video_url",
				VideoURL: &MediaURL{URL: video},
				Role:     lo.ToPtr("reference_video"),
			})
		}
	}
	if req.Duration > 0 {
		r.Parameters.Duration = lo.ToPtr(dto.IntValue(req.Duration))
	}

	CheckDuration(r.Parameters.Duration)
	CheckRatio(r.Parameters.Ratio)

	r.Content = lo.Reject(r.Content, func(c multiLiveVideoContentItem, _ int) bool { return c.Type == "text" })
	r.Content = append(r.Content, multiLiveVideoContentItem{
		Type: "text",
		Text: &req.Prompt,
	})

	return &r, nil
}

func (a *JdDoubaoLiveVideoAdaptor) DoRequest(c *gin.Context, info *relaycommon.RelayInfo, requestBody io.Reader) (*http.Response, error) {
	return channel.DoTaskApiRequest(a, c, info, requestBody)
}

func extractVideoURL(content []multiLiveVideoContentItem) string {
	for _, item := range content {
		if item.Type == "video_url" && item.VideoURL != nil && item.VideoURL.URL != "" {
			return item.VideoURL.URL
		}
	}
	return ""
}

func (a *JdDoubaoLiveVideoAdaptor) ConvertToOpenAIVideo(originTask *model.Task) ([]byte, error) {
	var dResp responseTask
	if err := common.Unmarshal(originTask.Data, &dResp); err != nil {
		return nil, errors.Wrap(err, "unmarshal doubao task data failed")
	}

	openAIVideo := dto.NewOpenAIVideo()
	openAIVideo.ID = originTask.TaskID
	openAIVideo.TaskID = originTask.TaskID
	openAIVideo.Status = originTask.Status.ToVideoStatus()
	openAIVideo.SetProgressStr(originTask.Progress)
	openAIVideo.SetMetadata("url", extractVideoURL(dResp.Content))
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
