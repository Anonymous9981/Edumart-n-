## Plan: Strict Role UX + Shared Profiles (Enhanced Production Version)

Implement strict role isolation across dashboard/navigation and introduce a scalable shared profile system with role-based extensions, ensuring secure auth validation, centralized role handling, and future-ready architecture while preserving existing auth/session infrastructure.

Steps
Phase 1: Harden Authorization Boundaries
Update apps/web/middleware.ts to enforce strict role-based route protection using exact role matching (no hierarchy or fallback access).
Add DB role verification in middleware (do not rely only on JWT role).
Add fallback handling:
Unauthenticated → redirect /login
Unauthorized → redirect /unauthorized
Introduce centralized role-route mapping (constants/roles.ts) for maintainability.
Phase 2: Server-Side Role Guards
Create reusable role guard utility (lib/require-role.ts) to enforce role checks at page level.
Apply role guards in:
apps/web/app/dashboard/customer/page.tsx
apps/web/app/dashboard/vendor/page.tsx
apps/web/app/dashboard/admin/page.tsx
Ensure guards redirect unauthorized users consistently.
Phase 3: Role-Locked Dashboard Experience
Update apps/web/app/dashboard/page.tsx:
Remove multi-role UI
Add strict role-based redirect:
customer → /dashboard/customer
vendor → /dashboard/vendor
admin → /dashboard/admin
Add fallback for invalid roles → /unauthorized
Refactor apps/web/app/dashboard/layout.tsx:
Fetch user role server-side
Render role-specific navigation only
Include profile + logout actions
Update apps/web/components/app-header.tsx:
Show role-based dashboard entry
Hide guest-only controls when logged in
Add role indicator badge (Customer/Vendor/Admin)
Phase 4: Shared Profile System (Unified + Scalable)
Create unified profile API:
apps/web/app/api/v1/profile/route.ts
Methods: GET, PUT
Implement role-aware update logic inside same API:
Base fields for all roles
Vendor-specific fields only if role = VENDOR
Deprecate need for separate /vendor/profile endpoint (merge logic internally).
Create shared profile UI:
apps/web/app/dashboard/profile/page.tsx
Fields:
All roles → firstName, lastName, phone, bio, avatar
Vendor only → storeName, businessEmail, GST, address
Ensure form dynamically adapts based on role.
Phase 5: Validation Layer
Add schema:
packages/validation/src/profile.ts
Export via:
packages/validation/src/index.ts
Implement role-based validation rules:
Prevent invalid field submission per role
Enforce required vendor fields
Add request-level validation in API routes.
Phase 6: Data Consistency & Auth Integrity
Update:
apps/web/app/api/v1/auth/login/route.ts
apps/web/app/api/v1/auth/signup/route.ts
Ensure:
Role is stored in DB, JWT, and session consistently
Add runtime check:
If JWT role ≠ DB role → force logout
Optional:
Validate OAuth role handling in:
apps/web/app/api/v1/auth/google/callback/route.ts
Redirect new OAuth users to /select-role if role not assigned
Phase 7: Navigation & UX Enhancements
Implement centralized navigation config per role.
Add:
Active route highlighting
Role badge display
Ensure dashboard navigation is fully role-isolated.
Phase 8: Security & System Enhancements
Add account status field (ACTIVE, SUSPENDED, PENDING)
Block suspended users via middleware.
Add rate limiting on:
login
signup
OTP APIs
Add optional audit logging for admin actions.
Phase 9: Avatar Handling Strategy
Phase 1:
Use avatar URL input field
Phase 2 (future):
Integrate image upload (Cloudinary/S3)
Add validation:
File type
Size limits
Phase 10: Verification
Run:
pnpm --filter @edumart/web typecheck
pnpm --filter @edumart/web lint
Manual role access testing:
Customer → only /dashboard/customer
Vendor → only /dashboard/vendor
Admin → only /dashboard/admin
Validate /dashboard auto-redirect behavior.
Test profile updates:
Customer/Admin → basic fields
Vendor → basic + business fields
Test edge cases:
Invalid token
Expired session
Unauthorized route access
Verify logout resets UI to guest state.
Relevant Files
/apps/web/middleware.ts — strict role enforcement + status check
/apps/web/constants/roles.ts — centralized role-route mapping
/apps/web/lib/require-role.ts — reusable role guard utility
/apps/web/app/dashboard/page.tsx — role-based redirect
/apps/web/app/dashboard/layout.tsx — role-aware navigation
/apps/web/app/dashboard/customer/page.tsx — guarded customer page
/apps/web/app/dashboard/vendor/page.tsx — guarded vendor page
/apps/web/app/dashboard/admin/page.tsx — guarded admin page
/apps/web/components/app-header.tsx — role-based header UI
/apps/web/app/api/v1/profile/route.ts — unified profile API
/apps/web/app/dashboard/profile/page.tsx — shared profile UI
/packages/validation/src/profile.ts — validation schema
/packages/validation/src/index.ts — schema exports
/apps/web/app/api/v1/auth/login/route.ts — role consistency
/apps/web/app/api/v1/auth/signup/route.ts — role assignment
/apps/web/app/api/v1/auth/google/callback/route.ts — OAuth handling
Verification
Run typecheck/lint for web app.
Validate strict role isolation (no cross-role dashboard access).
Confirm /dashboard redirects correctly per role.
Test profile updates for all roles.
Verify vendor-specific fields persist correctly.
Ensure unauthorized access redirects properly.
Confirm suspended users cannot access dashboard.
Decisions
Enforce strict role isolation (no hierarchy access)
Use single unified profile API with role-based logic
Vendor-specific fields only editable by vendor role
/dashboard must always auto-redirect based on role
Avatar handled via URL initially, upload system later
OAuth requires role selection if not predefined
Further Considerations
OAuth Role Strategy
Option A: Default CUSTOMER
Option B: Role selection on first login ✅ (Recommended)
Option C: Domain-based mapping
Avatar Strategy
Option A: URL-based (fast) ✅
Option B: Upload system (scalable)
Future Enhancements
Role-based feature flags
Admin audit logs
Multi-vendor approval workflows