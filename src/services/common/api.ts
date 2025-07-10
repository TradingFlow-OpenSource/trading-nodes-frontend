import { ApiResponse } from "./model";

// 校验 API 响应
export const validateApiResponse = <T>(response: any): response is ApiResponse<T> => {
	return (
		response &&
		typeof response.success === "boolean" &&
		"data" in response &&
		response.metadata &&
		typeof response.metadata.requestId === "string" &&
		typeof response.metadata.timestamp === "string"
	);
}; 