# JITALX Security Specification (Phase 0 — Payload-First Security TDD)

## 1. Data Invariants
1. **Default Deny**: Every unmatched path under `/databases/{database}/documents` is denied for read and write.
2. **PII Isolation (`/users/{userId}`)**: A user profile contains PII (`email`, `displayName`, `streamerHandle`, `bio`). Only `isOwner(userId)` or `isAdmin()` may read it. Non-admins cannot list `/users`.
3. **Privilege Escalation Prevention**: A member creating `/users/{userId}` MUST set `role == 'member'` and `uid == request.auth.uid`. Members cannot modify `role`, `uid`, `email`, or `createdAt` during update.
4. **Bootstrapped Verified Admin**: `harzyyouness75@gmail.com` is only recognized as admin when `request.auth.token.email_verified == true`.
5. **Catalog Integrity (`/videos`, `/mediaAssets`, `/siteCopy`, `/news`, `/promos`)**: Public visitors can read published catalog content, but ONLY verified admins (`isAdmin()`) can create, update, or delete.
6. **Support Requests (`/contactRequests/{requestId}`)**: Authenticated verified users can create a request with `userId == request.auth.uid`, `status == 'new'`, and server timestamps (`request.time`). Users can only read/list their own requests (`resource.data.userId == request.auth.uid`). Only admins can list all requests, update `status`, or delete. Terminal state `resolved` cannot be modified by non-admins.
7. **Strict Key & Size Enforcement**: Every `create` verifies `keys().hasAll(...) && keys().hasOnly(...)`; every `update` begins with `isValid[Entity](incoming())` and uses `affectedKeys().hasOnly(...)`; every string has an explicit `.size()` bound; every single-doc operation validates `isValidId(...)`.

## 2. The "Dirty Dozen" Adversarial Payloads (Must All Be Denied)
1. **Self-Assigned Admin Role on Signup**: `POST /users/{uid}` with `{ role: "admin", ... }` as non-admin -> DENIED.
2. **Role Escalation on Update**: `PATCH /users/{uid}` changing `role` from `"member"` to `"admin"` -> DENIED.
3. **Shadow Field Injection**: `PATCH /users/{uid}` adding `{ isVerified: true }` -> DENIED.
4. **Cross-User PII Read**: `GET /users/{otherUid}` as a regular member -> DENIED.
5. **Unverified Admin Email Spoof**: Request with `email: "harzyyouness75@gmail.com"` and `email_verified: false` -> DENIED.
6. **Unauthorized Video Overwrite**: `PUT /videos/vid-a` as regular member -> DENIED.
7. **Client Timestamp Forgery**: `POST /contactRequests/req-1` with client-supplied `createdAt != request.time` -> DENIED.
8. **Support Request Spoofed Owner**: `POST /contactRequests/req-2` with `userId != request.auth.uid` -> DENIED.
9. **Support Request Status Shortcut**: `POST /contactRequests/req-3` with `status: "resolved"` instead of `"new"` -> DENIED.
10. **Oversized ID Poisoning**: `PUT /users/<200-char-junk-id>` -> DENIED by `isValidId()`.
11. **Oversized String Payload**: `PATCH /users/{uid}` with 5000-character `bio` -> DENIED by `bio.size() <= 400`.
12. **Blanket Contact List Scrape**: `LIST /contactRequests` by regular member without matching `userId == request.auth.uid` -> DENIED.
