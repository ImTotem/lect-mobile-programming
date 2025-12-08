import { useState, useEffect } from 'react';
import { getLyrics } from '../services/lyrics';
import type { LyricLine } from '../types/music';
import { FiLoader } from 'react-icons/fi';

interface LyricsViewProps {
    lyricsBrowseId: string | undefined;
}

export default function LyricsView({ lyricsBrowseId }: LyricsViewProps) {
    const [lyrics, setLyrics] = useState<LyricLine[] | string | null>(null);
    const [source, setSource] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!lyricsBrowseId) {
            setLyrics(null);
            setLoading(false);
            setError('가사 정보가 없습니다.');
            return;
        }

        setLoading(true);
        setError(null);

        getLyrics(lyricsBrowseId)
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                    setLyrics(null);
                } else {
                    setLyrics(data.lyrics);
                    setSource(data.source);
                }
            })
            .catch(() => {
                setLyrics(null);
                setLoading(false); // Corrected from setIsLoading to setLoading
            })
            .finally(() => {
                setLoading(false);
            });
    }, [lyricsBrowseId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center">
                    <FiLoader className="w-8 h-8 animate-spin text-red-400 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">가사를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error || !lyrics) {
        return (
            <div className="flex items-center justify-center h-full bg-gradient-to-b from-gray-50 to-white">
                <div className="text-center text-gray-500">
                    <p className="text-sm">{error || '가사를 찾을 수 없습니다.'}</p>
                </div>
            </div>
        );
    }

    // Plain text lyrics
    if (typeof lyrics === 'string') {
        return (
            <div className="h-full overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-2xl mx-auto">
                    <div className="whitespace-pre-wrap text-gray-900 leading-relaxed text-center">
                        {lyrics}
                    </div>
                    {source && (
                        <div className="mt-8 text-sm text-gray-400 text-center">
                            출처: {source}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Array lyrics (ignore timestamps, just render text)
    if (Array.isArray(lyrics)) {
        return (
            <div className="h-full overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-2xl mx-auto space-y-2">
                    {lyrics.map((line, index) => (
                        <div key={line.id || index} className="text-center text-gray-900 text-lg py-1">
                            {line.text}
                        </div>
                    ))}
                    {source && (
                        <div className="mt-8 text-sm text-gray-400 text-center pt-8">
                            출처: {source}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
