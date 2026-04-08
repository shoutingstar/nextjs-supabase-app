# Gather 개발 로드맵

일회성 이벤트를 간편하게 관리하는 올인원 플랫폼 - 초대 링크 하나로 모든 것을 해결

## 개요

Gather는 5-30명 규모의 소규모 이벤트 주최자와 참여자를 위한 모바일 퍼스트 플랫폼으로 다음 기능을 제공합니다:

- **간편한 이벤트 생성**: 제목, 날짜, 장소만 입력하면 즉시 이벤트 생성
- **원클릭 초대 시스템**: 자동 생성된 초대 링크를 카카오톡으로 간편 공유
- **실시간 참여자 관리**: Supabase Realtime으로 참여자 목록 자동 업데이트
- **관리자 대시보드**: 플랫폼 전체 현황을 한눈에 파악하는 통계 시스템

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 후 작업 파일 내 단계 진행 상황 업데이트
   - 구현 완료 후 Playwright MCP를 사용한 E2E 테스트 실행
   - 테스트 통과 확인 후 다음 단계로 진행
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 - 우선순위

- **Task 001: 프로젝트 구조 및 라우팅 설정** - 우선순위 ✅
  - Next.js App Router 기반 전체 라우트 구조 생성
  - 모든 주요 페이지의 빈 껍데기 파일 생성 (13개 페이지)
  - 공통 레이아웃 컴포넌트 골격 구현 (모바일/데스크톱)
  - 모바일 하단 내비게이션 바 구조 설정
  - 관리자 사이드바 레이아웃 구조 설정

- **Task 002: 타입 정의 및 인터페이스 설계** ✅
  - TypeScript 인터페이스 및 타입 정의 파일 생성
  - 프론트엔드 컴포넌트 Props 타입 정의
  - API 응답 타입 정의
  - 전역 상태 관리 타입 정의
  - UI 컴포넌트용 임시 데이터 모델 타입 정의 (추후 DB 스키마로 교체 예정)

### Phase 2: UI/UX 완성 (더미 데이터 활용)

- **Task 003: 공통 컴포넌트 라이브러리 구현** ✅
  - shadcn/ui 추가 컴포넌트 설치 (Avatar, Dialog, Toast, Form, Select)
  - ParticipantCard 컴포넌트 구현 (default/compact variant)
  - LoadingSkeleton 컴포넌트 구현 (EventSkeleton, ParticipantSkeleton)
  - EventCard 이미지 지원 확장 (next/image 최적화)
  - 더미 데이터 구조 구축 (mock-data.ts, data-generators.ts)
  - 컴포넌트 테스트 페이지 작성 (/test/components)
  - Playwright MCP 테스트 완료 (반응형 + 다크 모드)

- **Task 004: 주최자 모바일 UI/UX 완성** ✅
  - ✅ 홈 페이지 (대시보드) UI 구현 - 통계 카드, 최근 이벤트 목록
  - ✅ 내 이벤트 목록 페이지 UI - 주최자 뷰 (호스팅/참여 이벤트 구분)
  - ✅ 이벤트 생성 페이지 폼 UI 구현 (React Hook Form + Zod 검증)
  - ✅ 이벤트 상세 페이지 UI - 초대 링크 복사 기능 (CopyInviteButton)
  - ✅ 이벤트 수정 페이지 UI - 상태 변경, 삭제 확인 다이얼로그
  - ✅ 주최자 프로필 페이지 UI (계정 설정)
  - ✅ 모바일 네비게이션 바 개선 (Lucide 아이콘: Home, Calendar, Users, Settings)
  - ✅ FAB 버튼 구현 (이벤트 만들기)
  - ✅ 모든 페이지 pb-24 추가 (모바일 네비게이션 높이 고려)
  - ✅ 반응형 디자인 적용 (sm/lg breakpoints)
  - ✅ 다크 모드 지원

- **Task 005: 참여자 모바일 UI/UX 완성** ✅
  - ✅ 더미 데이터 확장: MOCK_EVENT_PARTICIPANTS 매핑 추가
  - ✅ 초대 링크 참여 페이지 UI 구현 (F004) - /join/[inviteCode]/page.tsx
    - 이벤트 정보 미리보기
    - 로그인/회원가입 CTA 버튼
  - ✅ 내가 참여한 이벤트 목록 페이지 UI - 참여자 뷰 (F007)
  - ✅ 이벤트 상세 페이지 UI - 참여자 뷰 (F005)
    - 읽기 전용 이벤트 정보
    - 다른 참여자 목록 보기 (수정 불가)
    - 초대 링크 복사는 가능 (공유 목적)
  - ✅ 참여자 프로필 페이지 UI 확인 (F011)
  - ✅ 네비게이션 및 FAB 버튼 상태 확인
  - ✅ 반응형 디자인 및 다크 모드 적용
  - ⏳ Phase 3 대기: middleware에서 /join 경로 제외 설정 필요
  - **주요 차이점**: 읽기 전용 뷰, 초대 링크로만 참여 가능
  - **의존성**: Task 004 (공통 컴포넌트 재사용)

