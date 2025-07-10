import { WholeUser } from "../services/authAPI/model";
import { setSessionItem } from "@/utils/storage";
import { create } from "zustand";

interface AuthState {
	wholeUser: WholeUser | null;
	loading: boolean;
	error: string | null;
	setWholeUser: (user: WholeUser | null) => void;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;
	reset: () => void;
}

export const useAuthStore = create<AuthState>(set => {
	// 初始化时检查 sessionStorage 中是否有 userInfo
	let initialUser = null;
	try {
		const storedUserInfo = sessionStorage.getItem("userInfo");
		if (storedUserInfo) {
			initialUser = JSON.parse(storedUserInfo);
		}
	} catch (error) {
		console.error("Failed to parse userInfo from sessionStorage:", error);
	}

	return {
		wholeUser: initialUser,
		loading: false,
		error: null,
		setWholeUser: user => {
			setSessionItem("userInfo", JSON.stringify(user));
			set({ wholeUser: user });
		},
		setLoading: loading => set({ loading }),
		setError: error => set({ error }),
		reset: () => {
			sessionStorage.removeItem("userInfo");
			set({ wholeUser: null, loading: false, error: null });
		},
	};
}); 