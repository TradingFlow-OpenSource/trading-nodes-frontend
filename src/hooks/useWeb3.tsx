/** @jsxImportSource react */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthAPI } from "@/services/authAPI/api";
import type { OKXWalletProvider, EthereumProvider } from "@/types/wallet";
import { setSessionItem } from "@/utils/storage";

// Constants
const CONNECTED_WALLET_KEY = "connected_wallet";

// Types
export type WalletType = "okx" | "metamask" | "phantom";
export type ChainType = "ethereum" | "aptos" | "solana" | "flow" | "bsc";

export interface WalletInfo {
	address: string;
	publicKey?: string;
	walletType: WalletType;
	chainType: ChainType;
	isConnected: boolean;
}

interface Web3ContextType {
	wallet: WalletInfo | null;
	isConnecting: boolean;
	error: string | null;
	connectWallet: (walletType: WalletType, chainType: ChainType) => Promise<WalletInfo>;
	disconnectWallet: () => void;
	switchChain: (chainType: ChainType) => Promise<boolean>;
	getBalance: () => Promise<string>;
	checkWalletConnection: () => Promise<void>;
	walletBindingStatus?: WalletBindingStatus;
	checkWalletBinding: (address: string, chainType: ChainType) => Promise<WalletBindingStatus>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// 钱包绑定状态类型
export type WalletBindingStatus = "linkedToSelf" | "notLinked" | "linkedToOther" | null;

export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [wallet, setWallet] = useState<WalletInfo | null>(null);
	const [isConnecting, setIsConnecting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [walletBindingStatus, setWalletBindingStatus] = useState<WalletBindingStatus>(null);

	const checkWalletConnection = async () => {
		// 简化的实现
	};

	const connectWallet = async (walletType: WalletType, chainType: ChainType): Promise<WalletInfo> => {
		setIsConnecting(true);
		setError(null);

		try {
			// 简化的钱包连接实现
			const walletInfo: WalletInfo = {
				address: "0x123...",
				walletType,
				chainType,
				isConnected: true,
			};

			setWallet(walletInfo);
			return walletInfo;
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to connect wallet";
			setError(errorMessage);
			throw error;
		} finally {
			setIsConnecting(false);
		}
	};

	const disconnectWallet = () => {
		setWallet(null);
		sessionStorage.removeItem(CONNECTED_WALLET_KEY);
	};

	const switchChain = async (chainType: ChainType): Promise<boolean> => {
		return true;
	};

	const getBalance = async (): Promise<string> => {
		return "0";
	};

	const checkWalletBinding = async (address: string, chainType: ChainType): Promise<WalletBindingStatus> => {
		try {
			const response = await AuthAPI.checkWalletBinding(address, chainType);
			const status: WalletBindingStatus = response.status;
			setWalletBindingStatus(status);
			return status;
		} catch (error: any) {
			console.error("Error checking wallet binding:", error);
			if (error?.response?.status === 401) {
				const status: WalletBindingStatus = "notLinked";
				setWalletBindingStatus(status);
				return status;
			}
			throw error;
		}
	};

	const value: Web3ContextType = {
		wallet,
		isConnecting,
		error,
		connectWallet,
		disconnectWallet,
		switchChain,
		getBalance,
		checkWalletConnection,
		walletBindingStatus,
		checkWalletBinding,
	};

	return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => {
	const context = useContext(Web3Context);
	if (context === undefined) {
		throw new Error("useWeb3 must be used within a Web3Provider");
	}
	return context;
}; 