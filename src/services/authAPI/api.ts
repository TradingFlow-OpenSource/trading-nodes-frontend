import { service } from "../http";
import type {
	Identity,
	WholeUser,
	PaginatedIdentities,
	WalletVerifyResponse,
	WalletNonceResponse,
	IdentityCheckResponse,
} from "./model";
import { ApiResponse, validateApiResponse } from "../common";
import { TelegramAuthUser } from "../../types/wallet";

const BASE_URL = "/auth";

export class AuthAPI {
	/**
	 * 获取当前用户信息
	 */
	static async getCurrentUser(): Promise<WholeUser> {
		const response = await service.get<ApiResponse<WholeUser>>(`${BASE_URL}/me`, {
			withCredentials: true,
		});
		if (!validateApiResponse<WholeUser>(response)) {
			throw new Error("Invalid API response format");
		}
		return response.data;
	}

	/**
	 * 更新用户信息
	 * @param updateData 更新的数据
	 */
	static async updateProfile(updateData: { name?: string; avatar?: string }): Promise<WholeUser> {
		const response = await service.patch<ApiResponse<WholeUser>>(`${BASE_URL}/me`, updateData, {
			withCredentials: true,
		});
		if (!validateApiResponse<WholeUser>(response)) {
			throw new Error("Invalid API response format");
		}
		return response.data;
	}

	/**
	 * 获取当前用户的身份信息（分页）
	 */
	static async getCurrentUserIdentities(params?: { page?: number; limit?: number; type?: string }): Promise<PaginatedIdentities> {
		const response = await service.get<ApiResponse<PaginatedIdentities>>(`${BASE_URL}/identities`, {
			params,
			withCredentials: true,
		});
		if (!validateApiResponse<PaginatedIdentities>(response)) {
			throw new Error("Invalid API response format");
		}
		return response.data;
	}

	/**
	 * 获取钱包登录所需的 nonce
	 * @param address 钱包地址
	 * @param chain 钱包网络类型（ethereum, aptos, solana）
	 */
	static async getWalletNonce(address: string, chain: string = "ethereum"): Promise<WalletNonceResponse> {
		const response = await service.get<WalletNonceResponse>(`${BASE_URL}/wallet/nonce`, {
			params: { address, chain },
			withCredentials: true,
		});
		return response.data;
	}

	/**
	 * 验证钱包签名
	 */
	static async verifyWalletSignature(
		address: string,
		pubKey: string,
		signature: string,
		walletType: string,
		chain: string,
		nonce: string
	): Promise<WalletVerifyResponse> {
		const response = await service.post<WalletVerifyResponse>(
			`${BASE_URL}/wallet/verify`,
			{ address, pubKey, signature, walletType, chain, nonce },
			{ withCredentials: true }
		);
		return response.data;
	}

	/**
	 * Telegram 登录
	 */
	static async loginWithTelegram(user: TelegramAuthUser): Promise<WholeUser> {
		const response = await service.post<ApiResponse<WholeUser>>(`${BASE_URL}/telegram`, user);
		if (!validateApiResponse<WholeUser>(response)) {
			throw new Error("Invalid API response format");
		}
		return response.data;
	}

	/**
	 * 检查钱包绑定状态
	 */
	static async checkWalletBinding(address: string, chainType: string): Promise<IdentityCheckResponse> {
		const response = await service.get<IdentityCheckResponse>(`${BASE_URL}/identities/check`, {
			params: {
				type: "wallet",
				identifier: address,
				chainType,
			},
			withCredentials: true,
		});
		return response.data;
	}

	/**
	 * Google 登录（重定向）
	 */
	static loginWithGoogle(): void {
		const randomParam = `_=${Date.now()}`;
		const redirectUrl = `${import.meta.env.VITE_TRADINGFLOW_API_URL}/auth/google?${randomParam}`;
		window.location.href = redirectUrl;
	}
} 