- **Task 006: 관리자 데스크톱 페이지 UI 완성** ✅
  - ✅ Recharts 라이브러리 설치
  - ✅ shadcn/ui table 컴포넌트 설치
  - ✅ 관리자 대시보드 메인 페이지 UI (F012) - 통계 카드 3개
  - ✅ 이벤트 관리 테이블 (F013) - EventsTable 컴포넌트
  - ✅ 사용자 관리 테이블 (F014) - UsersTable 컴포넌트
  - ✅ 통계 분석 차트 (F015) - 5개 차트 (가입자 추이, 이벤트 생성 추이, 상태 분포, 역할 분포, 인기 이벤트)
  - ✅ 더미 데이터 확장 - MOCK_DAILY_USERS, MOCK_DAILY_EVENTS, 분포 데이터
  - ⏳ 관리자 로그인: 건너뜀 (Phase 3에서 middleware 권한 검증으로 처리)
  - ⏳ Phase 3 대기: 실제 데이터베이스 연동, API 필터/정렬, 권한 검증

### Phase 3: 데이터베이스 설정 및 핵심 기능 구현

- **Task 007: 데이터베이스 스키마 및 Supabase 초기 설정** ✅ - 완료
  - ✅ UI 검토 후 최종 확정된 요구사항을 반영한 스키마 설계
  - ✅ Supabase 데이터베이스 테이블 생성 (profiles, events, event_participants, carpool_slots, carpool_requests, announcements, expenses, expense_splits)
  - ✅ Row Level Security (RLS) 정책 설정
  - ✅ 인덱스 생성 (invite_code, host_id, event_id, user_id, driver_id, slot_id 등 전체 외래키 인덱스)
  - ✅ Supabase Storage 버킷 생성 (event-covers)
  - ✅ Realtime 구독 설정 준비
  - ✅ UI에서 사용 중인 임시 타입을 실제 DB 스키마 타입으로 교체 (lib/types/database.types.ts)

- **Task 008: 인증 시스템 및 권한 관리** ✅ - 완료
  - ✅ Google OAuth 로그인 플로우 완성 (F010)
  - ✅ 사용자 프로필 자동 생성 로직 구현
  - ✅ 관리자 권한 체크 미들웨어 구현 (role: admin)
  - ✅ 보호된 라우트 접근 제어 구현
  - ✅ 로그아웃 기능 구현
  - ✅ Playwright MCP를 활용한 인증 플로우 E2E 테스트
  - ✅ 관리자 로그인 페이지 추가
  - ✅ 관리자 로그인 권한 검증 추가

- **Task 009: 이벤트 CRUD 및 초대 시스템** ✅ - 완료
  - ✅ 이벤트 생성 API 구현 (F001)
  - ✅ 초대 코드 자동 생성 로직 구현 (F002)
  - ✅ 이벤트 수정/삭제 API 구현 (F006)
  - ✅ 커버 이미지 업로드 기능 구현 (F009)
  - ✅ 초대 링크 공유 기능 구현 (카카오톡, 클립보드) (F003)
  - ✅ 이벤트 상태 자동 관리 로직 구현 (F008)
  - ✅ Playwright MCP를 활용한 이벤트 생성/수정/삭제 테스트

- **Task 010: 참여자 관리** ✅ - 완료
  - ✅ 초대 링크 참여 로직 구현 (F004)
  - ✅ 중복 참여 방지 로직 구현
  - ✅ 실시간 참여자 수 카운트 업데이트
  - ✅ 내가 참여한/만든 이벤트 목록 조회 구현 (F007)
  - ✅ Playwright MCP를 활용한 실시간 참여자 업데이트 테스트

- **Task 011: 관리자 대시보드 백엔드 구현** ✅ - 완료
  - ✅ 대시보드 지표 집계 쿼리 구현 (F012)
  - ✅ 이벤트 관리 테이블 검색/필터/삭제 API 구현 (F013)
  - ✅ 사용자 관리 테이블 검색/필터/삭제 API 구현 (F014)
  - ✅ 통계 데이터 집계 및 그래프 데이터 API 구현 (F015)
  - ✅ 페이지네이션 및 정렬 로직 구현
  - ✅ 데이터베이스 Migration (email, created_at 컬럼 추가)
  - ✅ RLS 정책 완벽 수정 (무한 재귀 오류 해결)
  - ✅ Playwright E2E 테스트 완료 (일반 사용자/관리자 - 0 errors)

