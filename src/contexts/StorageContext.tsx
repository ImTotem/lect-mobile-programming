import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Song } from '../types/music';
import { getStorageItem, setStorageItem } from '../utils/storage';

const STORAGE_KEYS = {
    LIKED_SONGS: 'library_liked_songs',
    RECENT_SONGS: 'library_recent_songs',
};

interface StorageContextType {
    likedSongs: Song[];
    recentSongs: Song[];
    toggleLike: (song: Song) => void;
    isLiked: (songId: string) => boolean;
    addToRecent: (song: Song) => void;
    clearRecent: () => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export function StorageProvider({ children }: { children: ReactNode }) {
    const [likedSongs, setLikedSongs] = useState<Song[]>(() =>
        getStorageItem<Song[]>(STORAGE_KEYS.LIKED_SONGS, [])
    );

    const [recentSongs, setRecentSongs] = useState<Song[]>(() =>
        getStorageItem<Song[]>(STORAGE_KEYS.RECENT_SONGS, [])
    );

    // Sync with localStorage whenever state changes
    useEffect(() => {
        setStorageItem(STORAGE_KEYS.LIKED_SONGS, likedSongs);
    }, [likedSongs]);

    useEffect(() => {
        setStorageItem(STORAGE_KEYS.RECENT_SONGS, recentSongs);
    }, [recentSongs]);

    const toggleLike = useCallback((song: Song) => {
        setLikedSongs((prev) => {
            const exists = prev.some((s) => s.id === song.id);
            if (exists) {
                return prev.filter((s) => s.id !== song.id);
            } else {
                return [song, ...prev];
            }
        });
    }, []);

    const isLiked = useCallback((songId: string) => {
        return likedSongs.some((s) => s.id === songId);
    }, [likedSongs]);

    const addToRecent = useCallback((song: Song) => {
        setRecentSongs((prev) => {
            // Remove if already exists to move it to the top
            const filtered = prev.filter((s) => s.id !== song.id);
            // Add to top, limit to 50 items
            return [song, ...filtered].slice(0, 50);
        });
    }, []);

    const clearRecent = useCallback(() => {
        setRecentSongs([]);
    }, []);

    return (
        <StorageContext.Provider value={{ likedSongs, recentSongs, toggleLike, isLiked, addToRecent, clearRecent }}>
            {children}
        </StorageContext.Provider>
    );
}

export function useStorage() {
    const context = useContext(StorageContext);
    if (!context) {
        throw new Error('useStorage must be used within a StorageProvider');
    }
    return context;
}
