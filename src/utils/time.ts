/**
 * 초를 "분:초" 형식으로 변환
 * @param seconds 변환할 초
 * @returns "분:초" 형식의 문자열 (예: "3:45")
 */
export function formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * "분:초" 형식을 초로 변환
 * @param timeString "분:초" 형식의 문자열
 * @returns 총 초
 */
export function parseTime(timeString: string): number {
    const [mins, secs] = timeString.split(':').map(Number);
    return (mins || 0) * 60 + (secs || 0);
}
