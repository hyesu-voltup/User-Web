기술 스택
Next.js 14+ 또는 React 18+ (Vite), TypeScript, Tailwind, TanStack Query

사용자 웹은 크게 인증, 포인트 확인, 이벤트(룰렛), 상품 구매 4가지 흐름으로 나뉩니다.

1. 인증 및 세션 유지 (Auth)
로그인 (POST /api/v1/auth/login): 닉네임만 입력하여 접속합니다. 이때 받은 userId가 이후 모든 활동의 열쇠가 됩니다.

헤더 (X-User-Id): 로그인 후 모든 API 요청에는 이 userId를 헤더에 실어 보내야 본인의 정보를 조회/변경할 수 있습니다.

2. 홈 및 자산 확인 (Points)
포인트 요약 (GET /api/v1/points/me): 메인 화면 상단에 '현재 가용 잔액'과 '7일 이내 만료 예정' 금액을 노출해야 합니다.

상세 내역 (GET /api/v1/points/me/{userId}): 포인트가 언제, 어디서(룰렛 당첨 등) 들어왔는지 히스토리를 보여줍니다.

3. 이벤트 참여 (Roulette)
룰렛 돌리기 (POST /api/v1/roulette/participate): * 제약 사항: 당일 1인 1회만 가능 (이미 참여 시 C007 에러 발생).

예산 로직: 서버의 일일 예산이 초과되면 자동으로 0P(꽝) 처리가 되므로, 프론트에서는 결과값(grantedPoint)을 애니메이션 종료 후 명확히 보여줘야 합니다.

4. 쇼핑 및 주문 (Products & Orders)
상품 목록 (GET /api/v1/products): 모든 사용자가 볼 수 있는 기프트카드 등의 목록입니다. (재고가 0인 상품 처리 필요)

상품 구매 (POST /api/v1/orders): 구매 시 포인트 부족(C005)이나 재고 부족(C006)에 대한 예외 처리가 필수입니다.

내 주문 내역 (GET /api/v1/orders/me/{userId}): 본인이 구매한 상품 리스트를 확인합니다.

---

## Vercel 배포

1. 저장소를 Vercel에 연결 후 Deploy.
2. **Environment Variables** (프로덕션용)
   - **VITE_API_BASE_URL** (선택): 백엔드 API 베이스 URL (예: `https://voltupbe.onrender.com`). 없으면 기본값 사용.
   - **VITE_USE_API_PROXY** (권장): `true` 로 설정하면 요청을 Vercel 도메인 `/api` 로 보내고, `vercel.json` 의 rewrite 가 백엔드로 프록시해 **CORS 없이** 동작합니다.
3. CORS 에러가 나는 경우: **VITE_USE_API_PROXY=true** 로 설정 후 재배포. (`.env`는 로컬용이며 Vercel에는 반영되지 않음)