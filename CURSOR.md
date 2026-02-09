# CURSOR.md - 프로젝트 ai 정리 내용
> CURSOR ai를 활용한 유저 웹 페이지 제작 대화 정리리

---

## 1. 프로젝트 틀 및 인증

### 1.1 초기 아키텍처

**Aside**  
README와 요구사항을 먼저 읽고, 스택·라우팅·인증을 한 번에 설계할 수 있는지 확인.

**요청**  
- 모바일 웹 최적화 레이아웃  
- LG 볼트업 테마(화이트 + 포인트 컬러)  
- 하단 탭바: 홈, 룰렛, 상품, 내 정보 (lucide-react)  
- X-User-Id 헤더를 붙인 Axios 인스턴스  
- 미인증 시 로그인 페이지로 리다이렉트

**결론·구현**  
- Vite + React + TypeScript + Tailwind + TanStack Query 기준으로 구조 확정.  
- `apiClient`: `getStoredUserId()`로 매 요청에 `X-User-Id` 부착.  
- `AuthContext`(userId, nickname, login, logout) + `ProtectedRoute`(미인증 시 `/login?returnUrl=...`).  
- 로그인은 닉네임만 입력하는 **간편 로그인**으로, `POST /api/v1/auth/login` → `userId` 저장 후 전역 사용.

---

### 1.2 사용자 생성 vs 간편 로그인

**Aside**  
백엔드 API 설계(사용자 생성 vs 로그인)를 이해하고, 올바른 엔드포인트와 파라미터를 선택하는지.

**요청**  
- 사용자 생성: `POST /api/v1/users` (loginId, name → id, loginId, name), `id`를 X-User-Id로 사용.  
- 로그인은 닉네임만 입력.  
- Swagger 기준으로 **간편 로그인** `POST /api/v1/auth/login` (nickname → userId) 사용하도록 수정.

**결론·구현**  
- 로그인 플로우를 `POST /api/v1/auth/login`으로 통일.  
- 응답 `userId`를 저장하고 X-User-Id·닉네임(홈/내 포인트 표시)에 사용.

---

### 1.3 CORS 및 API 베이스 URL

**Aside**  
크로스 오리진 환경에서 API 연동을 스스로 해결할 수 있는지(프록시 vs CORS 이해).

**요청**  
- 백엔드 API 요청 실패 → `.env`에 넣은 사이트로 요청 보내도록 수정.

**결론·구현**  
- **개발**: `baseURL = '/api'`로 두고, Vite 프록시 `/api` → `VITE_API_BASE_URL`로 전달해 CORS 회피.  
- **프로덕션**: `VITE_API_BASE_URL` 사용 (백엔드 CORS 설정 필요).  
- 경로는 README 기준 `/api/v1/...`로 통일.

---

## 2. UI/UX 및 테마

### 2.1 가독성 (네온 배경 위 텍스트)

**Aside**  
시각적 접근성과 일관된 컬러 시스템을 고려하는지.

**요청**  
- 네온 하이라이트 배경은 유지하되, 그 위 글씨·아이콘은 검정(또는 비슷한 색)으로.

**결론·구현**  
- `text-brand` → `text-content`로 변경 (홈 잔액, 포인트 상세 총액, 홈 카드 아이콘).  
- 탭바: 활성 탭은 `bg-brand-light` + `text-content`로 배경만 강조, 텍스트/아이콘은 검정 계열 유지.

---

### 2.2 메인 컬러 변경

**Aside**  
디자인 토큰을 한 곳에서 관리하고, 요구사항 변경에 빠르게 대응하는지.

**요청**  
- Red → `#E4FF30`로 메인 컬러만 변경.

**결론·구현**  
- `tailwind.config.js`의 `brand`, `tabbar.active`를 `#E4FF30` 계열로 수정.  
- 버튼 등 `bg-brand` 위 텍스트는 이미 `text-content` 사용해 가독성 유지.

---

## 3. 홈 및 포인트

### 3.1 홈 화면

