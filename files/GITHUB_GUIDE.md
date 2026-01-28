# 🚀 GitHub 업로드 완벽 가이드

## 📝 단계별 커맨드

### 1️⃣ 로컬 Git 저장소 초기화

```bash
# 프로젝트 폴더로 이동
cd /path/to/your/project

# Git 저장소 초기화
git init

# 현재 상태 확인
git status
```

---

### 2️⃣ 파일 추가 및 커밋

```bash
# 모든 파일 스테이징
git add .

# 또는 개별 파일 추가
git add UniversalGameQATool.jsx
git add README.md
git add package.json
git add .gitignore

# 커밋 생성
git commit -m "feat: 실시간 게임 리뷰 분석 시스템 초기 릴리스

- 실시간 폴링 시스템 (10초/30초/1분/5분)
- 장르별 필터링 기능
- AI 기반 QA 체크리스트 자동 생성
- CSV 업로드/다운로드
- 데이터 시각화 (Bar/Pie Chart)
- 푸시 알림 시스템"
```

---

### 3️⃣ GitHub 저장소 생성

**웹 브라우저에서:**
1. https://github.com 접속
2. 우측 상단 `+` → `New repository` 클릭
3. 정보 입력:
   ```
   Repository name: universal-game-qa-tool
   Description: AI 기반 게임 리뷰 분석 및 QA 자동화 시스템
   Public 선택
   ❌ Add a README file (이미 있음)
   ❌ Add .gitignore (이미 있음)
   ❌ Choose a license
   ```
4. `Create repository` 클릭

---

### 4️⃣ 원격 저장소 연결 및 푸시

```bash
# 원격 저장소 연결 (YOUR_USERNAME을 실제 GitHub 사용자명으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/universal-game-qa-tool.git

# 원격 저장소 확인
git remote -v

# 메인 브랜치로 이름 변경 (필요시)
git branch -M main

# 첫 번째 푸시
git push -u origin main
```

---

### 5️⃣ 추가 업데이트 푸시

```bash
# 변경사항 확인
git status

# 변경된 파일 추가
git add .

# 커밋
git commit -m "feat: 장르 필터 최상단 이동 및 UI 개선"

# 푸시
git push
```

---

## 🔐 인증 방법

### 방법 1: Personal Access Token (권장)

1. **GitHub 설정**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - `Generate new token` 클릭
   - 권한 선택: `repo` 전체 체크
   - 토큰 생성 후 복사 (한 번만 보여짐!)

2. **사용**
   ```bash
   # Username: GitHub 사용자명
   # Password: 생성한 Personal Access Token 입력
   git push
   ```

### 방법 2: SSH Key

```bash
# SSH 키 생성
ssh-keygen -t ed25519 -C "your.email@example.com"

# SSH 키 복사
cat ~/.ssh/id_ed25519.pub

# GitHub에 등록
# Settings → SSH and GPG keys → New SSH key → 붙여넣기

# SSH 원격 저장소 연결
git remote set-url origin git@github.com:YOUR_USERNAME/universal-game-qa-tool.git
```

---

## 📋 커밋 메시지 컨벤션

```bash
# 기능 추가
git commit -m "feat: 새로운 기능 추가"

# 버그 수정
git commit -m "fix: 버그 수정"

# 문서 업데이트
git commit -m "docs: README 업데이트"

# 스타일 변경
git commit -m "style: 코드 포맷팅"

# 리팩토링
git commit -m "refactor: 코드 구조 개선"

# 성능 개선
git commit -m "perf: 성능 최적화"

# 테스트
git commit -m "test: 테스트 추가"
```

---

## 🌿 브랜치 전략

```bash
# 새 기능 개발
git checkout -b feature/realtime-polling
git add .
git commit -m "feat: 실시간 폴링 기능 추가"
git push -u origin feature/realtime-polling

# 메인 브랜치로 병합
git checkout main
git merge feature/realtime-polling
git push

# 브랜치 삭제
git branch -d feature/realtime-polling
git push origin --delete feature/realtime-polling
```

---

## 🔄 자주 사용하는 명령어

```bash
# 상태 확인
git status

# 로그 확인
git log --oneline

# 변경사항 확인
git diff

# 특정 파일 변경사항 취소
git checkout -- filename

# 마지막 커밋 수정
git commit --amend

# 원격 저장소 최신 상태 가져오기
git pull origin main

# 특정 커밋으로 되돌리기
git reset --hard COMMIT_HASH
```

---

## 🚨 문제 해결

### 푸시 거부 (rejected)
```bash
git pull origin main --rebase
git push
```

### 병합 충돌 (merge conflict)
```bash
# 충돌 파일 수동 수정 후
git add .
git commit -m "fix: 병합 충돌 해결"
git push
```

### 잘못된 커밋 취소
```bash
# 마지막 커밋만 취소 (변경사항 유지)
git reset --soft HEAD~1

# 마지막 커밋 완전히 삭제
git reset --hard HEAD~1
```

---

## 📦 완성된 저장소 구조

```
universal-game-qa-tool/
├── .gitignore
├── README.md
├── package.json
├── GITHUB_GUIDE.md (이 파일)
└── UniversalGameQATool.jsx
```

---

## ✅ 체크리스트

- [ ] Git 설치 확인 (`git --version`)
- [ ] GitHub 계정 생성
- [ ] Personal Access Token 생성
- [ ] 로컬 저장소 초기화 (`git init`)
- [ ] 파일 커밋 (`git commit`)
- [ ] GitHub 저장소 생성
- [ ] 원격 저장소 연결 (`git remote add`)
- [ ] 첫 푸시 완료 (`git push`)
- [ ] README.md 확인
- [ ] 저장소 공개/비공개 설정 확인

---

## 🎯 빠른 시작 (올인원 커맨드)

```bash
# 1. 초기화 및 커밋
git init
git add .
git commit -m "feat: 초기 릴리스 - 실시간 게임 QA 분석 시스템"

# 2. 원격 저장소 연결 (YOUR_USERNAME 변경 필수!)
git remote add origin https://github.com/YOUR_USERNAME/universal-game-qa-tool.git

# 3. 푸시
git branch -M main
git push -u origin main
```

---

## 📞 도움이 필요하면

- GitHub 공식 문서: https://docs.github.com
- Git 공식 문서: https://git-scm.com/doc
- GitHub CLI: https://cli.github.com

---

**🎉 성공적인 GitHub 업로드를 기원합니다!**
