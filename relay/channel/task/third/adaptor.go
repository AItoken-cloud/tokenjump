package third

import (
	"github.com/QuantumNous/new-api/relay/channel"
)

// AdaptorChannelType defines the channel type for third-party adaptors
const (
	AdaptorChannelTypeDoubaoLiveVideo    = 1
	AdaptorChannelTypeDoubaoTextToVideo  = 2
	AdaptorChannelTypeDoubaoImageToVideo = 3
	AdaptorChannelTypeDoubaoDance        = 4
)

// GetAdaptor returns the appropriate adaptor based on channel type
func GetThirdAdaptor(channelType int) channel.TaskAdaptor {
	switch channelType {
	case AdaptorChannelTypeDoubaoLiveVideo:
		return &JdDoubaoLiveVideoAdaptor{}
	case AdaptorChannelTypeDoubaoTextToVideo:
		return &JdDoubaoTextToVideoAdaptor{}
	case AdaptorChannelTypeDoubaoImageToVideo:
		return &JdDoubaoImageToVideoAdaptor{}
	case AdaptorChannelTypeDoubaoDance:
		return &JdDoubaoLiveVideoDanceAdaptor{}
	}
	return nil
}
