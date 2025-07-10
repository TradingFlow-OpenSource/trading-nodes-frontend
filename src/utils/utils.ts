// debounce promise
export const debouncePromise = <T extends (...args: any[]) => Promise<any>>(fn: T, delay: number): T => {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let latestPromise: Promise<any> | null = null;

	return ((...args: Parameters<T>) => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}

		if (latestPromise) {
			return latestPromise;
		}

		latestPromise = new Promise((resolve, reject) => {
			timeoutId = setTimeout(async () => {
				try {
					const result = await fn(...args);
					resolve(result);
				} catch (error) {
					reject(error);
				} finally {
					latestPromise = null;
					timeoutId = null;
				}
			}, delay);
		});

		return latestPromise;
	}) as T;
}; 