# EduMart Test Cases (Industry Style)

This document explains what test cases are and provides practical, project-specific test cases for EduMart.

## What Is A Test Case?

A test case is a structured check that verifies one behavior of the software.

A good test case includes:
- Test case ID
- Objective (what we validate)
- Preconditions (required setup)
- Steps to execute
- Expected result
- Priority and type (smoke, regression, security, etc.)

In teams, this helps ensure repeatable quality before production deploys.

## Test Strategy For EduMart

Use a layered approach:
- Smoke tests: fast critical-path checks after each deploy
- Functional regression: cart, checkout, auth, role-based access
- Security tests: auth, authorization, session, input validation
- Production safety tests: migration, env config, build/runtime health
- API contract tests: request/response shapes and error handling

Recommended environments:
- Local development
- Staging (production-like)
- Production post-deploy smoke

## Test Data Baseline

Prepare seed users:
- Customer account
- Vendor account
- Admin account

Prepare seed catalog:
- 5+ products across categories
- 1 active coupon
- 1 out-of-stock product

## Critical Smoke Suite (Run Every Deploy)

### TC-SMOKE-001: Web Homepage Availability
- Objective: Verify web app is reachable.
- Preconditions: Deployment completed.
- Steps:
  1. Open home page.
  2. Verify featured content renders.
- Expected result: HTTP 200 and homepage content visible.
- Priority: P0

### TC-SMOKE-002: Customer Login
- Objective: Verify auth path works.
- Preconditions: Valid customer account exists.
- Steps:
  1. Go to login page.
  2. Submit valid credentials.
- Expected result: Login success, user redirected to authenticated area.
- Priority: P0

### TC-SMOKE-003: Add To Cart
- Objective: Verify cart operation works.
- Preconditions: Logged in customer, in-stock product.
- Steps:
  1. Open product detail.
  2. Click Add to Cart.
  3. Open cart.
- Expected result: Item appears with correct quantity and price.
- Priority: P0

### TC-SMOKE-004: Checkout Success
- Objective: Verify order placement path works.
- Preconditions: Cart has at least one item.
- Steps:
  1. Open checkout.
  2. Fill shipping details.
  3. Place order.
- Expected result: Order-success page shown and order record created.
- Priority: P0

### TC-SMOKE-005: API Health Endpoint
- Objective: Verify API health is up.
- Preconditions: App is deployed.
- Steps:
  1. Call health endpoint.
- Expected result: Health response is successful and contains expected status fields.
- Priority: P0

## Security Test Cases (High Priority)

### TC-SEC-001: Invalid JWT Rejected
- Objective: Ensure unauthorized tokens are blocked.
- Preconditions: Protected API endpoint available.
- Steps:
  1. Call protected endpoint with malformed token.
  2. Call protected endpoint with expired token.
- Expected result: 401 Unauthorized, no data leakage.
- Priority: P0

### TC-SEC-002: RBAC Enforcement
- Objective: Ensure role-based restrictions are enforced.
- Preconditions: Customer, vendor, admin users exist.
- Steps:
  1. Login as customer.
  2. Attempt admin-only endpoint/page.
  3. Login as vendor and attempt admin-only action.
- Expected result: Access denied (403 or redirect to unauthorized), no mutation performed.
- Priority: P0

### TC-SEC-003: SQL/NoSQL Injection Defense
- Objective: Verify input validation and query safety.
- Preconditions: Search/login/filter forms available.
- Steps:
  1. Submit payload like `' OR 1=1 --` in text fields.
  2. Submit JSON payload with unexpected nested operators.
- Expected result: Request rejected or safely handled; no abnormal data exposure.
- Priority: P0

### TC-SEC-004: XSS Protection
- Objective: Ensure user content is safely rendered.
- Preconditions: Fields that store/display user text (reviews/profile names).
- Steps:
  1. Submit script payload in review or profile field.
  2. View rendered page as another user.
- Expected result: Script does not execute; content escaped/sanitized.
- Priority: P0

### TC-SEC-005: CSRF Protection On State-Changing Endpoints
- Objective: Ensure cross-site forged requests are blocked.
- Preconditions: Authenticated browser session.
- Steps:
  1. Send state-changing request without valid CSRF token/cookie pairing.
- Expected result: Request rejected with 403/invalid CSRF error.
- Priority: P0

### TC-SEC-006: Rate Limiting On Auth Endpoints
- Objective: Prevent brute-force attacks.
- Preconditions: Auth endpoints exposed.
- Steps:
  1. Trigger rapid failed logins from same IP/user.
- Expected result: Throttling or temporary block after threshold.
- Priority: P0

### TC-SEC-007: Password Policy And Hashing
- Objective: Ensure strong password and secure storage.
- Preconditions: Signup endpoint active.
- Steps:
  1. Attempt weak passwords.
  2. Create valid account and inspect persisted password storage behavior.
- Expected result: Weak passwords rejected; stored credentials are hashed only.
- Priority: P1

### TC-SEC-008: Sensitive Data Not Exposed In Errors
- Objective: Prevent secret leakage.
- Preconditions: Triggerable API validation/runtime errors.
- Steps:
  1. Send malformed payload.
  2. Observe API and UI error responses.
