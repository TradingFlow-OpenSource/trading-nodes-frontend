export interface Identity {
	_id: string;
	type: string;
	identifier: string;
	chain: string;
	isActive: boolean;
	metadata: {
		google?: {
			profile: {
				name: string;
				email: string;
				picture?: string;
			};
		};
		wallet?: {
			chain?: string;
			address: string;
			provider: WalletType;
			network: string;
		};
		telegram?: {
			chatId?: string;
			username?: string;
			firstName?: string;
			lastName?: string;
		};
	};
	createdAt: string;
	lastUsedAt: string;
	userId: string;
}

export type WalletType = "metamask" | "okx" | "phantom";

export interface WholeUser {
	user: {
		_id: string;
		name: string;
		avatar: string;
		createdAt: string;
		updatedAt: string;
		__v?: number;
		isActivated?: boolean;
	};
	identity?: Identity;
	identities?: Identity[];
	token?: string;
	name?: string;
	email?: string;
	avatar?: string;
	createdAt?: string;
	updatedAt?: string;
	__v?: number;
	isActivated?: boolean;
}

export interface PaginatedIdentities {
	data: Identity[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

export interface WalletVerifyResponse {
	token: string;
	user: WholeUser["user"];
	identity: Identity;
	bound: boolean;
}

export interface WalletNonceResponse {
	nonce: string;
	message: string;
}

export interface IdentityCheckResponse {
	status: "linkedToSelf" | "linkedToOther" | "notLinked";
	identity?: Identity;
} 