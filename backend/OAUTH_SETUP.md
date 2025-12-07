# YouTube Music Backend - OAuth 설정 가이드

## OAuth 인증이 필요한 이유

한국에서는 YouTube Music이 Premium 회원만 사용할 수 있습니다. 따라서 차트 등의 기능을 사용하려면 OAuth 인증이 필요합니다.

## OAuth 설정 방법

### 1. 백엔드 디렉토리로 이동

```bash
cd /Users/sungbin/Documents/3-2/모바일프로그래밍\(캡스톤디자인\)/과제/ytmusic-backend
```

### 2. 가상환경 활성화

```bash
# Mac/Linux
source venv/bin/activate

# Windows
venv\Scripts\activate
```

### 3. OAuth 설정 실행

```bash
python -c "from ytmusicapi import YTMusic; YTMusic.setup_oauth(filepath='oauth.json', open_browser=True)"
```

### 4. 브라우저에서 로그인

- 브라우저가 자동으로 열립니다
- Google 계정으로 로그인
- YouTube Music Premium 계정 사용 권장
- 권한 승인

### 5. 서버 재시작

```bash
# 서버를 Ctrl+C로 종료 후 다시 시작
python main.py
```

## 필요한 권한

OAuth 설정 시 다음 권한이 필요합니다:
- YouTube Music 데이터 읽기
- 플레이리스트 접근
- 차트 데이터 접근

**추가 API 설정은 필요하지 않습니다.** ytmusicapi는 공식 YouTube Music API가 아닌 비공식 API를 사용하므로, Google Cloud Console에서 별도의 API 키나 OAuth 클라이언트를 생성할 필요가 없습니다.

## 확인 방법

OAuth 설정이 완료되면:

1. `oauth.json` 파일이 생성됩니다
2. 서버 재시작 후 `http://localhost:8000`에 접속
3. `"authenticated": true`가 표시되면 성공

## API 엔드포인트

### 인증 관련
- `GET /api/auth/status` - 인증 상태 확인
- `GET /api/auth/instructions` - OAuth 설정 가이드

### 음악 기능
- `GET /api/search` - 음악 검색 (인증 불필요)
- `GET /api/charts` - 한국 차트 (인증 필요)
- `GET /api/playlists/featured` - 추천 플레이리스트 (인증 불필요)
- `GET /api/playlists/{id}` - 플레이리스트 상세
- `GET /api/songs/{id}` - 노래 상세 정보

## 문제 해결

### "OAuth 인증이 필요합니다" 에러
- OAuth 설정을 완료하지 않았거나 `oauth.json` 파일이 없습니다
- 위의 OAuth 설정 방법을 따라 진행하세요

### 브라우저가 열리지 않음
```bash
# open_browser=False로 설정하고 URL을 수동으로 복사
python -c "from ytmusicapi import YTMusic; YTMusic.setup_oauth(filepath='oauth.json', open_browser=False)"
```

### Premium 계정이 없는 경우
- 일부 기능(검색, 플레이리스트)은 인증 없이 사용 가능
- 차트 기능은 Premium 계정 필요

## 프론트엔드 연동

프론트엔드에서 인증 상태를 확인하려면:

```typescript
const response = await fetch('http://localhost:8000/api/auth/status');
const { authenticated } = await response.json();

if (!authenticated) {
  // OAuth 설정 안내 표시
  const instructions = await fetch('http://localhost:8000/api/auth/instructions');
  const guide = await instructions.json();
  console.log(guide.steps);
}
```
