export interface EthereumProvider {
	request: (args: { method: string; params?: any[] }) => Promise<any>;
	on: (eventName: string, handler: (...args: any[]) => void) => void;
	removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
}

export interface SignMessagePayload {
	address?: boolean;
	application?: boolean;
	chainId?: boolean;
	message: string;
	nonce: string;
}

export interface SignMessageResponse {
	address: string;
	application: string;
	chainId: number;
	fullMessage: string;
	message: string;
	nonce: string;
	prefix: string;
	signature: string;
}

export interface OKXWalletProvider {
	request: (args: { method: string; params?: any[] }) => Promise<any>;
	on: (eventName: string, handler: (...args: any[]) => void) => void;
	removeListener: (eventName: string, handler: (...args: any[]) => void) => void;
	aptos: {
		account: () => Promise<{ address: string; publicKey: string }>;
		connect: () => Promise<{ address: string; publicKey: string }>;
		signMessage: (message: SignMessagePayload) => Promise<SignMessageResponse>;
		signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
		isConnected: () => Promise<boolean>;
	};
	flow: {
		account: () => Promise<{ address: string; publicKey: string }>;
		connect: () => Promise<{ address: string; publicKey: string }>;
		signMessage: (message: SignMessagePayload) => Promise<SignMessageResponse>;
		signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
		isConnected: () => Promise<boolean>;
	};
}

export interface TelegramAuthUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
	photo_url?: string;
	auth_date: number;
	hash: string;
}

declare global {
	interface Window {
		ethereum?: EthereumProvider;
		okxwallet?: OKXWalletProvider;
		onTelegramAuth?: (user: TelegramAuthUser) => void;
	}
} 