- **Task 012: 핵심 기능 통합 테스트** - 구현 중
  - ✅ Playwright E2E 테스트 시나리오 생성 (tests/e2e/full-user-flow.spec.ts)
  - ⏳ 주최자 플로우: 이벤트 생성 → 초대 링크 공유 → 참여자 확인
  - ⏳ 참여자 플로우: 초대 링크 클릭 → 로그인 → 자동 참여
  - ⏳ 관리자 플로우: 로그인 → 지표 확인 → 데이터 관리
  - ⏳ 에러 핸들링 및 엣지 케이스 테스트

### Phase 4: 고급 기능 및 최적화

- **Task 013: 사용자 경험 향상** ✅ - 완료
  - ✅ Toast 알림 시스템 구현 (lib/utils/toast-utils.ts - 도메인별 분류)
  - ✅ 로딩 상태 및 스켈레톤 UI 적용 (components/skeletons/)
  - ✅ 에러 바운더리 구현 (components/ui/error-boundary.tsx + app/layout.tsx)
  - ✅ 폼 유효성 검사 메시지 개선 (components/ui/form-field-error.tsx)
  - ✅ Suspense 경계 구현 (app/protected/events/page.tsx)
  - ✅ 실시간 업데이트 (lib/hooks/useRealtimeSubscription.ts)
  - ✅ EmptyState 컴포넌트 확장 (variant prop)
  - ✅ 접근성 강화 (lib/utils/a11y-utils.ts - ARIA, 키보드 네비게이션)
  - ✅ 애니메이션 시스템 (lib/animations/component-animations.ts)
  - ✅ Toast 사용 가이드 (docs/guides/toast-guide.md)

- **Task 014: 성능 최적화 및 SEO** - 진행 중
  - ✅ **Subtask 1**: Next.config.ts 설정 및 이미지 최적화
    - next.config.ts 생성 (WebP/AVIF 형식 지원, minimumCacheTTL)
    - sharp 패키지 설치 완료
    - @next/bundle-analyzer 설정 (ANALYZE=true npm run analyze)
    - 번들 분석 리포트 생성 완료 (.next/analyze/\*)
    - EventCard 컴포넌트 Image 최적화 검증
  - ✅ **Subtask 2**: SEO 정적 파일 및 동적 사이트맵 생성
    - public/robots.txt 생성 (크롤링 정책 설정 - 보호 라우트 제외, 동적 경로 허용)
    - app/sitemap.ts 생성 (동적 사이트맵 라우트 - MetadataRoute.Sitemap)
    - lib/seo/metadata.ts 생성 (메타데이터 헬퍼 함수 5개)
    - ISR 캐싱 설정: 24시간(86400초)
    - 빌드 검증 완료 (/sitemap.xml 동적 라우트 생성)
  - ✅ **Subtask 3**: Open Graph 및 메타데이터 강화 (루트 레이아웃)
    - app/layout.tsx 메타데이터 확장 (openGraph, robots, twitter, viewport, colorScheme)
    - Open Graph: 이미지 1200x630, locale ko_KR, siteName 설정
    - Twitter 카드: summary_large_image 타입, creator 명시
    - Robots: index, follow, max-image-preview:large, max-snippet, max-video-preview 설정
    - Viewport: initialScale 1, maximumScale 5, userScalable true
    - 다크모드 지원: colorScheme: light dark
    - og-image.png는 메타데이터에서 참조 (사용자 준비)
  - ⏳ **Subtask 4**: 이벤트 페이지별 동적 메타데이터 구현
    - app/protected/events/[id]/page.tsx generateMetadata 함수
    - lib/seo/structured-data.ts 생성 (JSON-LD Event 스키마)
  - ⏳ **Subtask 5**: 성능 측정 및 Lighthouse 검증
    - npm run build 및 Lighthouse 분석 (모바일/데스크톱)
    - 성능 점수 목표: Performance 90+, SEO 95+
    - 번들 크기 검증 (<150KB 메인, <200KB 이벤트 페이지)
    - docs/guides/performance-report.md 작성

- **Task 015: 배포 및 모니터링**
  - Vercel 프로젝트 설정 및 환경 변수 구성
  - CI/CD 파이프라인 구축
  - 에러 모니터링 시스템 설정 (Sentry)
  - 분석 도구 설정 (Google Analytics)
  - 프로덕션 배포 및 도메인 연결
  - 배포 후 통합 테스트 수행

## 작업별 세부 사항

### 각 Task 파일 구조

