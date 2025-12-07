from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from ytmusicapi import YTMusic
import os
import traceback
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="YouTube Music API",
    description="YouTube Music API using ytmusicapi",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ytmusic = YTMusic("browser.json", language="ko")


@app.get("/")
async def root():
    return {
        "message": "YouTube Music API",
        "docs": "/docs",
        "version": "1.0.0",
        "authenticated": True
    }


@app.get("/api/search")
async def search_music(
    q: str = Query(..., description="검색 쿼리"),
    limit: int = Query(20, ge=1, le=50, description="결과 개수")
):
    try:
        results = ytmusic.search(q, filter="songs", limit=limit, ignore_spelling=True)
        
        songs = []
        for item in results:
            thumbnail = ""
            if item.get("thumbnails"):
                thumbnail = item["thumbnails"][-1]["url"]
            
            artists = []
            if item.get("artists"):
                artists = [artist["name"] for artist in item["artists"]]
            
            album = ""
            if item.get("album"):
                album = item["album"]["name"]
            
            duration = item.get("duration", "0:00")
            
            song = {
                "id": item.get("videoId", ""),
                "title": item.get("title", ""),
                "artist": ", ".join(artists) if artists else "Unknown Artist",
                "album": album or "Unknown Album",
                "thumbnail": thumbnail,
                "duration": duration,
                "videoId": item.get("videoId", "")
            }
            songs.append(song)
        
        return {"results": songs, "count": len(songs)}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"검색 중 오류 발생: {str(e)}")


@app.get("/api/charts")
async def get_charts(
    limit: int = Query(20, ge=1, le=50, description="결과 개수")
):
    try:
        # 한국 차트 사용
        charts = ytmusic.get_charts(country="KR")
        
        songs = []
        
        # daily 차트 우선 (한국 인기곡 Top100)
        chart_playlist_id = None
        if charts and "daily" in charts and len(charts["daily"]) > 0:
            chart_playlist_id = charts["daily"][0].get("playlistId")
        # daily가 없으면 weekly 사용
        elif charts and "weekly" in charts and len(charts["weekly"]) > 0:
            chart_playlist_id = charts["weekly"][0].get("playlistId")
        
        if chart_playlist_id:
            playlist = ytmusic.get_playlist(chart_playlist_id, limit=limit)
            
            if playlist.get("tracks"):
                for track in playlist["tracks"][:limit]:
                    track_thumbnail = ""
                    if track.get("thumbnails"):
                        track_thumbnail = track["thumbnails"][-1]["url"]
                    
                    artists = []
                    if track.get("artists"):
                        artists = [artist["name"] for artist in track["artists"]]
                    
                    album = ""
                    if track.get("album"):
                        album = track["album"]["name"]
                    
                    song = {
                        "id": track.get("videoId", ""),
                        "title": track.get("title", ""),
                        "artist": ", ".join(artists) if artists else "Unknown Artist",
                        "album": album or "Chart",
                        "thumbnail": track_thumbnail,
                        "duration": track.get("duration", "0:00"),
                        "videoId": track.get("videoId", "")
                    }
                    songs.append(song)
        
        return {"results": songs, "count": len(songs)}
    
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=500, detail=f"차트 조회 중 오류 발생: {str(e)}")


@app.get("/api/playlists/featured")
async def get_featured_playlists(
    limit: int = Query(10, ge=1, le=20, description="결과 개수")
):
    try:
        home = ytmusic.get_home(limit=limit)
        
        playlists = []
        # '나를 위한 추천 재생목록' 섹션 찾기
        for section in home:
            section_title = section.get("title", "")
            
            # '나를 위한 추천 재생목록' 섹션만 처리
            if section_title == "나를 위한 추천 재생목록" and section.get("contents"):
                for item in section["contents"]:
                    # playlistId가 있는 항목만 처리
                    playlist_id = item.get("playlistId")
                    
                    # playlistId가 있고, 비디오가 아닌 실제 플레이리스트만 추가
                    # RDAM, RDAMVM으로 시작하는 것은 라디오/믹스이므로 제외
                    if playlist_id and not playlist_id.startswith("RDAM"):
                        thumbnail = ""
                        if item.get("thumbnails"):
                            thumbnail = item["thumbnails"][-1]["url"]
                        
                        # description 필드 사용
                        description = item.get("description", "")
                        
                        playlist = {
                            "id": playlist_id,
                            "title": item.get("title", ""),
                            "description": description,
                            "thumbnail": thumbnail,
                            "tracksCount": 0  # get_home에서는 트랙 수 정보가 없을 수 있음
                        }
                        playlists.append(playlist)
                        
                        # limit에 도달하면 중단
                        if len(playlists) >= limit:
                            break
                
                # 해당 섹션을 찾았으면 더 이상 검색하지 않음
                break
        
        return {"results": playlists, "count": len(playlists)}
    
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=500, detail=f"플레이리스트 조회 중 오류 발생: {str(e)}")