- Expected result: No stack traces, secrets, or internal connection strings exposed.
- Priority: P0

## Production Break-Risk Test Cases

### TC-PROD-001: Environment Variable Completeness
- Objective: Catch missing env values before runtime.
- Preconditions: Release candidate build.
- Steps:
  1. Validate required env variables are present for web and mobile pipelines.
  2. Start app in production mode.
- Expected result: Startup succeeds with no missing-env runtime crash.
- Priority: P0

### TC-PROD-002: Database Migration Safety
- Objective: Ensure schema changes do not break app startup and key flows.
- Preconditions: Staging DB snapshot.
- Steps:
  1. Run migration on staging copy.
  2. Run smoke suite (login, catalog, cart, checkout).
  3. Verify rollback plan exists.
- Expected result: No broken queries, no data loss, rollback path documented.
- Priority: P0

### TC-PROD-003: Backward Compatibility Of API Responses
- Objective: Prevent frontend/mobile break due to response shape changes.
- Preconditions: New API build and previous client versions.
- Steps:
  1. Run old mobile/web client against new API in staging.
  2. Exercise critical endpoints.
- Expected result: No client crash for unchanged API contract paths.
- Priority: P0

### TC-PROD-004: Build Artifact Integrity (Web + APK)
- Objective: Ensure deployable artifacts are generated correctly.
- Preconditions: CI pipeline run.
- Steps:
  1. Build web production artifact.
  2. Build mobile Android release APK profile.
  3. Install APK on test device.
- Expected result: Artifacts created successfully and app launches.
- Priority: P0

### TC-PROD-005: Post-Deploy Health And Log Review
- Objective: Detect early production failures.
- Preconditions: Deployment completed.
- Steps:
  1. Run health check endpoint.
  2. Execute smoke suite.
  3. Review error logs for 5xx spikes and auth failures.
- Expected result: Health green, no abnormal error spike.
- Priority: P0

### TC-PROD-006: Cache/Session Consistency Across Restart
- Objective: Ensure app behavior remains valid after restart/scale events.
- Preconditions: Active sessions and cart state.
- Steps:
  1. Restart app service.
  2. Re-check session validity and cart integrity.
- Expected result: No forced data corruption/loss; invalid sessions handled gracefully.
- Priority: P1

### TC-PROD-007: Third-Party Service Degradation
- Objective: Verify graceful fallback when dependencies fail.
- Preconditions: Ability to simulate Supabase/storage/network outage.
- Steps:
  1. Simulate dependency timeout/failure.
  2. Perform login or image/product fetch flows.
- Expected result: Controlled errors, retry behavior, no app crash.
- Priority: P1

## Functional Regression Test Cases (Core Business)

### TC-FUNC-001: Vendor Cannot Edit Another Vendor Product
- Objective: Ensure tenant isolation between vendors.
- Preconditions: Two vendor accounts with separate products.
- Steps:
  1. Login as Vendor A.
  2. Attempt update/delete Vendor B product by URL/API tampering.
- Expected result: Access denied, no data mutation.
- Priority: P0

### TC-FUNC-002: Coupon Validation
- Objective: Validate discount logic and constraints.
- Preconditions: Active and expired coupons available.
- Steps:
  1. Apply valid coupon.
  2. Apply expired/invalid coupon.
- Expected result: Correct discount for valid coupon; invalid coupon rejected with clear message.
- Priority: P1

### TC-FUNC-003: Out-Of-Stock Purchase Block
- Objective: Prevent ordering unavailable inventory.
- Preconditions: Product stock set to 0.
- Steps:
  1. Try add-to-cart and checkout.
- Expected result: Purchase blocked with user-friendly message.
- Priority: P0

### TC-FUNC-004: Audit Log Creation For Admin Actions
- Objective: Ensure traceability of privileged operations.
- Preconditions: Admin account.
- Steps:
  1. Perform admin action (suspend vendor, approve product).
  2. Check audit logs.
- Expected result: Action logged with actor, target, timestamp, and action type.
- Priority: P1

## Suggested Automation Mapping

- E2E (Playwright/Appium): TC-SMOKE-001..004, TC-FUNC-002..003
- API integration (Jest or Vitest + supertest): TC-SEC-001..006, TC-FUNC-001
- Unit tests: validation schemas, pricing calculations, RBAC helpers
- Pipeline gates:
  - Required on PR: type-check, lint, unit, API integration subset
  - Required before production: smoke E2E, migration safety, security regression subset

## Simple Test Case Template You Can Reuse

Copy this for new scenarios:

ID: TC-XXXX-001
Title: <short name>
Type: Smoke | Functional | Security | Regression | Performance
Priority: P0 | P1 | P2
Preconditions: <state, users, data>
Steps:
1. ...
2. ...
3. ...
Expected Result: <clear pass condition>
Actual Result: <filled during execution>
Status: Pass | Fail | Blocked
Owner: <name/team>

## Minimum Release Gate For EduMart

Before each production release, pass:
- All P0 smoke test cases
- All P0 security test cases
- Migration safety test (TC-PROD-002)
- Post-deploy health verification (TC-PROD-005)

If any fail, stop release and fix before proceeding.