package common

// { "code": 1001, "data": null, "msg": "调试执行失败: 无权限" }
type ResponseError struct {
	Code int         `json:"code"`
	Msg  string      `json:"msg"`
	Data interface{} `json:"data"`
}
