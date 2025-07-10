const ERROR_STATUS_MAP = new Map([
	[400, { title: "Bad Request", detail: "请求参数错误" }],
	[401, { title: "Unauthorized", detail: "未授权，请重新登录" }],
	[403, { title: "Forbidden", detail: "拒绝访问" }],
	[404, { title: "Not Found", detail: "请求资源不存在" }],
	[405, { title: "Method Not Allowed", detail: "请求方法不被允许" }],
	[408, { title: "Request Timeout", detail: "请求超时" }],
	[500, { title: "Internal Server Error", detail: "服务器内部错误" }],
	[502, { title: "Bad Gateway", detail: "网关错误" }],
	[503, { title: "Service Unavailable", detail: "服务暂不可用" }],
	[504, { title: "Gateway Timeout", detail: "网关超时" }],
]);

export default ERROR_STATUS_MAP; 