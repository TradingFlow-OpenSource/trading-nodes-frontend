export interface ApiResponse<T> {
	success: boolean;
	data: T;
	metadata: {
		requestId: string;
		timestamp: string;
		duration?: number;
		path: string;
		method: string;
	};
} 