**Aside**  
API 명세를 보고 도메인 모델(잔액/만료)을 이해하고, 사용자 행동 유도(만료 안내, CTA)를 넣는지.

**요청**  
- 상단: 닉네임 + `GET /api/v1/points/me`로 **가용 잔액** 강조.  
- 그 아래: **7일 이내 만료 예정** 포인트를 작게 표시해 사용 유도.  
- 중앙: "룰렛 돌리러 가기", "인기 상품 보기" 카드형 바로가기.

**결론·구현**  
- `usePointsMe()`로 포인트 요약 조회.  
- 응답 필드가 `availableBalance`, `expiringWithin7Days`인 경우도 `normalizePointsMe`에서 매핑.  
- 당첨/구매 후 `invalidateQueries(POINTS_ME_QUERY_KEY)`로 잔액 즉시 갱신.

---

### 3.2 홈에 룰렛 통합 + 탭 재구성

**Aside**  
정보 구조(IA)와 사용자 플로우를 단순화할 수 있는지.

**요청**  
- 홈에 룰렛이 있어야 함.  
- 하단 탭 순서: **홈(룰렛)** → **내 포인트** → **상품 목록** → **주문 내역**.

**결론·구현**  
- `RouletteSection` 컴포넌트로 룰렛 블록 분리 후, **Home**에 포인트 요약 + 룰렛 + 상품 바로가기만 배치.  
- `/roulette` 라우트 제거.  
- 탭바: Home, Wallet(내 포인트), Gift(상품 목록), ListOrdered(주문 내역).  
- **주문 내역** 전용 페이지 `/orders` 추가, `GET /api/v1/orders/me/{userId}` 리스트 표시.

---

## 4. 룰렛 이벤트

**Aside**  
비동기 플로우(상태 확인 → 액션 → 로딩/에러/결과)와 서버 제약(1인 1회, 예산)을 고려해 설계하는지.

**요청**  
- 진입 시 오늘 참여 여부 확인 → 이미 참여 시 "내일 다시 참여해주세요".  
- "룰렛 돌리기" 클릭 시 `POST /api/v1/roulette/participate`.  
- 응답 전까지 룰렛 회전 애니메이션 → 결과(grantedPoint)에 따라 축하/꽝 팝업.  
- 성공 시 포인트 `invalidateQueries`.  
- 버튼 로딩 상태로 중복 클릭 방지.  
- 에러 코드(C011 등)는 사용자용 문구로 매핑.

**결론·구현**  
- `GET /api/v1/roulette/status`(선택)로 참여 여부 확인; 404 등이면 참여 가능 처리.  
- C007(이미 참여) 시 "내일 다시 참여해주세요" 노출 및 `localParticipated`로 세션 동안 비활성화.  
- `RouletteWheel`: `requestAnimationFrame` + ease-out cubic으로 부드럽게 감속 정지(라이브러리 없음).  
- `getRouletteErrorMessage`, C007/C011 매핑.  
- `isSpinning` 동안 버튼 비활성화.

---

## 5. 상품 및 주문

### 5.1 상품 목록·상세·구매

**Aside**  
REST API와 에러 코드를 이해하고, 재고/포인트 제약을 UI에 반영하는지.

**요청**  
- `GET /api/v1/products` 2열 그리드.  
- 상품 클릭 시 상세(모달), 수량 선택 후 "구매하기" → `POST /api/v1/orders`.  
- C005(포인트 부족), C006(재고 부족) 시 **toast**로 안내.

**결론·구현**  
- `useProducts()`, `ProductDetailModal`(수량, 합계, 구매하기).  
- Swagger 기준 body: `{ productId: number, quantity: number }` (camelCase, number).  
- `getOrderErrorMessage`로 C005/C006 → 한글 메시지.  
- ToastProvider + `showToast()`로 하단 토스트 노출.  
- 재고 0은 "품절" 표시 및 비활성화.

---

### 5.2 상품 API 응답 형식 대응

**Aside**  
실제 백엔드 응답과 프론트 타입/필드명 차이를 스스로 해결하는지.

