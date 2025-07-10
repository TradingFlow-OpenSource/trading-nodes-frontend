import { useEffect, useCallback } from "react";
import { TelegramAuthUser } from "../types/wallet";
import { AuthAPI } from "../services/authAPI/api";
import { WalletType } from "./useWeb3";
import { useAuthStore } from "../store/useAuthStore";
import { removeSessionItem, setSessionItem, getSessionItem } from "@/utils/storage";
import type { WalletNonceResponse, WalletVerifyResponse } from "@/services/authAPI/model";

// Helper functions
const getWalletAddressAndPubKey = async (
	walletType: WalletType,
	chain: string
): Promise<{ address: string; pubKey: string }> => {
	if (walletType === "metamask") {
		const provider = window.ethereum;
		if (!provider) {
			throw new Error("MetaMask not installed");
		}
		const accounts = await provider.request({ method: "eth_requestAccounts" });
		return { address: accounts[0], pubKey: "" };
	} else {
		const provider = window.okxwallet;
		if (!provider) {
			throw new Error("OKX Wallet not installed");
		}
		if (chain !== "aptos") {
			const accounts = await provider.request({ method: "eth_requestAccounts" });
			return { address: accounts[0], pubKey: "" };
		} else {
			const accounts = await provider.aptos.account();
			return { address: accounts.address, pubKey: accounts.publicKey };
		}
	}
};

const signMessage = async (
	walletType: WalletType,
	message: string,
	address: string,
	nonce: string,
	chain: string
): Promise<string> => {
	if (walletType === "metamask") {
		const provider = window.ethereum;
		if (!provider) {
			throw new Error("MetaMask not installed");
		}
		return await provider.request({
			method: "personal_sign",
			params: [message, address, nonce],
		});
	} else {
		const provider = window.okxwallet;
		if (!provider) {
			throw new Error("OKX Wallet not installed");
		}
		if (chain !== "aptos") {
			return await provider.request({
				method: "personal_sign",
				params: [message, address, nonce],
			});
		} else {
			const response = await provider.aptos.signMessage({ message, nonce });
			return response.signature;
		}
	}
};

// 添加防抖机制，避免频繁请求
let lastFetchTime = 0;
const FETCH_COOLDOWN = 3000; // 3秒内不重复请求
let fetchPromise: Promise<void> | null = null;

export const useAuth = () => {
	const { wholeUser, loading, error, setWholeUser, setLoading, setError, reset } = useAuthStore();

	const fetchUser = useCallback(async (force = false) => {
		const now = Date.now();
		const token = getSessionItem("token");
		
		// 如果没有token，直接返回
		if (!token) {
			setWholeUser(null);
			setLoading(false);
			return;
		}

		// 如果不是强制请求且在冷却期内，则跳过请求
		if (!force && now - lastFetchTime < FETCH_COOLDOWN) {
			return;
		}

		// 如果已经有正在进行的请求，返回该Promise
		if (fetchPromise) {
			return fetchPromise;
		}

		fetchPromise = (async () => {
			try {
				setLoading(true);
				lastFetchTime = now;
				const response = await AuthAPI.getCurrentUser();
				if (response && !response.identities) {
					response.identities = [];
				}
				setWholeUser(response || null);
			} catch (error) {
				console.error("Error fetching user:", error);
				// 如果是401错误，清除token
				if (error instanceof Error && error.message.includes("401")) {
					removeSessionItem("token");
					setWholeUser(null);
				}
			} finally {
				setLoading(false);
				fetchPromise = null;
			}
		})();

		return fetchPromise;
	}, [setWholeUser, setLoading]);

	// 只在组件挂载时检查一次认证状态
	useEffect(() => {
		const token = getSessionItem("token");
		if (token && !wholeUser) {
			fetchUser();
		} else if (!token) {
			setWholeUser(null);
			setLoading(false);
		}
	}, []);

	const saveToken = (token: string) => {
		setSessionItem("token", token);
	};

	const loginWithGoogle = async () => {
		try {
			setLoading(true);
			setError(null);
			await AuthAPI.loginWithGoogle();
		} catch (error) {
			console.error("Google login error:", error);
			setError("Failed to login with Google");
		} finally {
			setLoading(false);
		}
	};

	const loginWithTelegram = async (user: TelegramAuthUser) => {
		try {
			setLoading(true);
			setError(null);
			const response = await AuthAPI.loginWithTelegram(user);
			saveToken(response.token!);
			await fetchUser(true); // 强制刷新用户信息
		} catch (error) {
			console.error("Telegram login error:", error);
			setError("Failed to login with Telegram");
		} finally {
			setLoading(false);
		}
	};

	const loginWithWallet = async ({
		addr,
		walletType,
		chain,
	}: {
		addr: string;
		walletType: WalletType;
		chain: string;
	}) => {
		try {
			setLoading(true);
			setError(null);

			const nonceResponse: WalletNonceResponse = await AuthAPI.getWalletNonce(addr, chain);
			const { nonce, message } = nonceResponse;

			if (!nonce || !message) {
				throw new Error("Failed to get nonce or message");
			}

			const { address, pubKey } = await getWalletAddressAndPubKey(walletType, chain);
			if (!address) {
				throw new Error("Failed to get wallet address");
			}

			const messageToSign = `${message}\n\nNonce: ${nonce}\nAddress: ${address}`;
			const signature = await signMessage(walletType, messageToSign, address, nonce, chain);

			if (!signature) {
				throw new Error("Failed to sign message");
			}

			const verifyResponse: WalletVerifyResponse = await AuthAPI.verifyWalletSignature(
				address,
				pubKey,
				signature,
				walletType,
				chain,
				nonce
			);

			const { token, user, bound } = verifyResponse;

			if (!token || !user) {
				throw new Error("Invalid verification response");
			}

			if (bound) {
				console.warn("Unexpected bound:true in LoginModal wallet login - user was already logged in");
			}

			saveToken(token);

			setWholeUser({ user, token, identity: verifyResponse.identity });
			return { token, user };
		} catch (error) {
			console.error("Wallet login error:", error);
			setError(error instanceof Error ? error.message : "An error occurred");
			throw error;
		} finally {
			setLoading(false);
		}
	};

	const logout = () => {
		removeSessionItem("token");
		removeSessionItem("userInfo");
		reset();
		lastFetchTime = 0; // 重置请求时间
		fetchPromise = null; // 清除pending的promise
	};

	// 计算认证状态
	const isAuthenticated = !!wholeUser?.user && !!getSessionItem("token");
	const isLoading = loading;

	return {
		// 认证状态
		isAuthenticated,
		isLoading,
		user: wholeUser?.user || null,
		wholeUser,
		error,
		
		// 认证方法
		loginWithGoogle,
		loginWithTelegram,
		loginWithWallet,
		logout,
		saveToken,
		fetchUser,
	};
}; 