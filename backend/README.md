# YouTube Music Backend

FastAPI 기반의 YouTube Music API 백엔드 서버입니다. `ytmusicapi`를 사용하여 YouTube Music 데이터를 제공합니다.

## 설치

```bash
# 가상환경 생성 (선택사항)
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

## 실행

```bash
# 개발 서버 실행
python main.py

# 또는 uvicorn 직접 실행
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

서버는 `http://localhost:8000`에서 실행됩니다.

## API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API 엔드포인트

### 검색
- `GET /api/search?q={query}&limit={limit}` - 음악 검색

### 차트
- `GET /api/charts?limit={limit}` - 글로벌 인기 차트

### 플레이리스트
- `GET /api/playlists/featured?limit={limit}` - 추천 플레이리스트
- `GET /api/playlists/{playlist_id}` - 플레이리스트 상세 정보

### 노래
- `GET /api/songs/{video_id}` - 노래 상세 정보 및 스트리밍 URL

## 프론트엔드 연동

프론트엔드 프로젝트의 `.env` 파일에 다음을 추가하세요:

```env
VITE_YTMUSIC_API_URL=http://localhost:8000
```

## 주요 기능

- **글로벌 차트**: 인증 없이 사용 가능한 글로벌 차트 (country="ZZ")
- **음악 검색**: 노래, 앨범, 아티스트 검색
- **플레이리스트**: 추천 플레이리스트 및 상세 정보
- **스트리밍**: 노래 스트리밍 URL 제공

## 문제 해결

### 1. ytmusicapi 설치 오류
```bash
pip install --upgrade pip
pip install ytmusicapi
```

### 2. 포트 충돌
`.env` 파일에서 포트 변경:
```env
PORT=8001
```

### 3. CORS 에러
브라우저 콘솔에서 CORS 에러가 발생하면 `main.py`의 CORS 설정을 확인하세요.