**요청**  
- 응답이 `id`(숫자), `pointPrice`, `stock` 형태인데 상품이 안 보임 → 연결.

**결론·구현**  
- `toProduct()`에서 `pointPrice`/`point_price`, `id`(숫자 → 문자열) 매핑.  
- `price` 없을 때 NaN으로 걸러지던 부분 수정해 목록 정상 표시.

---

### 5.3 구매 가능 여부 및 문구

**Aside**  
도메인 규칙(잔액 ≥ 단가)을 UI에 명시하고, 로딩 상태 문구를 명확히 하는지.

**요청**  
- 카드에 "구매할 수 있는지" 표시.  
- 구매 불가 시 클릭 불가.  
- 구매 중에는 "처리 중" 스켈레톤이 아니라 "구매 중입니다." 문구.

**결론·구현**  
- `usePointsMe()`로 가용 잔액 조회.  
- 카드별: `availablePoint >= price` → "구매 가능"(녹색), 미만 → "포인트 부족"(주황), 비활성화.  
- 모달 구매 버튼 로딩 시 "구매 중입니다."로 표시.

---

### 5.4 Internal Server Error / Swagger 준수

**Aside**  
API 명세(Swagger)와 실제 요청 형식 불일치를 의심하고 수정할 수 있는지.

**요청**  
- 구매 시 Internal Server Error → Swagger 기준으로 수정.

**결론·구현**  
- Swagger: body `productId`(camelCase), **number** 타입.  
- 기존 `product_id`(snake_case)·문자열 전송을 `{ productId: number, quantity: number }`로 변경.

---

### 5.5 반응형 및 스켈레톤

**Aside**  
모바일 UX(버튼 가시성, 로딩 인지)를 고려하는지.

**요청**  
- 화면 축소 시 구매하기 버튼이 안 보이는 문제 → 다양한 모바일 환경 대응.  
- API 통신 중 멈춤처럼 보이지 않도록 **Skeleton** 처리.

**결론·구현**  
- 모달: 스크롤 영역(`flex-1 overflow-y-auto`) + 하단 고정 버튼(`flex-shrink-0`), safe-area.  
- 상품 목록 로딩: `ProductGridSkeleton`.  
- 홈 잔액 로딩: `PointsSkeleton`.

---

## 6. 내 포인트

**Aside**  
"버튼으로 이동"보다 "바로 보여주기"가 나은 화면을 구분하고, 상단 액션(로그아웃) 배치를 의도적으로 하는지.

**요청**  
- 포인트 상세를 버튼으로 여는 게 아니라 **리스트로 바로** 표시.  
- 로그아웃은 **상단**에 두기.

**결론·구현**  
- 내 포인트 페이지 진입 시 `GET /api/v1/points/me/{userId}` 호출.  
- 총 잔액 카드 + 적립/사용 내역(histories) 리스트를 같은 페이지에 직접 렌더링.  
- 상단 우측에 로그아웃 버튼 배치.  
- "내 포인트 상세 조회" 버튼 및 PointDetailModal 제거.

---

## 7. 포인트 API 응답 필드

**Aside**  
실제 API 스펙 변경(필드명)을 빠르게 반영하는지.

**요청**  
- `GET /api/v1/points/me` 응답이 `availableBalance`, `expiringWithin7Days`일 때 연결.

**결론·구현**  
- `normalizePointsMe`에서 `availableBalance` → `availablePoint`, `expiringWithin7Days` → `expiringPoint` 매핑.  
- 기존 snake_case/다른 필드명도 fallback으로 처리.

---

## 기술 스택 요약

| 구분 | 선택 |
|------|------|
| 런타임 | React 18+ (Vite), TypeScript |
| 스타일 | Tailwind CSS |
| 데이터·API | TanStack Query, Axios (X-User-Id 인터셉터) |
| 라우팅 | React Router v7 |
| 아이콘 | lucide-react |
| 인증 | AuthContext + localStorage (userId, nickname) |

---