@app.get("/api/playlists/{playlist_id}")
async def get_playlist(
    playlist_id: str,
    limit: int = Query(50, ge=1, le=100, description="트랙 개수")
):
    try:
        playlist = ytmusic.get_playlist(playlist_id, limit=limit)
        
        thumbnail = ""
        if playlist.get("thumbnails"):
            thumbnail = playlist["thumbnails"][-1]["url"]
        
        tracks = []
        if playlist.get("tracks"):
            for track in playlist["tracks"]:
                track_thumbnail = ""
                if track.get("thumbnails"):
                    track_thumbnail = track["thumbnails"][-1]["url"]
                
                artists = []
                if track.get("artists"):
                    artists = [artist["name"] for artist in track["artists"]]
                
                album = ""
                if track.get("album"):
                    album = track["album"]["name"]
                
                song = {
                    "id": track.get("videoId", ""),
                    "title": track.get("title", ""),
                    "artist": ", ".join(artists) if artists else "Unknown Artist",
                    "album": album or "Unknown Album",
                    "thumbnail": track_thumbnail,
                    "duration": track.get("duration", "0:00"),
                    "videoId": track.get("videoId", "")
                }
                tracks.append(song)
        
        return {
            "id": playlist_id,
            "title": playlist.get("title", ""),
            "description": playlist.get("description", ""),
            "thumbnail": thumbnail,
            "tracksCount": len(tracks),
            "tracks": tracks
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"플레이리스트 조회 중 오류 발생: {str(e)}")


@app.get("/api/songs/{video_id}")
async def get_song(video_id: str):
    try:
        audio_url = None
        title = ""
        artist = "Unknown Artist"
        thumbnail = ""
        duration = "0"
        
        # 1. yt-dlp로 스트리밍 URL 추출 (signatureCipher 자동 해결)
        try:
            import yt_dlp
            
            ydl_opts = {
                'format': 'bestaudio/best',
                'quiet': True,
                'no_warnings': True,
                'noplaylist': True,
                'extract_flat': False,
                # 캐싱 옵션 추가 (성능 향상)
                'cachedir': '/tmp/yt-dlp-cache',
                'age_limit': None,
                'nocheckcertificate': True,
            }
            
            youtube_url = f"https://music.youtube.com/watch?v={video_id}"
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(youtube_url, download=False)
                
                if info:
                    audio_url = info.get('url')
                    title = info.get('title', '')
                    # yt-dlp에서 가져온 정보 사용
                    if info.get('thumbnail'):
                        thumbnail = info['thumbnail']
                    if info.get('duration'):
                        duration = str(int(info['duration']))
                    if info.get('uploader'):
                        artist = info['uploader']
                        
        except Exception as e:
            print(f"yt-dlp error: {e}")
            audio_url = None
        
        # 2. ytmusicapi로 메타데이터 보완 (yt-dlp가 실패하거나 메타데이터가 부족한 경우)
        try:
            song = ytmusic.get_song(video_id)
            video_details = song.get("videoDetails", {})
            
            # yt-dlp에서 가져오지 못한 정보만 보완
            if not title:
                title = video_details.get("title", "")
            if artist == "Unknown Artist":
                artist = video_details.get("author", "Unknown Artist")
            if not thumbnail and video_details.get("thumbnail", {}).get("thumbnails"):
                thumbnails = video_details["thumbnail"]["thumbnails"]
                if thumbnails:
                    thumbnail = thumbnails[-1]["url"]
            if duration == "0":
                duration = video_details.get("lengthSeconds", "0")
                
        except Exception as meta_error:
            print(f"ytmusicapi metadata error: {meta_error}")
        
        return {
            "id": video_id,
            "title": title,
            "artist": artist,
            "thumbnail": thumbnail,
            "duration": duration,
            "streamUrl": audio_url,  # yt-dlp가 서명 해결한 URL
            "videoId": video_id
        }
    
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=500, detail=f"노래 정보 조회 중 오류 발생: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    )
