from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from ytmusicapi import YTMusic
import yt_dlp
import os
import traceback
from dotenv import load_dotenv
from datetime import datetime, timedelta

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

# 전역 yt-dlp 인스턴스 (캐싱 성능 향상)
ydl_opts = {
    'format': 'bestaudio/best',
    'quiet': True,
    'no_warnings': True,
    'noplaylist': True,
    'extract_flat': False,
    'cachedir': '/tmp/yt-dlp-cache',
    'age_limit': None,
    'nocheckcertificate': True,
}
ydl = yt_dlp.YoutubeDL(ydl_opts)

# 스트리밍 URL 캐시 (video_id: {url, expires_at})
# YouTube URL은 약 6시간 유효하므로 5시간 캐싱
url_cache = {}


@app.get("/")
async def root():
    return {
        "message": "YouTube Music API",
        "docs": "/docs",
        "version": "1.0.0"
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


@app.get("/api/search/suggestions")
async def get_search_suggestions(
    q: str = Query(..., description="검색 쿼리")
):
    try:
        suggestions = ytmusic.get_search_suggestions(q, detailed_runs=False)
        return {"results": suggestions}
    except Exception as e:
        return {"results": []}


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
        home = ytmusic.get_home(limit=50)
        
        playlists = []
        # '나를 위한 추천 재생목록' 섹션 찾기
        for section in home:
            section_title = section.get("title", "")
            
            # '나를 위한 추천 재생목록' 섹션만 처리
            if section_title == "맞춤 추천 뮤직 스테이션" and section.get("contents"):
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
        
        # 캐시 확인
        now = datetime.now()
        if video_id in url_cache:
            cached = url_cache[video_id]
            if cached['expires_at'] > now:
                # 캐시된 URL 사용 (매우 빠름!)
                audio_url = cached['url']
                title = cached.get('title', '')
                artist = cached.get('artist', 'Unknown Artist')
                thumbnail = cached.get('thumbnail', '')
                duration = cached.get('duration', '0')
                lyrics_browse_id = cached.get('lyricsBrowseId')
            else:
                # 만료된 캐시 삭제
                del url_cache[video_id]
        
        # 캐시 미스 - yt-dlp로 추출
        if not audio_url:
            try:
                youtube_url = f"https://music.youtube.com/watch?v={video_id}"
                
                # 전역 ydl 인스턴스 사용 (캐싱 활용)
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
                    
                    # 캐시에 저장 (5시간 유효) - lyrics_browse_id는 나중에 추가
                    if audio_url:
                        url_cache[video_id] = {
                            'url': audio_url,
                            'title': title,
                            'artist': artist,
                            'thumbnail': thumbnail,
                            'duration': duration,
                            'lyricsBrowseId': None,  # 나중에 업데이트
                            'expires_at': now + timedelta(hours=5)
                        }
                        
            except Exception as e:
                audio_url = None
        
        # 2. ytmusicapi로 메타데이터 보완 (yt-dlp가 실패하거나 메타데이터가 부족한 경우)
        lyrics_browse_id = None
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
            
            # 가사 browse ID 가져오기 - get_watch_playlist 사용
            if lyrics_browse_id is None:  # 캐시에 없으면 가져오기
                try:
                    watch_playlist = ytmusic.get_watch_playlist(videoId=video_id)
                    lyrics_browse_id = watch_playlist.get('lyrics')
                    
                    # 캐시에 lyrics_browse_id 업데이트
                    if video_id in url_cache:
                        url_cache[video_id]['lyricsBrowseId'] = lyrics_browse_id
                except Exception as lyrics_error:
                    pass
        except Exception as meta_error:
            pass
        
        return {
            "id": video_id,
            "title": title,
            "artist": artist,
            "thumbnail": thumbnail,
            "duration": duration,
            "streamUrl": audio_url,  # yt-dlp가 서명 해결한 URL
            "videoId": video_id,
            "lyricsBrowseId": lyrics_browse_id  # 가사 browse ID 추가
        }

    
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"노래 정보 조회 중 오류 발생: {str(e)}")


