import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { WalletType, ChainType } from "@/hooks/useWeb3";
import { X } from "lucide-react";

interface LoginModalProps {
	isOpen: boolean;
	onClose: () => void;
	onLoginCallback?: () => void;
}

// 精确的钱包检测函数
const getWalletProvider = (walletType: WalletType) => {
	if (walletType === "metamask") {
		const ethereum = window.ethereum as any;
		if (ethereum?.isMetaMask && !ethereum?.isOkxWallet) {
			return ethereum;
		}

		if (ethereum?.providers) {
			const metamaskProvider = ethereum.providers.find(
				(provider: any) => provider.isMetaMask && !provider.isOkxWallet
			);
			if (metamaskProvider) return metamaskProvider;
		}

		return null;
	}

	if (walletType === "okx") {
		if (window.okxwallet) {
			return window.okxwallet;
		}

		const ethereum = window.ethereum as any;
		if (ethereum?.isOkxWallet) {
			return ethereum;
		}

		return null;
	}

	return null;
};

// 支持的链
const CHAIN_OPTIONS = [
	{
		chainType: "ethereum" as ChainType,
		name: "Ethereum",
		icon: "/token/eth.png",
		disabled: false,
	},
	{
		chainType: "flow" as ChainType,
		name: "Flow",
		icon: "/flow.svg",
		disabled: false,
	},
	{
		chainType: "aptos" as ChainType,
		name: "Aptos",
		icon: "/aptos.svg",
		disabled: true,
	},
	{
		chainType: "bsc" as ChainType,
		name: "BSC",
		icon: "/token/bnb.png",
		disabled: true,
	},
];

// 支持的钱包
const WALLET_OPTIONS = [
	{
		walletType: "metamask" as WalletType,
		name: "MetaMask",
		icon: "/metamask.svg",
	},
	{
		walletType: "okx" as WalletType,
		name: "OKX Wallet",
		icon: "/okx.svg",
	},
];

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginCallback }) => {
	const { loginWithGoogle, loginWithWallet } = useAuth();
	const [isConnecting, setIsConnecting] = useState(false);
	const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
	const [selectedChain, setSelectedChain] = useState<ChainType>("ethereum");

	const handleGoogleLogin = async () => {
		try {
			await loginWithGoogle();
			if (onLoginCallback) {
				onLoginCallback();
			}
		} catch (error) {
			console.error("Google login failed:", error);
		}
	};

	const handleWalletLogin = async (walletType: WalletType) => {
		try {
			setIsConnecting(true);
			setSelectedWallet(walletType);

			const provider = getWalletProvider(walletType);

			if (!provider) {
				throw new Error(
					`${walletType === "metamask" ? "MetaMask" : "OKX Wallet"} not installed or not detected`
				);
			}

			let address = "";

			if (walletType === "metamask") {
				if (selectedChain === "aptos") {
					throw new Error("MetaMask does not support Aptos. Please select Ethereum or Flow, or use OKX Wallet.");
				}

				const accounts = await provider.request({ method: "eth_requestAccounts" });
				address = accounts[0];
			} else if (walletType === "okx") {
				if (selectedChain === "aptos") {
					if (!provider.aptos) {
						throw new Error("OKX Wallet Aptos support not available");
					}
					const accounts = await provider.aptos.account();
					address = accounts.address;
				} else {
					const accounts = await provider.request({ method: "eth_requestAccounts" });
					address = accounts[0];
				}
			}

			if (!address) {
				throw new Error("Failed to get wallet address");
			}

			console.log(`Successfully connected to ${walletType} wallet:`, address);

			await loginWithWallet({
				addr: address,
				walletType: walletType,
				chain: selectedChain,
			});

			if (onLoginCallback) {
				onLoginCallback();
			}
			onClose();
		} catch (error) {
			console.error("Wallet login failed:", error);
			alert(`Wallet connection failed: ${error instanceof Error ? error.message : "Unknown error"}`);
		} finally {
			setIsConnecting(false);
			setSelectedWallet(null);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
			<div className="bg-[#2a2a2a] px-8 py-10 rounded-lg max-w-md w-full relative">
				<button
					onClick={onClose}
					className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
				>
					<X className="w-6 h-6" />
				</button>

				<div className="text-center mb-8">
					<h2 className="text-2xl font-['Michroma'] text-white mb-2">Welcome to TradingFlow</h2>
					<p className="text-gray-400">Please sign in to continue</p>
				</div>

				<div className="space-y-6">
					{/* Google 登录 */}
					<button
						onClick={handleGoogleLogin}
						className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
					>
						<img src="/google.svg" alt="Google" className="w-6 h-6" />
						<span className="font-medium">Continue with Google</span>
					</button>

					{/* 分割线 */}
					<div className="flex items-center gap-4 my-6">
						<div className="flex-1 h-px bg-gray-600"></div>
						<span className="text-gray-400 text-sm">or</span>
						<div className="flex-1 h-px bg-gray-600"></div>
					</div>

					{/* Web3钱包登录 */}
					<div className="space-y-4">
						<h3 className="text-gray-300 text-sm font-medium">Connect with Web3 Wallet</h3>

						{/* 链选择 */}
						<div className="grid grid-cols-2 gap-3">
							{CHAIN_OPTIONS.map(chain => (
								<button
									key={chain.name}
									onClick={() => {
										if (!chain.disabled) {
											setSelectedChain(chain.chainType);
										}
									}}
									className={`
										relative p-3 rounded-lg border-2 transition-all duration-200 ${chain.disabled ? "" : "hover:scale-105"}
										${
											chain.disabled
												? "border-gray-700 !cursor-not-allowed"
												: selectedChain === chain.chainType
													? "border-blue-500 bg-blue-500/10"
													: "border-gray-600 bg-gray-700/50 hover:border-gray-500"
										}
									`}
								>
									<div className="flex flex-col items-center gap-2">
										<img src={chain.icon} alt={chain.name} className="w-8 h-8" />
										<span className="text-xs text-gray-300 font-medium">{chain.name}</span>
									</div>
								</button>
							))}
						</div>

						{/* 钱包选择 */}
						<div className="space-y-3">
							{WALLET_OPTIONS.map(wallet => {
								const isSelected = selectedWallet === wallet.walletType;
								const isLoading = isConnecting && isSelected;

								const isSupported =
									wallet.walletType === "okx" || (wallet.walletType === "metamask" && selectedChain !== "aptos");

								return (
									<button
										key={wallet.walletType}
										onClick={() => handleWalletLogin(wallet.walletType)}
										disabled={isConnecting || !isSupported}
										className={`
											w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg transition-colors
											${
												isSupported
													? "bg-gray-700 text-white hover:bg-gray-600"
													: "bg-gray-800 text-gray-500 cursor-not-allowed"
											}
											${isConnecting ? "opacity-50 cursor-not-allowed" : ""}
										`}
									>
										<img src={wallet.icon} alt={wallet.name} className="w-6 h-6" />
										<span className="font-medium">
											{isLoading ? "Connecting..." : wallet.name}
											{!isSupported && wallet.walletType === "metamask" && selectedChain === "aptos"
												? " (Not supported for Aptos)"
												: ""}
										</span>
									</button>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginModal; 