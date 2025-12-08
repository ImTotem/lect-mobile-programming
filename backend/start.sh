#!/bin/bash

# YouTube Music Backend 시작 스크립트

echo "🎵 YouTube Music Backend 시작..."

# 가상환경 확인
if [ ! -d "venv" ]; then
    echo "⚠️  가상환경이 없습니다. 생성 중..."
    python3 -m venv venv
fi

# 가상환경 활성화
echo "📦 가상환경 활성화..."
source venv/bin/activate

# 의존성 설치 확인
if [ ! -f "venv/installed" ]; then
    echo "📥 의존성 설치 중..."
    pip install -r requirements.txt
    touch venv/installed
fi

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo "⚠️  .env 파일이 없습니다. .env.example을 복사합니다..."
    cp .env.example .env
fi

# 서버 시작
echo "🚀 서버 시작..."
python main.py
