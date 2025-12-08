/**
 * localStorage에서 JSON 데이터를 안전하게 가져옴
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        return defaultValue;
    }
}

/**
 * localStorage에 JSON 데이터를 안전하게 저장
 */
export function setStorageItem<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
    }
}

/**
 * localStorage에서 항목 제거
 */
export function removeStorageItem(key: string): void {
    try {
        localStorage.removeItem(key);
    } catch (error) {
    }
}

/**
 * localStorage 전체 초기화
 */
export function clearStorage(): void {
    try {
        localStorage.clear();
    } catch (error) {
    }
}
