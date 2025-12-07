# YouTube Music Backend 설치 및 실행 가이드

## 프로젝트 구조

```
ytmusic-backend/
├── main.py              # FastAPI 메인 애플리케이션
├── requirements.txt     # Python 의존성
├── .env.example        # 환경 변수 예제
├── .gitignore          # Git 무시 파일
├── README.md           # 프로젝트 문서
├── start.sh            # Linux/Mac 시작 스크립트
└── start.bat           # Windows 시작 스크립트
```

## 빠른 시작

### 1. 의존성 설치

```bash
# 가상환경 생성 (권장)
python3 -m venv venv

# 가상환경 활성화
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.example .env
```

### 3. 서버 실행

#### 방법 1: Python 직접 실행
```bash
python main.py
```

#### 방법 2: 시작 스크립트 사용
```bash
# Mac/Linux
chmod +x start.sh
./start.sh

# Windows
start.bat
```

#### 방법 3: uvicorn 직접 실행
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

서버가 `http://localhost:8000`에서 실행됩니다.

## API 문서

서버 실행 후 다음 URL에서 자동 생성된 API 문서를 확인할 수 있습니다:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API 엔드포인트

### 1. 검색
```
GET /api/search?q={query}&limit={limit}
```
- **설명**: 음악 검색
- **파라미터**:
  - `q` (필수): 검색 쿼리
  - `limit` (선택, 기본값: 20): 결과 개수 (1-50)
- **응답 예시**:
```json
{
  "results": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Never Gonna Give You Up",
      "artist": "Rick Astley",
      "album": "Whenever You Need Somebody",
      "thumbnail": "https://...",
      "duration": "3:33",
      "videoId": "dQw4w9WgXcQ"
    }
  ],
  "count": 20
}
```

### 2. 인기 차트
```
GET /api/charts?limit={limit}
```
- **설명**: 인기 차트 가져오기
- **파라미터**:
  - `limit` (선택, 기본값: 20): 결과 개수 (1-50)

### 3. 추천 플레이리스트
```
GET /api/playlists/featured?limit={limit}
```
- **설명**: 추천 플레이리스트 목록
- **파라미터**:
  - `limit` (선택, 기본값: 10): 결과 개수 (1-20)

### 4. 플레이리스트 상세
```
GET /api/playlists/{playlist_id}?limit={limit}
```
- **설명**: 플레이리스트 상세 정보 및 트랙 목록
- **파라미터**:
  - `playlist_id` (필수): 플레이리스트 ID
  - `limit` (선택, 기본값: 50): 트랙 개수 (1-100)

### 5. 노래 상세 정보
```
GET /api/songs/{video_id}
```
- **설명**: 노래 상세 정보 및 스트리밍 URL
- **파라미터**:
  - `video_id` (필수): YouTube 비디오 ID
- **응답 예시**:
```json
{
  "id": "dQw4w9WgXcQ",
  "title": "Never Gonna Give You Up",
  "artist": "Rick Astley",
  "thumbnail": "https://...",
  "duration": "213",
  "streamUrl": "https://...",
  "videoId": "dQw4w9WgXcQ"
}
```

## 프론트엔드 연동

### 1. 환경 변수 설정

프론트엔드 프로젝트의 `.env` 파일에 다음을 추가:

```env
VITE_YTMUSIC_API_URL=http://localhost:8000
```

### 2. 서비스 파일 사용

`src/services/ytmusic.ts` 파일을 사용하여 API를 호출:

```typescript
import { searchMusic, getTrendingMusic } from './services/ytmusic';

// 음악 검색
const results = await searchMusic('Rick Astley');

// 인기 차트
const trending = await getTrendingMusic();
```

### 3. 서비스 인덱스 업데이트

`src/services/index.ts`에서 ytmusic을 기본으로 export:

```typescript
export {
  searchMusic,
  getTrendingMusic,
  getFeaturedPlaylists,
  getPlaylistTracks,
  formatDuration,
  playAudio,
} from './ytmusic';
```

## 개발 팁

### CORS 설정
프로덕션 환경에서는 `main.py`의 CORS 설정을 수정하세요:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # 특정 도메인만 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 로그 확인
서버 실행 시 콘솔에서 API 요청 로그를 확인할 수 있습니다.

### 에러 처리
모든 API 엔드포인트는 에러 발생 시 적절한 HTTP 상태 코드와 에러 메시지를 반환합니다.

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

## 라이선스

이 프로젝트는 교육 목적으로 만들어졌습니다.