@app.get("/api/lyrics/{browse_id}")
async def get_lyrics(browse_id: str):
    """
    Get lyrics for a song by browse ID
    browse_id should be the lyrics browse ID from the song metadata
    """
    try:
        # Fetch lyrics directly
        lyrics_data = ytmusic.get_lyrics(browse_id)
        
        if not lyrics_data:
            return {
                "lyrics": None,
                "hasTimestamps": False,
                "source": None,
                "error": "가사를 찾을 수 없습니다"
            }
        
        # Convert LyricLine objects to dictionaries if present
        lyrics_lines = lyrics_data.get('lyrics', [])
        
        # Detect if lyrics have timestamps by checking the first line
        has_timestamps = False
        if isinstance(lyrics_lines, list) and len(lyrics_lines) > 0:
            first_line = lyrics_lines[0]
            # Check if the first line has start_time attribute
            if hasattr(first_line, 'start_time') and first_line.start_time is not None:
                has_timestamps = True
        
        # If lyrics is a list of LyricLine objects, convert to dict
        if isinstance(lyrics_lines, list) and len(lyrics_lines) > 0:
            lyrics_formatted = [
                {
                    "text": line.text if hasattr(line, 'text') else str(line),
                    "startTime": line.start_time if hasattr(line, 'start_time') else None,
                    "endTime": line.end_time if hasattr(line, 'end_time') else None,
                    "id": line.id if hasattr(line, 'id') else None
                }
                for line in lyrics_lines
            ]
        elif isinstance(lyrics_lines, str):
            # Plain text lyrics
            lyrics_formatted = lyrics_lines
            has_timestamps = False
        else:
            lyrics_formatted = None
        
        
        return {
            "lyrics": lyrics_formatted,
            "hasTimestamps": has_timestamps,
            "source": lyrics_data.get('source'),
            "error": None
        }
    except Exception as e:
        print(f"Error fetching lyrics for {browse_id}: {str(e)}")
        traceback.print_exc()
        return {
            "lyrics": None,
            "hasTimestamps": False,
            "source": None,
            "error": f"가사를 가져오는 중 오류가 발생했습니다: {str(e)}"
        }



@app.get("/api/charts/list")
async def get_chart_list():
    try:
        # 한국 차트 목록 조회
        charts = ytmusic.get_charts(country="KR")
        
        results = []
        
        # 차트 데이터 파싱
        # charts는 {'countries': {...}, 'global': {...}, 'videos': {...}, 'artists': {...}} 형태일 수 있음
        # 또는 바로 리스트일 수도 있음 (ytmusicapi 버전에 따라 다름)
        
        # 주요 차트 카테고리 순회
        chart_categories = ["videos", "artists", "daily", "weekly", "trending"]
        
        for category in chart_categories:
            if category in charts and charts[category]:
                items = charts[category]
                # items는 리스트 또는 딕셔너리
                if isinstance(items, list):
                    for item in items: # list limiting is handled in frontend or by nature of limited charts
                        # playlistId가 있는 항목만 처리 (재생 가능한 차트)
                        if "playlistId" in item:
                            thumbnail = ""
                            if item.get("thumbnails"):
                                thumbnail = item["thumbnails"][-1]["url"]
                            
                            chart = {
                                "id": int(datetime.now().timestamp() * 1000) + hash(item.get("playlistId")), # 임의 ID
                                "title": item.get("title", f"Top Chart ({category})"),
                                "country": "KR",
                                "thumbnail": thumbnail,
                                "songs": 100, # 대략적인 수치
                                "playlistId": item.get("playlistId"),
                                "params": item.get("params")
                            }
                            results.append(chart)

        # 결과가 없으면 트렌딩 음악으로 기본 차트 구성 시도 (Fallback)
        if not results:
             results.append({
                 "id": 1,
                 "title": "한국 인기곡 Top 100",
                 "country": "KR",
                 "thumbnail": "https://music.youtube.com/img/trending/trending_1.png", # Fallback image
                 "songs": 100,
                 "playlistId": "PL4fGSI1pDJn6jXS_Ix_YyccC20CsxbklJ" # Default Top 100 KR ID
             })
             
        return {"results": results}
    
    except Exception as e:
        traceback.print_exception(e)
        # 오류 발생 시 빈 리스트 반환 (프론트엔드에서 처리)
        return {"results": []}


@app.get("/api/moods/playlists")
async def get_mood_playlists(
    params: str = Query(..., description="무드/장르 파라미터")
):
    try:
        # 해당 무드/장르의 플레이리스트 조회
        playlists = ytmusic.get_mood_playlists(params=params)
        
        results = []
        for item in playlists:
            thumbnail = ""
            if item.get("thumbnails"):
                thumbnail = item["thumbnails"][-1]["url"]
            
            playlist = {
                "id": item.get("playlistId", ""),
                "title": item.get("title", ""),
                "description": item.get("description", ""),
                "thumbnail": thumbnail,
                "tracksCount": int(item.get("count", "0").split(" ")[0].replace(",", "")) if item.get("count") else 0,
                "author": item.get("author", "")
            }
            results.append(playlist)
            
        return {"results": results}
        
    except Exception as e:
        traceback.print_exception(e)
        raise HTTPException(status_code=500, detail=f"플레이리스트 조회 중 오류 발생: {str(e)}")


@app.get("/api/moods")
async def get_mood_categories():
    try:
        categories = ytmusic.get_mood_categories()
        
        # Transform into a more frontend-friendly format
        result = {}
        for section_title, items in categories.items():
            formatted_items = []
            for item in items:
                formatted_items.append({
                    "title": item.get("title"),
                    "params": item.get("params") 
                })
            result[section_title] = formatted_items
            
        return result
    except Exception as e:
        print(f"Error fetching mood categories: {str(e)}")
        # Fallback empty structure if API fails
        return {}


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
