import axios from "axios";
import ERROR_STATUS_MAP from "./errorStatus";
import { useAuthStore } from "@/store/useAuthStore";
import { debouncePromise } from "@/utils/utils";
import { processConfig } from "./processConfig";
import { toast } from "@/hooks/use-toast";

// 默认请求超时时间
const timeout = 60000;

// TradingFlow后端API地址
const TRADINGFLOW_API_URL = import.meta.env.VITE_TRADINGFLOW_API_URL || "http://localhost:8000/api/v1";

// 创建axios实例
export const service = axios.create({
	timeout,
	baseURL: TRADINGFLOW_API_URL,
	withCredentials: true,
});

const handleLogout = debouncePromise(async () => {
	useAuthStore.getState().reset();
	location.reload();
}, 100);

const errorHandle = (error: any) => {
	if (error.response?.status === 401) {
		handleLogout();
		return;
	}
	let message = `${error.response?.status ?? ""} ${error.code}`;
	let description = `server error: ${error.config?.url}`;
	if (/timeout/i.test(error.message)) {
		message = error.code;
		description = `timeout: ${error.config?.url}`;
	}
	if (ERROR_STATUS_MAP.has(error.response?.status)) {
		const errorDesc = ERROR_STATUS_MAP.get(error.response.status)!;
		message = `${error.response.status} ${errorDesc.title}`;
		description = `${errorDesc.detail} \n ${error.config.url}`;
	}
	toast({
		title: message,
		description: description,
		variant: "destructive",
	});
};

service.interceptors.request.use(config => {
	processConfig(config);
	return config;
});

service.interceptors.response.use(
	res => {
		return res.data;
	},
	error => {
		errorHandle(error);
		return { data: { message: "" } };
	}
); 