```markdown
# Task XXX: [작업명]

## 개요

- **목표**: [작업의 핵심 목표]
- **예상 소요 시간**: [X일]
- **관련 기능**: [F001, F002 등]
- **의존성**: [이전에 완료되어야 할 Task]

## 구현 사항

- [ ] 세부 구현 항목 1
- [ ] 세부 구현 항목 2
- [ ] 세부 구현 항목 3

## 수락 기준

- 기준 1: [측정 가능한 완료 조건]
- 기준 2: [측정 가능한 완료 조건]

## 테스트 체크리스트 (API/비즈니스 로직 작업 시)

- [ ] Playwright MCP 테스트 시나리오 1
- [ ] Playwright MCP 테스트 시나리오 2
- [ ] 에러 케이스 테스트

## 관련 파일

- /app/[경로]/page.tsx
- /components/[컴포넌트].tsx
- /lib/[유틸리티].ts
```

## 기술 스택 체크리스트

### 이미 설치됨 ✅

- [x] Next.js 15 (App Router)
- [x] TypeScript 5.6+
- [x] React 19
- [x] Tailwind CSS v4
- [x] shadcn/ui (new-york 스타일)
- [x] Lucide React
- [x] next-themes
- [x] Supabase (@supabase/ssr, @supabase/supabase-js)
- [x] ESLint, Prettier, Husky

### 추가 필요

- [ ] React Hook Form 7.x (Task 004에서 설치)
- [ ] Zod (Task 004에서 설치)
- [ ] Recharts 2.x (Task 006에서 설치)

## 품질 체크리스트

### Phase 완료 기준

#### Phase 1 (애플리케이션 골격)

- [ ] 모든 13개 페이지의 라우트 파일 생성
- [ ] 모바일/데스크톱 레이아웃 분리 완성
- [ ] 프론트엔드 타입 정의 파일 구조 완성
- [ ] 임시 데이터 모델 타입 정의 완료

#### Phase 2 (UI/UX 완성)

- [ ] 모든 페이지 UI가 더미 데이터로 완성
- [ ] 주최자와 참여자의 서로 다른 UX 플로우 동작 확인
- [ ] 권한에 따른 UI 조건부 렌더링 확인
- [ ] 반응형 디자인 적용 완료
- [ ] 다크 모드 지원 완료
- [ ] 사용자 플로우 네비게이션 동작

#### Phase 3 (데이터베이스 설정 및 핵심 기능)

- [ ] 데이터베이스 스키마 생성 및 RLS 설정
- [ ] 모든 API 엔드포인트 구현 완료
- [ ] 실시간 기능 정상 동작
- [ ] 인증 및 권한 시스템 동작
- [ ] Playwright MCP 테스트 모두 통과

#### Phase 4 (최적화)

- [ ] Lighthouse 점수 90+ 달성
- [ ] 모든 이미지 최적화 완료
- [ ] 프로덕션 배포 성공
- [ ] 에러 모니터링 설정 완료

## 주의사항

### 구조 우선 접근법 준수

1. **Phase 1을 완벽히 완료 후 Phase 2 시작**: 골격이 완성되지 않으면 UI 작업 시작 금지
2. **더미 데이터로 전체 UI 완성 후 데이터베이스 설계**: UI가 완성되어 요구사항이 확정된 후 최적화된 스키마 설계
3. **공통 컴포넌트 우선 개발**: 페이지별 컴포넌트보다 공통 컴포넌트 먼저 완성
4. **UI 피드백 반영 후 백엔드 구현**: UI 검토를 통해 도출된 개선사항을 데이터베이스 설계에 반영

### 테스트 필수 사항

1. **모든 API 연동은 Playwright MCP로 테스트**: 수동 테스트 의존 금지
2. **각 Phase 완료 시 통합 테스트 수행**: Phase 간 전환 시 회귀 테스트 필수
3. **에러 케이스 반드시 테스트**: Happy path만 테스트하지 말고 에러 상황도 검증

### 성능 목표

1. **모바일 First Contentful Paint**: 1.5초 이하
2. **Time to Interactive**: 3초 이하
3. **이미지 로딩**: Lazy loading 필수 적용
4. **번들 크기**: 각 페이지 200KB 이하

## 다음 단계

1. **즉시 시작**: Task 001 (프로젝트 구조 및 라우팅 설정)
2. **구현 시작**: 라우트 파일 및 레이아웃 골격 구축
3. **UI 우선 개발**: Phase 2에서 더미 데이터로 전체 UI를 완성한 후 데이터베이스 설계 진행

---

**📅 최종 업데이트**: 2026-04-08
**📊 진행 상황**: Phase 4 진행 중 (Task 014 Subtask 3/5 완료 - 87%)

**📌 이 로드맵은 6주 내 MVP 완성을 목표로 하며, 각 Task는 1-2일 내 완료 가능한 단위로 구성되었습니다.**
**구조 우선 접근법을 엄격히 준수하여 중복 작업을 최소화하고 팀 협업 효율을 극대화합니다.**
