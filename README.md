# 🎮 Universal Game QA Analysis Tool

AI 기반 게임 리뷰 분석 및 QA 자동화 시스템

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![Claude AI](https://img.shields.io/badge/Claude-AI-8B5CF6)](https://www.anthropic.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ 주요 기능

### 🔴 실시간 데이터 수집
- ⏱️ **자동 폴링 시스템**: 10초/30초/1분/5분 주기 선택
- 🔔 **푸시 알림**: 새 리뷰 도착 시 실시간 알림
- 🟢 **라이브 인디케이터**: 수집 상태 실시간 표시

### 🎯 장르 필터링
- 🎮 **전체 장르 지원**: RPG, FPS, 전략, 캐주얼, MOBA 등
- 📊 **동적 통계**: 선택한 장르별 즉시 재계산
- 💡 **스마트 카운트**: 각 장르별 리뷰 개수 자동 표시

### 📈 데이터 분석
- 📊 **카테고리별 분석**: Bar Chart 시각화
- 🥧 **장르별 분포**: Pie Chart 시각화
- 📉 **감정 분석**: 불만/칭찬 비율 추적
- 🎯 **7가지 카테고리**: 밸런스, 과금, 버그, UI/UX, 콘텐츠, 그래픽, 재미

### 📝 데이터 관리
- 📤 **CSV 업로드**: 드래그 앤 드롭 지원
- 💾 **CSV 다운로드**: 분석 결과 백업
- ✍️ **수동 입력**: 직접 리뷰 추가
- 🗑️ **개별 삭제**: 불필요한 데이터 제거

### 🤖 AI 기능
- ✅ **QA 체크리스트 자동 생성**: Claude AI API 연동
- 🎯 **8가지 업데이트 유형**: 신규 캐릭터, 밸런스 패치, 맵 추가 등
- 📄 **Markdown 다운로드**: 생성된 체크리스트 저장

---

## 🚀 빠른 시작

### 필수 요구사항
```bash
Node.js 18.x 이상
React 18.x
```

### 설치

1. **저장소 클론**
```bash
git clone https://github.com/YOUR_USERNAME/universal-game-qa-tool.git
cd universal-game-qa-tool
```

2. **의존성 설치**
```bash
npm install
```

3. **개발 서버 실행**
```bash
npm start
```

4. **브라우저에서 열기**
```
http://localhost:3000
```

---

## 📦 의존성

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "recharts": "^2.10.0",
    "lucide-react": "^0.263.1"
  }
}
```

---

## 📊 사용 예시

### 1️⃣ 실시간 수집 시작
```javascript
1. "시작" 버튼 클릭
2. 수집 주기 선택 (10초/30초/1분/5분)
3. 자동으로 새 리뷰 수집 및 분석
```

### 2️⃣ 장르별 분석
```javascript
1. 상단 장르 필터에서 "RPG" 클릭
2. RPG 게임 리뷰만 필터링
3. 통계 및 차트 자동 업데이트
```

### 3️⃣ AI 체크리스트 생성
```javascript
1. "AI 체크리스트" 탭 클릭
2. 업데이트 유형 선택 (예: 밸런스 패치)
3. "QA 체크리스트 생성" 클릭
4. 자동 생성된 체크리스트 다운로드
```

### 4️⃣ CSV 데이터 업로드
```javascript
1. "데이터 관리" 탭 클릭
2. CSV 파일 드래그 앤 드롭
3. 자동으로 데이터 파싱 및 추가
```

---

## 🏗️ 프로젝트 구조

```
universal-game-qa-tool/
├── src/
│   ├── UniversalGameQATool.jsx    # 메인 컴포넌트
│   ├── App.js                      # 앱 진입점
│   └── index.js                    # React DOM 렌더링
├── public/
│   └── index.html
├── package.json
└── README.md
```

---

## 🎨 주요 컴포넌트

### 실시간 폴링 시스템
```javascript
const toggleRealTime = () => {
  if (isRealTimeEnabled) {
    clearInterval(intervalRef.current);
    setIsRealTimeEnabled(false);
  } else {
    setIsRealTimeEnabled(true);
    intervalRef.current = setInterval(() => {
      simulateNewReview();
    }, pollingInterval * 1000);
  }
};
```

### 장르 필터링
```javascript
const filteredReviews = selectedGenre === '전체' 
  ? reviews 
  : reviews.filter(review => review.genre === selectedGenre);
```

### AI 체크리스트 생성
```javascript
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }]
  })
});
```

---

## 📋 CSV 파일 형식

```csv
게임명,장르,리뷰내용,카테고리,감정
리니지M,RPG,신규 직업이 너무 강해요,밸런스,불만
원신,RPG,그래픽이 훌륭해요,그래픽,칭찬
배틀그라운드,FPS,핵 유저가 많아요,버그,불만
```

**지원 카테고리**: 밸런스, 과금, 버그, UI/UX, 콘텐츠, 그래픽, 재미  
**지원 감정**: 불만, 칭찬  
**지원 장르**: RPG, FPS, 전략, 캐주얼, MOBA, 스포츠, 레이싱, 리듬, 카드, 시뮬레이션 등

---

## 🔧 환경 변수 설정

실제 API 연동 시 `.env` 파일 생성:

```bash
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
REACT_APP_POLLING_ENDPOINT=your_polling_endpoint
```

---

## 🛠️ 실제 환경 적용

현재는 **시뮬레이션 모드**입니다. 실제 환경에서는:

### 1. API 엔드포인트 설정
```javascript
// simulateNewReview() 대신
const fetchRealReviews = async () => {
  const response = await fetch('YOUR_API_ENDPOINT');
  const newReviews = await response.json();
  setReviews(prev => [...newReviews, ...prev]);
};
```

### 2. 크롤링 스크립트 연동
```python
# Python 크롤러와 연동
pip install google-play-scraper app-store-scraper
python game_review_crawler.py
```

### 3. WebSocket 실시간 연결
```javascript
const ws = new WebSocket('wss://your-server.com/reviews');
ws.onmessage = (event) => {
  const newReview = JSON.parse(event.data);
  setReviews(prev => [newReview, ...prev]);
};
```

---

## 🤝 기여 가이드

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 변경 로그

### v1.2.0 (2026-01-28)
- ✅ 장르 필터 최상단 이동
- 🎨 장르 버튼 UI 개선 (Gradient + Ring)
- 📍 전역 필터로 모든 탭에서 접근 가능

### v1.1.0 (2026-01-28)
- ✅ 장르별 필터링 기능 추가
- 📊 필터링된 데이터 기반 통계 재계산
- 🎯 빈 상태 UI 처리

### v1.0.0 (2026-01-28)
- 🎉 초기 릴리스
- ⏱️ 실시간 폴링 시스템
- 🔔 푸시 알림 기능
- 📊 데이터 분석 및 시각화
- 🤖 AI 체크리스트 자동 생성

---

## 📄 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

---

## 👨‍💻 개발자

- **Your Name** - [@haneulk1004](https://github.com/haneulk1004)

---

## 🙏 감사의 말

- [Recharts](https://recharts.org/) - 차트 라이브러리
- [Lucide React](https://lucide.dev/) - 아이콘 라이브러리
- [Anthropic Claude](https://www.anthropic.com/) - AI API
- [Tailwind CSS](https://tailwindcss.com/) - 스타일링

---

## 📞 문의

- Email: sonicsilver@naver.com
- GitHub Issues: [Issues Page](https://github.com/haneulk1004/universal-game-qa-tool/issues)

---

**⭐ 이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!**
