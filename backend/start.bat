@echo off
REM YouTube Music Backend 시작 스크립트 (Windows)

echo 🎵 YouTube Music Backend 시작...

REM 가상환경 확인
if not exist "venv" (
    echo ⚠️  가상환경이 없습니다. 생성 중...
    python -m venv venv
)

REM 가상환경 활성화
echo 📦 가상환경 활성화...
call venv\Scripts\activate.bat

REM 의존성 설치 확인
if not exist "venv\installed" (
    echo 📥 의존성 설치 중...
    pip install -r requirements.txt
    type nul > venv\installed
)

REM .env 파일 확인
if not exist ".env" (
    echo ⚠️  .env 파일이 없습니다. .env.example을 복사합니다...
    copy .env.example .env
)

REM 서버 시작
echo 🚀 서버 시작...
python main.py
