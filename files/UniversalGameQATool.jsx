import React, { useState, useRef } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, FileText, Sparkles, Download, Upload, Database, Plus, Trash2, X } from 'lucide-react';

// CSS 애니메이션 스타일
const styles = `
  @keyframes slide-in-right {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .animate-slide-in-right {
    animation: slide-in-right 0.3s ease-out;
  }
`;

const UniversalGameQATool = () => {
  const [activeTab, setActiveTab] = useState('analysis');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChecklist, setGeneratedChecklist] = useState('');
  const [updateType, setUpdateType] = useState('');
  
  // 데이터 관리
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);
  
  // 실시간 기능
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [newReviewNotification, setNewReviewNotification] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(30); // 초 단위
  const intervalRef = useRef(null);
  
  // 필터 기능
  const [selectedGenre, setSelectedGenre] = useState('전체');
  
  // 수동 입력 폼
  const [manualInput, setManualInput] = useState({
    game: '',
    genre: 'RPG',
    review: '',
    category: '밸런스',
    sentiment: '불만'
  });

  // 초기 샘플 데이터 (다양한 게임 장르)
  const [reviews, setReviews] = useState([
    // RPG 게임
    { game: '리니지M', genre: 'RPG', review: '신규 직업이 기존 직업보다 너무 강해요', category: '밸런스', sentiment: '불만' },
    { game: '리니지M', genre: 'RPG', review: '강화 확률이 너무 낮아서 과금 압박이 심해요', category: '과금', sentiment: '불만' },
    { game: '검은사막 모바일', genre: 'RPG', review: '그래픽이 정말 좋아요', category: '그래픽', sentiment: '칭찬' },
    { game: '검은사막 모바일', genre: 'RPG', review: '자동사냥만 하게 돼서 지루해요', category: '콘텐츠', sentiment: '불만' },
    { game: '로스트아크', genre: 'RPG', review: '레이드 난이도가 너무 높아요', category: '밸런스', sentiment: '불만' },
    
    // FPS 게임
    { game: '배틀그라운드 모바일', genre: 'FPS', review: '핵 유저가 너무 많아요', category: '버그', sentiment: '불만' },
    { game: '배틀그라운드 모바일', genre: 'FPS', review: '총기 밸런스 패치 후 더 나빠졌어요', category: '밸런스', sentiment: '불만' },
    { game: '콜 오브 듀티 모바일', genre: 'FPS', review: '조작감이 부드럽고 좋아요', category: 'UI/UX', sentiment: '칭찬' },
    { game: '콜 오브 듀티 모바일', genre: 'FPS', review: '렉이 심해서 게임이 안 돼요', category: '버그', sentiment: '불만' },
    
    // 전략 게임
    { game: '클래시 오브 클랜', genre: '전략', review: '신규 유닛이 밸런스를 깨트려요', category: '밸런스', sentiment: '불만' },
    { game: '클래시 오브 클랜', genre: '전략', review: '업그레이드 시간이 너무 길어요', category: '콘텐츠', sentiment: '불만' },
    { game: '삼국지 전략판', genre: '전략', review: '전략성이 높아서 재미있어요', category: '재미', sentiment: '칭찬' },
    
    // 캐주얼 게임
    { game: '쿠키런: 킹덤', genre: '캐주얼', review: '신규 쿠키 뽑기 확률이 너무 낮아요', category: '과금', sentiment: '불만' },
    { game: '쿠키런: 킹덤', genre: '캐주얼', review: '귀여운 캐릭터가 좋아요', category: '그래픽', sentiment: '칭찬' },
    { game: '애니팡', genre: '캐주얼', review: 'UI가 직관적이에요', category: 'UI/UX', sentiment: '칭찬' },
    
    // 스포츠 게임
    { game: 'FC 모바일', genre: '스포츠', review: '선수 능력치 인플레가 심해요', category: '밸런스', sentiment: '불만' },
    { game: 'FC 모바일', genre: '스포츠', review: '그래픽 품질이 좋아졌어요', category: '그래픽', sentiment: '칭찬' },
    { game: 'NBA 2K 모바일', genre: '스포츠', review: '과금 요소가 너무 많아요', category: '과금', sentiment: '불만' },
    
    // MOBA 게임
    { game: '리그 오브 레전드: 와일드 리프트', genre: 'MOBA', review: '특정 챔피언만 OP예요', category: '밸런스', sentiment: '불만' },
    { game: '리그 오브 레전드: 와일드 리프트', genre: 'MOBA', review: '모바일 최적화가 잘 됐어요', category: 'UI/UX', sentiment: '칭찬' },
    
    // 추가 샘플 데이터 (30개 더)
    { game: '원신', genre: 'RPG', review: '뽑기 천장이 너무 높아요', category: '과금', sentiment: '불만' },
    { game: '원신', genre: 'RPG', review: '오픈월드 퀄리티가 훌륭해요', category: '콘텐츠', sentiment: '칭찬' },
    { game: '붕괴: 스타레일', genre: 'RPG', review: '스토리가 재미있어요', category: '재미', sentiment: '칭찬' },
    { game: '붕괴: 스타레일', genre: 'RPG', review: '로딩이 너무 길어요', category: '버그', sentiment: '불만' },
    { game: '던전앤파이터 모바일', genre: 'RPG', review: '타격감이 좋아요', category: '재미', sentiment: '칭찬' },
    { game: '던전앤파이터 모바일', genre: 'RPG', review: '무과금은 경쟁이 안 돼요', category: '과금', sentiment: '불만' },
    { game: '메이플스토리M', genre: 'RPG', review: '추억 보정으로 재미있어요', category: '재미', sentiment: '칭찬' },
    { game: '메이플스토리M', genre: 'RPG', review: '강화 시스템이 너무 어려워요', category: '밸런스', sentiment: '불만' },
    { game: '오버워치 2', genre: 'FPS', review: '영웅 밸런스가 좋아졌어요', category: '밸런스', sentiment: '칭찬' },
    { game: '오버워치 2', genre: 'FPS', review: '큐 대기 시간이 너무 길어요', category: '버그', sentiment: '불만' },
    { game: '발로란트', genre: 'FPS', review: '스킨 가격이 너무 비싸요', category: '과금', sentiment: '불만' },
    { game: '발로란트', genre: 'FPS', review: '총기 사운드가 현실적이에요', category: '그래픽', sentiment: '칭찬' },
    { game: '카트라이더: 드리프트', genre: '레이싱', review: '조작법이 어려워요', category: 'UI/UX', sentiment: '불만' },
    { game: '카트라이더: 드리프트', genre: '레이싱', review: '그래픽이 깔끔해요', category: '그래픽', sentiment: '칭찬' },
    { game: '프로젝트 세카이', genre: '리듬', review: '음악이 좋아요', category: '재미', sentiment: '칭찬' },
    { game: '프로젝트 세카이', genre: '리듬', review: '판정이 너무 빡빡해요', category: '밸런스', sentiment: '불만' },
    { game: '하스스톤', genre: '카드', review: '신규 확장팩 밸런스 좋아요', category: '밸런스', sentiment: '칭찬' },
    { game: '하스스톤', genre: '카드', review: '카드팩 가격이 비싸요', category: '과금', sentiment: '불만' },
    { game: '테라 클래식', genre: 'MMORPG', review: '옛날 감성이 살아있어요', category: '재미', sentiment: '칭찬' },
    { game: '테라 클래식', genre: 'MMORPG', review: '서버 불안정해요', category: '버그', sentiment: '불만' },
    { game: '디아블로 이모탈', genre: 'RPG', review: '그래픽 퀄리티 최고예요', category: '그래픽', sentiment: '칭찬' },
    { game: '디아블로 이모탈', genre: 'RPG', review: 'P2W 너무 심해요', category: '과금', sentiment: '불만' },
    { game: '브롤스타즈', genre: 'MOBA', review: '캐릭터가 귀여워요', category: '그래픽', sentiment: '칭찬' },
    { game: '브롤스타즈', genre: 'MOBA', review: '매칭이 불공정해요', category: '밸런스', sentiment: '불만' },
    { game: '모여봐요 동물의 숲', genre: '시뮬레이션', review: '힐링돼요', category: '재미', sentiment: '칭찬' },
    { game: '스타듀밸리', genre: '시뮬레이션', review: '중독성 있어요', category: '재미', sentiment: '칭찬' },
  ]);

  // 통계 계산
  const calculateStats = () => {
    // 장르 필터 적용
    const filteredReviews = selectedGenre === '전체' 
      ? reviews 
      : reviews.filter(review => review.genre === selectedGenre);
    
    const categoryCount = {};
    const genreCount = {};
    const sentimentCount = { '불만': 0, '칭찬': 0 };
    
    filteredReviews.forEach(review => {
      categoryCount[review.category] = (categoryCount[review.category] || 0) + 1;
      genreCount[review.genre] = (genreCount[review.genre] || 0) + 1;
      sentimentCount[review.sentiment]++;
    });
    
    const categoryData = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));
    const genreData = Object.entries(genreCount).map(([name, count]) => ({ name, count }));
    
    return { categoryData, genreData, sentimentCount, filteredReviews };
  };

  const { categoryData, genreData, sentimentCount, filteredReviews } = calculateStats();
  
  // 전체 장르 목록 추출
  const allGenres = ['전체', ...new Set(reviews.map(r => r.genre))];

  // 실시간 리뷰 시뮬레이션 (실제 환경에서는 API 호출로 대체)
  const simulateNewReview = () => {
    const games = [
      '리니지M', '원신', '배틀그라운드 모바일', '클래시 오브 클랜', 
      '쿠키런: 킹덤', 'FC 모바일', '로스트아크', '던전앤파이터 모바일'
    ];
    const genres = ['RPG', 'FPS', '전략', '캐주얼', 'MOBA', '스포츠'];
    const categories = ['밸런스', '과금', '버그', 'UI/UX', '콘텐츠', '그래픽', '재미'];
    const sentiments = ['불만', '칭찬'];
    const reviewTemplates = {
      '불만': [
        '너무 어려워요', '렉이 심해요', '과금 압박이 심해요', 
        '밸런스가 안 맞아요', 'UI가 불편해요', '버그가 많아요'
      ],
      '칭찬': [
        '재미있어요', '그래픽이 좋아요', 'UI가 직관적이에요', 
        '밸런스가 좋아요', '최적화가 잘됐어요', '중독성 있어요'
      ]
    };

    const randomGame = games[Math.floor(Math.random() * games.length)];
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    const randomReview = reviewTemplates[randomSentiment][
      Math.floor(Math.random() * reviewTemplates[randomSentiment].length)
    ];

    const newReview = {
      game: randomGame,
      genre: randomGenre,
      review: randomReview,
      category: randomCategory,
      sentiment: randomSentiment
    };

    setReviews(prev => [newReview, ...prev]);
    setLastUpdate(new Date());
    
    // 알림 표시
    setNewReviewNotification({
      game: randomGame,
      sentiment: randomSentiment,
      timestamp: new Date()
    });
    
    setTimeout(() => setNewReviewNotification(null), 5000);
  };

  // 실시간 폴링 시작/중지
  const toggleRealTime = () => {
    if (isRealTimeEnabled) {
      // 중지
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setIsRealTimeEnabled(false);
    } else {
      // 시작
      setIsRealTimeEnabled(true);
      intervalRef.current = setInterval(() => {
        simulateNewReview();
      }, pollingInterval * 1000);
    }
  };

  // 컴포넌트 언마운트 시 정리
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // 폴링 주기 변경 시 재시작
  React.useEffect(() => {
    if (isRealTimeEnabled && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        simulateNewReview();
      }, pollingInterval * 1000);
    }
  }, [pollingInterval]);

  // CSV 파일 업로드 처리
  const handleFileUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n');
        const newReviews = [];
        
        // CSV 파싱 (헤더 건너뛰기)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const [game, genre, review, category, sentiment] = line.split(',').map(s => s.trim());
          if (game && review) {
            newReviews.push({
              game,
              genre: genre || 'RPG',
              review,
              category: category || '밸런스',
              sentiment: sentiment || '불만'
            });
          }
        }
        
        if (newReviews.length > 0) {
          setReviews(prev => [...prev, ...newReviews]);
          setUploadStatus(`✅ ${newReviews.length}개의 리뷰가 추가되었습니다!`);
        } else {
          setUploadStatus('❌ CSV 파일 형식이 올바르지 않습니다.');
        }
      } catch (error) {
        setUploadStatus('❌ 파일 처리 중 오류가 발생했습니다.');
      }
      
      setTimeout(() => setUploadStatus(''), 3000);
    };
    reader.readAsText(file);
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      handleFileUpload(file);
    } else {
      setUploadStatus('❌ CSV 파일만 업로드 가능합니다.');
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // CSV 다운로드
  const downloadCSV = () => {
    const headers = ['게임명', '장르', '리뷰내용', '카테고리', '감정'];
    const csvContent = [
      headers.join(','),
      ...reviews.map(r => `${r.game},${r.genre},${r.review},${r.category},${r.sentiment}`)
    ].join('\n');
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `game_reviews_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // 수동 입력 추가
  const addManualReview = () => {
    if (!manualInput.game || !manualInput.review) {
      alert('게임명과 리뷰 내용을 입력해주세요.');
      return;
    }
    
    setReviews(prev => [...prev, { ...manualInput }]);
    setManualInput({
      game: '',
      genre: 'RPG',
      review: '',
      category: '밸런스',
      sentiment: '불만'
    });
  };

  // 리뷰 삭제
  const deleteReview = (index) => {
    setReviews(prev => prev.filter((_, i) => i !== index));
  };

  // 모든 데이터 초기화
  const clearAllData = () => {
    if (window.confirm('모든 데이터를 삭제하시겠습니까?')) {
      setReviews([]);
    }
  };

  // QA 체크리스트 생성
  const generateQAChecklist = async () => {
    if (!updateType) {
      alert('업데이트 유형을 선택해주세요.');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `게임 업데이트 유형: ${updateType}

이 업데이트에 대한 상세한 QA 체크리스트를 작성해주세요. 다음 형식으로 작성해주세요:

## ${updateType} QA 체크리스트

### 1. 기능 테스트
- [ ] 항목1
- [ ] 항목2
...

### 2. 밸런스 검증
- [ ] 항목1
- [ ] 항목2
...

### 3. 버그 확인
- [ ] 항목1
- [ ] 항목2
...

### 4. 성능 테스트
- [ ] 항목1
- [ ] 항목2
...

### 5. 사용자 경험
- [ ] 항목1
- [ ] 항목2
...

각 섹션에 최소 5개 이상의 구체적인 체크리스트 항목을 포함해주세요.`
          }]
        })
      });

      const data = await response.json();
      const checklistText = data.content
        .filter(item => item.type === 'text')
        .map(item => item.text)
        .join('\n');
      
      setGeneratedChecklist(checklistText);
    } catch (error) {
      alert('체크리스트 생성 중 오류가 발생했습니다: ' + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // 체크리스트 다운로드
  const downloadChecklist = () => {
    const blob = new Blob([generatedChecklist], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `QA_Checklist_${updateType}_${new Date().toISOString().split('T')[0]}.md`;
    link.click();
  };

  const COLORS = ['#ef4444', '#f59e0b', '#eab308', '#3b82f6', '#8b5cf6', '#10b981', '#06b6d4', '#ec4899'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <style>{styles}</style>
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <TrendingUp className="w-10 h-10" />
                Universal Game QA Analysis Tool
              </h1>
              <p className="text-purple-100 text-lg">
                AI 기반 게임 리뷰 분석 및 QA 자동화 시스템 | 모든 게임 장르 지원
              </p>
            </div>
            
            {/* 실시간 상태 표시 */}
            <div className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${isRealTimeEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`}></div>
                <span className="text-white font-semibold">
                  {isRealTimeEnabled ? '실시간 수집 중' : '수동 모드'}
                </span>
              </div>
              <p className="text-purple-100 text-xs">
                마지막 업데이트: {lastUpdate.toLocaleTimeString('ko-KR')}
              </p>
            </div>
          </div>
        </div>

        {/* 실시간 알림 */}
        {newReviewNotification && (
          <div className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-2xl animate-slide-in-right z-50 border border-green-300">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <p className="font-bold">새 리뷰 도착!</p>
                <p className="text-sm">{newReviewNotification.game} - {newReviewNotification.sentiment}</p>
                <p className="text-xs opacity-80">{newReviewNotification.timestamp.toLocaleTimeString('ko-KR')}</p>
              </div>
            </div>
          </div>
        )}

        {/* 장르 필터 - 최상단 */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur rounded-xl p-6 mb-6 border border-indigo-400/30">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                🎮 장르 필터
              </h3>
              <p className="text-purple-200 text-sm">
                특정 장르의 데이터만 분석하거나 전체 데이터를 확인하세요
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {allGenres.map(genre => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105 ring-2 ring-purple-400'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600 hover:scale-102'
                }`}
              >
                {genre}
                <span className="ml-2 text-xs opacity-80 font-normal">
                  ({genre === '전체' ? reviews.length : reviews.filter(r => r.genre === genre).length})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 실시간 제어 패널 */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                실시간 데이터 수집
              </h3>
              <p className="text-slate-400 text-sm">
                자동으로 새 리뷰를 주기적으로 수집합니다 (시뮬레이션 모드)
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div>
                <label className="block text-white text-sm mb-2">수집 주기 (초)</label>
                <select
                  value={pollingInterval}
                  onChange={(e) => setPollingInterval(Number(e.target.value))}
                  disabled={isRealTimeEnabled}
                  className="bg-slate-700 text-white border border-slate-600 rounded-lg p-2 focus:outline-none focus:border-purple-500 disabled:opacity-50"
                >
                  <option value={10}>10초</option>
                  <option value={30}>30초</option>
                  <option value={60}>1분</option>
                  <option value={300}>5분</option>
                </select>
              </div>
              
              <button
                onClick={toggleRealTime}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  isRealTimeEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isRealTimeEnabled ? '중지' : '시작'}
              </button>
            </div>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">
                  {selectedGenre === '전체' ? '총 리뷰 수' : `${selectedGenre} 리뷰 수`}
                </p>
                <p className="text-3xl font-bold text-white mt-1">{filteredReviews.length}</p>
              </div>
              <Database className="w-12 h-12 text-blue-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">불만 리뷰</p>
                <p className="text-3xl font-bold text-red-400 mt-1">{sentimentCount['불만']}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">긍정 리뷰</p>
                <p className="text-3xl font-bold text-green-400 mt-1">{sentimentCount['칭찬']}</p>
              </div>
              <Sparkles className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">불만 비율</p>
                <p className="text-3xl font-bold text-orange-400 mt-1">
                  {filteredReviews.length > 0 
                    ? ((sentimentCount['불만'] / filteredReviews.length) * 100).toFixed(1) 
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-orange-400" />
            </div>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="bg-slate-800/50 backdrop-blur rounded-xl p-2 mb-6 border border-slate-700">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'analysis'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              📊 데이터 분석
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              📝 데이터 관리
            </button>
            <button
              onClick={() => setActiveTab('crawler')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'crawler'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              🕷️ 크롤링 가이드
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                activeTab === 'checklist'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              ✅ AI 체크리스트
            </button>
          </div>
        </div>

        {/* 데이터 분석 탭 */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* 차트 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 카테고리별 분석 */}
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">카테고리별 이슈 분포</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* 장르별 분석 */}
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <h3 className="text-xl font-bold text-white mb-4">장르별 리뷰 분포</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genreData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {genreData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">
                  최근 리뷰 
                  <span className="ml-2 text-sm text-purple-400">
                    ({selectedGenre === '전체' ? '전체 장르' : selectedGenre})
                  </span>
                </h3>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  CSV 다운로드
                </button>
              </div>
              
              {filteredReviews.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">선택한 장르의 리뷰가 없습니다</p>
                  <p className="text-slate-500 text-sm mt-2">다른 장르를 선택하거나 새 리뷰를 추가해주세요</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredReviews.slice(0, 20).map((review, index) => {
                    const originalIndex = reviews.findIndex(r => r === review);
                    return (
                      <div
                        key={originalIndex}
                        className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 hover:border-purple-500 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-bold text-white">{review.game}</span>
                              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                {review.genre}
                              </span>
                              <span className={`text-xs px-2 py-1 rounded ${
                                review.sentiment === '불만'
                                  ? 'bg-red-500/20 text-red-300'
                                  : 'bg-green-500/20 text-green-300'
                              }`}>
                                {review.sentiment}
                              </span>
                              <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                {review.category}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm">{review.review}</p>
                          </div>
                          <button
                            onClick={() => deleteReview(originalIndex)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 데이터 관리 탭 */}
        {activeTab === 'manage' && (
          <div className="space-y-6">
            {/* CSV 업로드 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6" />
                CSV 파일 업로드
              </h3>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                  isDragging
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-slate-600 hover:border-purple-500'
                }`}
              >
                <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <p className="text-white font-semibold mb-2">
                  CSV 파일을 드래그하거나 클릭하여 업로드
                </p>
                <p className="text-slate-400 text-sm mb-4">
                  형식: 게임명,장르,리뷰내용,카테고리,감정
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-all"
                >
                  파일 선택
                </button>
              </div>
              
              {uploadStatus && (
                <div className={`mt-4 p-3 rounded-lg ${
                  uploadStatus.includes('✅')
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {uploadStatus}
                </div>
              )}
            </div>

            {/* 수동 입력 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Plus className="w-6 h-6" />
                수동 리뷰 추가
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">게임명</label>
                  <input
                    type="text"
                    value={manualInput.game}
                    onChange={(e) => setManualInput({...manualInput, game: e.target.value})}
                    placeholder="예: 리니지M"
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-white mb-2 font-semibold">장르</label>
                  <select
                    value={manualInput.genre}
                    onChange={(e) => setManualInput({...manualInput, genre: e.target.value})}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  >
                    <option>RPG</option>
                    <option>FPS</option>
                    <option>전략</option>
                    <option>캐주얼</option>
                    <option>스포츠</option>
                    <option>MOBA</option>
                    <option>레이싱</option>
                    <option>리듬</option>
                    <option>카드</option>
                    <option>시뮬레이션</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-white mb-2 font-semibold">리뷰 내용</label>
                <textarea
                  value={manualInput.review}
                  onChange={(e) => setManualInput({...manualInput, review: e.target.value})}
                  placeholder="리뷰를 입력하세요..."
                  rows={3}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-white mb-2 font-semibold">카테고리</label>
                  <select
                    value={manualInput.category}
                    onChange={(e) => setManualInput({...manualInput, category: e.target.value})}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  >
                    <option>밸런스</option>
                    <option>과금</option>
                    <option>버그</option>
                    <option>UI/UX</option>
                    <option>콘텐츠</option>
                    <option>그래픽</option>
                    <option>재미</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white mb-2 font-semibold">감정</label>
                  <select
                    value={manualInput.sentiment}
                    onChange={(e) => setManualInput({...manualInput, sentiment: e.target.value})}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                  >
                    <option>불만</option>
                    <option>칭찬</option>
                  </select>
                </div>
              </div>

              <button
                onClick={addManualReview}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all"
              >
                리뷰 추가
              </button>
            </div>

            {/* 데이터 관리 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">데이터 관리</h3>
              <div className="flex gap-3">
                <button
                  onClick={clearAllData}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                  모든 데이터 삭제
                </button>
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all"
                >
                  <Download className="w-5 h-5" />
                  백업 (CSV)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 크롤링 가이드 탭 */}
        {activeTab === 'crawler' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">🕷️ 리뷰 크롤링 자동화</h3>
              <p className="text-slate-300 mb-4">
                Python 스크립트를 사용하여 Google Play와 App Store에서 자동으로 리뷰를 수집할 수 있습니다.
              </p>

              <div className="bg-slate-900/50 p-4 rounded-lg mb-4">
                <p className="text-green-400 font-mono text-sm mb-2">필수 패키지 설치:</p>
                <pre className="bg-slate-800 p-3 rounded text-green-400 text-sm overflow-x-auto">
pip install google-play-scraper app-store-scraper pandas
                </pre>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-lg">
                <p className="text-blue-400 font-mono text-sm mb-2">사용 예시:</p>
                <pre className="bg-slate-800 p-3 rounded text-blue-400 text-sm overflow-x-auto">
{`python game_review_crawler.py

# 게임 패키지명 입력 (예: com.ncsoft.lineagem)
# 수집할 리뷰 개수 입력 (예: 100)
# 결과: game_reviews_YYYY-MM-DD.csv 파일 생성`}
                </pre>
              </div>
            </div>

            {/* 카테고리 자동 분류 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">🤖 자동 카테고리 분류</h3>
              <p className="text-slate-300 mb-4">
                스크립트는 리뷰 내용을 분석하여 자동으로 카테고리를 분류합니다:
              </p>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                  <p className="font-semibold text-red-400 mb-2">밸런스</p>
                  <p className="text-xs text-slate-400">밸런스, 너무 강, 너무 약, OP, 사기</p>
                </div>
                <div className="bg-orange-500/10 border border-orange-500/30 p-3 rounded-lg">
                  <p className="font-semibold text-orange-400 mb-2">과금</p>
                  <p className="text-xs text-slate-400">과금, 돈, 확률, 뽑기, P2W, 비싸</p>
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg">
                  <p className="font-semibold text-yellow-400 mb-2">버그</p>
                  <p className="text-xs text-slate-400">버그, 오류, 튕김, 렉, 다운, 먹통</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 p-3 rounded-lg">
                  <p className="font-semibold text-blue-400 mb-2">UI/UX</p>
                  <p className="text-xs text-slate-400">UI, 조작, 인터페이스, 불편, 직관</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg">
                  <p className="font-semibold text-purple-400 mb-2">콘텐츠</p>
                  <p className="text-xs text-slate-400">콘텐츠, 지루, 반복, 할게없, 업데이트</p>
                </div>
                <div className="bg-green-500/10 border border-green-500/30 p-3 rounded-lg">
                  <p className="font-semibold text-green-400 mb-2">재미</p>
                  <p className="text-xs text-slate-400">재미, 중독, 꿀잼, 노잼, 흥미</p>
                </div>
              </div>
            </div>

            {/* 문제 해결 */}
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">🛠️ 문제 해결</h3>
              
              <div className="space-y-3">
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-red-400 font-semibold mb-2">❌ ModuleNotFoundError</p>
                  <p className="text-slate-300 text-sm mb-2">패키지가 설치되지 않았습니다.</p>
                  <pre className="bg-slate-800 p-2 rounded text-xs text-green-400">
pip install google-play-scraper app-store-scraper pandas
                  </pre>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-yellow-400 font-semibold mb-2">⚠️ HTTPError / 빈 결과</p>
                  <p className="text-slate-300 text-sm">
                    API 호출 제한 또는 잘못된 패키지명입니다. 패키지명을 다시 확인하세요.
                  </p>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <p className="text-blue-400 font-semibold mb-2">ℹ️ 한글 깨짐</p>
                  <p className="text-slate-300 text-sm">
                    스크립트는 자동으로 UTF-8 인코딩을 사용합니다. Excel에서 열 때는 "데이터 → 텍스트 나누기"를 사용하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 다운로드 버튼 */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6 backdrop-blur text-center">
              <h3 className="text-xl font-bold text-white mb-3">📥 크롤링 스크립트 다운로드</h3>
              <p className="text-green-200 mb-4">
                준비된 Python 스크립트와 상세 가이드를 다운로드하세요
              </p>
              <div className="flex gap-3 justify-center">
                <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  game_review_crawler.py
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  사용 가이드 (MD)
                </button>
              </div>
              <p className="text-sm text-slate-400 mt-3">
                💡 스크립트는 이미 다운로드 폴더에 포함되어 있습니다
              </p>
            </div>
          </div>
        )}

        {/* AI 체크리스트 생성 탭 */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-4">AI 기반 QA 체크리스트 자동 생성</h3>
              
              <div className="mb-6">
                <label className="block text-white mb-2 font-semibold">업데이트 유형 선택</label>
                <select
                  value={updateType}
                  onChange={(e) => setUpdateType(e.target.value)}
                  className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg p-3 focus:outline-none focus:border-purple-500"
                >
                  <option value="">선택하세요</option>
                  <option value="신규 캐릭터/영웅 추가">신규 캐릭터/영웅 추가</option>
                  <option value="밸런스 패치">밸런스 패치</option>
                  <option value="신규 맵/스테이지 추가">신규 맵/스테이지 추가</option>
                  <option value="시즌 이벤트">시즌 이벤트</option>
                  <option value="신규 스킨/아이템 출시">신규 스킨/아이템 출시</option>
                  <option value="게임 모드 업데이트">게임 모드 업데이트</option>
                  <option value="UI/UX 개선">UI/UX 개선</option>
                  <option value="성능 최적화">성능 최적화</option>
                </select>
              </div>

              <button
                onClick={generateQAChecklist}
                disabled={isGenerating}
                className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
                  isGenerating
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
                }`}
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI 체크리스트 생성 중...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    QA 체크리스트 생성
                  </span>
                )}
              </button>
            </div>

            {generatedChecklist && (
              <div className="bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6 text-green-400" />
                    생성된 QA 체크리스트
                  </h3>
                  <button
                    onClick={downloadChecklist}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    다운로드
                  </button>
                </div>
                <div className="bg-slate-900/50 p-4 rounded-lg">
                  <pre className="text-green-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {generatedChecklist}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 푸터 */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Claude AI API를 활용한 <span className="text-green-400 font-semibold">진짜 실시간</span> 분석 시스템 | 모든 게임 장르 지원</p>
          <p className="text-xs mt-2">
            💡 실시간 모드: 주기적으로 새 리뷰를 자동 수집 | 현재는 시뮬레이션 모드 (실제 환경에서는 API 연동)
          </p>
        </div>
      </div>
    </div>
  );
};

export default UniversalGameQATool;
