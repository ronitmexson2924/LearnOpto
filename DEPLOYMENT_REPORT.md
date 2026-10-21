# LearnOpto — Deployment Diagnosis Report

**Date:** 2026-10-21
**Scope:** Frontend (Vite/React on Netlify → `www.learnopto.site`), Backend (Express/Prisma on Render → `learnopto-2.onrender.com`), Neon Postgres.
**Method:** Clean-clone builds that match how Netlify and Render build the repo, a review of the uncommitted changes, and live probes of the deployed domains and API.

---

## TL;DR

The code compiles. The problems are in how the app is committed, configured and hosted:

| # | Severity | Problem | Effect |
|---|----------|---------|--------|
| 1 | 🔴 Blocker | New files (`backend/src/services/`, `frontend/scripts/`, `frontend/public/og-image.png`) are **untracked**, but the tracked files you changed **depend on them** | If you push the modified files without these new ones, **both the Netlify and Render builds fail** |
| 2 | 🔴 Blocker | Apex domain `learnopto.site` has **3 A records, and 2 of them point to GoDaddy forwarding servers** instead of Netlify | About 1 in 3 visits to `https://learnopto.site` fail with a TLS error ("site can't be reached") |
| 3 | 🔴 High | Frontend and API are on **different sites** (`learnopto.site` vs `onrender.com`), so the login cookie is a **third-party cookie** | Login "succeeds" then the user is logged out again on **Safari, iPhone, Brave, Firefox strict, and Chrome Incognito** |
| 4 | 🔴 High (security) | CORS **reflects every origin** with `credentials: true` | Any website can make logged-in API calls as your users |
| 5 | 🟠 Medium | No `app.set("trust proxy", …)` behind Render's proxy | Rate limiting likely keys on Render's proxy IP, so all users may share one 100-requests/15-min bucket |
| 6 | 🟠 Medium | Render free tier: cold starts and SMTP blocked | First request after idle took **22.7 s**; login-alert emails over Gmail SMTP (port 587) will likely never send |
| 7 | 🟡 Low | Prisma migrations are split: `backend/prisma/migrations` holds only the **last** of 3 migrations | `prisma migrate deploy` on a new database fails; schema changes don't reach production automatically |
| 8 | 🟡 Low | Your local changes aren't deployed yet | The live site still shows the old title "AI Study Assistant", and `/og-image.png` returns HTML (the SPA fallback), so social previews are broken |

---

## ✅ Code fixes applied (2026-10-21, not committed yet)

| Fix | Files | Checked locally |
|---|---|---|
| `trust proxy` (configurable with `TRUST_PROXY_HOPS`, default `1`) | `backend/src/index.ts`, `backend/src/config/security.ts` | Rate-limit buckets are now per client IP (`1.1.1.1` → 99, 98; `2.2.2.2` → 99) |
| CORS lockdown: unknown origins get no CORS headers | `backend/src/index.ts` | `Origin: https://evil.example` → no `Access-Control-Allow-Origin`; `localhost:8080` still allowed |
| `GET /health` route (not rate limited) | `backend/src/index.ts` | `200 ok` |
| Netlify `/api/*` proxy to Render | `frontend/public/_redirects` | Present in `dist/_redirects` above the SPA fallback |
| Same-origin API URL in production builds | `frontend/src/lib/api.ts` | Production bundle uses `""` (relative `/api/...`); dev still uses `http://localhost:3000`; `VITE_API_URL` still overrides both |
| All 3 Prisma migrations in `backend/prisma/migrations` + `npm run migrate:deploy` script | `backend/prisma/migrations/`, `backend/package.json` | `prisma validate` passes; `tsc` and `vite build` pass |

**Still to do (dashboards and git):**
1. **Commit the untracked files** along with these changes (finding #1).
2. **Netlify:** **delete the `VITE_API_URL` env var.** If it stays set to the Render URL, the frontend keeps calling Render directly and the cookie stays third-party. Then redeploy.
3. **Render env:** `GOOGLE_REDIRECT_URI=https://www.learnopto.site/api/auth/google/callback`, `GITHUB_REDIRECT_URI=https://www.learnopto.site/api/auth/github/callback`, `FRONTEND_URL=https://www.learnopto.site`, `ALLOWED_ORIGINS=https://www.learnopto.site,https://learnopto.site`, `TRUST_PROXY_HOPS=2` (Netlify + Render; set this only after the proxy is live), and `AUTH_COOKIE_SAME_SITE=lax` (safe now that the cookie is first-party; this also blocks cross-site form CSRF).
4. **Google Cloud Console / GitHub OAuth app:** add the two new `www.learnopto.site/api/.../callback` URLs.
5. **Migrations:** run `npx prisma migrate status` against Neon. It couldn't connect from this machine (P1001), so production status is unknown. If the tables already exist but `_prisma_migrations` doesn't list them, mark each as applied with `npx prisma migrate resolve --applied <folder_name>` **before** using `npm run migrate:deploy`. I deliberately did **not** add migrate to the build command: on a database that isn't baselined it would fail every deploy.
6. The old `database/` folder (duplicate migrations, schema and `dev.db`) is still there; I didn't delete it. Remove it once you're happy that `backend/prisma/` is the single source.
7. DNS (finding #2) still needs fixing at GoDaddy.

---

## Evidence: what was tested

### Builds (clean `npm ci` + `npm run build`, Node 22)

| Build | Frontend | Backend |
|---|---|---|
| Current committed `HEAD` (`faef700`, same as `origin/main`) | ✅ passes | ✅ passes |
| Your working folder (all files, including untracked) | ✅ passes | ✅ passes (`tsc` exit 0) |
| **Committed + modified files only, without the untracked files** (what `git commit -a` or "commit all changes" in many GUIs would push) | ❌ **fails** | ❌ **fails** |

Frontend failure, because `package.json` now runs scripts that aren't in git:
```
"build": "vite build && node scripts/generate-sitemap.mjs && node scripts/prerender-seo.mjs"
Error: Cannot find module '.../frontend/scripts/generate-sitemap.mjs'  (MODULE_NOT_FOUND)
```

Backend failure, because the controllers import a file that isn't in git:
```
src/controllers/authController.ts(9,37):    error TS2307: Cannot find module '../services/emailService'
src/controllers/passkeyController.ts(13,37): error TS2307: Cannot find module '../services/emailService'
```

### Live checks

| Check | Result |
|---|---|
| `https://www.learnopto.site` | ✅ 200, valid certificate (covers apex + www) |
| `https://learnopto.site` (6 tries) | ❌ `000 000 301 301 301 301`. curl exit 35: `tlsv1 unrecognized name` |
| DNS `learnopto.site A` | `75.2.60.5` (Netlify ✅), `15.197.148.33` and `3.33.130.190` (GoDaddy forwarding ❌) |
| Deployed JS bundle API URL | `https://learnopto-2.onrender.com` ✅ (`VITE_API_URL` is set on Netlify) |
| `GET /api/auth/me` on Render (cold) | 401 after **22.7 s** (free-tier spin-up) |
| `GET /api/auth/google/login` | ✅ 302 to Google with `redirect_uri=https://learnopto-2.onrender.com/api/auth/google/callback` |
| CORS preflight with `Origin: https://evil.example` | ❌ `access-control-allow-origin: https://evil.example` + `allow-credentials: true` |
| `https://www.learnopto.site/og-image.png` | ❌ `content-type: text/html` (the file isn't deployed; `/* /index.html 200` serves the app instead) |
| Live `<title>` | `LearnOpto — AI Study Assistant` (old; the new SEO changes aren't live) |

---

## Detailed findings and fixes

### 1. Untracked files break the next deploy 🔴

`git status` shows these as **untracked** (`??`):
- `backend/src/services/` (`emailService.ts`)
- `frontend/scripts/` (`generate-sitemap.mjs`, `prerender-seo.mjs`)
- `frontend/public/og-image.png`

The **modified** tracked files reference them (`authController.ts`, `passkeyController.ts`, `frontend/package.json`, `index.html` `og:image`). Netlify and Render build only what's in GitHub.

**Fix:** commit everything together:
```bash
git add backend/src/services frontend/scripts frontend/public/og-image.png
```
```bash
git add -u && git commit -m "Add email alerts, SEO prerender and OG image"
```
Then push. Also confirm `nodemailer` is in `backend/package-lock.json` (it is locally) so `npm ci` on Render installs it.

### 2. Apex domain DNS points partly to GoDaddy 🔴

`learnopto.site` resolves to three IPs. `15.197.148.33` and `3.33.130.190` are GoDaddy's domain-forwarding/parking servers. They don't hold a certificate for your domain, so browsers that land on them show a TLS error. Only `75.2.60.5` is Netlify.

**Fix (at your DNS provider, likely GoDaddy):**
- Delete the A records `15.197.148.33` and `3.33.130.190`, and turn off GoDaddy "Forwarding" for the domain.
- Keep a single `A @ 75.2.60.5` (Netlify's load balancer), plus `CNAME www → learnopto.netlify.app` (already correct).
- Or move DNS to Netlify DNS (change nameservers), which handles the apex automatically.
- In Netlify → Domain management, pick one **primary** domain (currently `www`). Make sure the backend's `FRONTEND_URL` / `ALLOWED_ORIGINS` / `WEBAUTHN_EXPECTED_ORIGINS` include **both** `https://www.learnopto.site` and `https://learnopto.site`.

### 3. Cross-site auth cookie (login doesn't stick) 🔴

The session is an `httpOnly` cookie set by `learnopto-2.onrender.com` and read via `fetch(..., { credentials: "include" })` from `www.learnopto.site`. `onrender.com` is on the Public Suffix List, so this is a **third-party cookie**:
- Safari and iOS (all iPhone browsers) block it by default (ITP).
- Brave, Firefox strict mode, and Chrome Incognito block or partition it.
- It works at all only if Render has `NODE_ENV=production` (which makes the cookie `SameSite=None; Secure`). Otherwise it is `SameSite=Lax` and fails **everywhere**.

The user sees: Google/GitHub/password login appears to succeed, then `/api/auth/me` returns 401 and they're bounced back to `/login`.

**Fix (recommended): make the API same-site through a Netlify proxy.**
1. In `frontend/public/_redirects`, add a proxy rule **above** the SPA fallback:
   ```
   /api/*  https://learnopto-2.onrender.com/api/:splat  200
   /*      /index.html                                  200
   ```
2. Point the frontend at its own origin: in `frontend/src/lib/api.ts`, treat an empty `VITE_API_URL` as same-origin (`""`) instead of falling back to `http://localhost:3000`, and set `VITE_API_URL` to empty on Netlify. Keep `http://localhost:3000` for local dev via `.env.development`.
3. On Render set `GOOGLE_REDIRECT_URI=https://www.learnopto.site/api/auth/google/callback` and `GITHUB_REDIRECT_URI=https://www.learnopto.site/api/auth/github/callback`, and update the same URLs in the Google Cloud Console and GitHub OAuth app settings.
4. Cookies then become first-party (`SameSite=Lax` works), and CORS mostly stops mattering.

*Alternative:* give Render a custom domain `api.learnopto.site` (same site as the frontend) and set `AUTH_COOKIE_DOMAIN=.learnopto.site`.

### 4. CORS allows any origin with credentials 🔴 (security)

`backend/src/index.ts`:
```ts
if (appConfig.allowedOrigins.includes(cleaned)) {
  return callback(null, cleaned);
}
callback(null, cleaned);   // ← also allows every non-listed origin
```
Combined with a `SameSite=None` cookie, any website a logged-in user visits can call your API as that user (read their data, trigger searches, use up the Gemini quota).

**Fix:** reject unknown origins: `callback(null, false)` in the fallthrough branch. Then make sure `ALLOWED_ORIGINS` on Render contains `https://www.learnopto.site,https://learnopto.site`.

### 5. Missing `trust proxy` on Render 🟠

Render puts a load balancer in front of the app. Without `app.set("trust proxy", 1)`, `req.ip` is the proxy's address, so:
- `express-rate-limit` probably counts users together under Render's proxy IPs, so the **global 100 req / 15 min** and **login 10 / 15 min** limits can lock out everyone at once. It also logs `ERR_ERL_UNEXPECTED_X_FORWARDED_FOR`; check Render logs for this.
- The IP in login-alert emails is wrong.

**Fix:** add `app.set("trust proxy", 1);` right after `const app = express();`.

### 6. Render free-tier limits 🟠

- **Cold starts:** the service sleeps after about 15 min idle. The first request took **22.7 s** in this test. The frontend's `/api/auth/me` check runs on page load, so users see a long "loading/logged-out" state. Options: paid instance, or an uptime pinger hitting a health route. (There's no `/health` route yet; add `app.get("/health", (_, res) => res.send("ok"))`.)
- **SMTP:** Render's free web services block outbound SMTP ports (25/465/587), so `smtp.gmail.com:587` login alerts will likely time out silently (errors are caught). Use an HTTP email API (Resend, SendGrid, Brevo) or a paid instance.
- **In-memory stores:** OAuth `state` and passkey challenges live in `TemporaryStore` (memory). A restart or spin-down mid-login gives `InvalidState`. That's fine for one instance, but don't scale to more than one without moving them to the DB.

### 7. Database migrations are inconsistent 🟡

- `database/migrations/` has 3 migrations (initial `CREATE TABLE` → password hash → auth limits).
- `backend/prisma/migrations/` (the one the backend build uses) has **only the third** (`ALTER TABLE "User" ADD COLUMN …`).
- The Render build is `prisma generate && tsc`, with **no `prisma migrate deploy`**, so schema changes never reach Neon automatically. If the production DB is missing columns such as `dailySearchCount`, searches and logins fail with 500s.

**Fix:** copy all three migration folders into `backend/prisma/migrations/`. Run `npx prisma migrate status` against Neon (marking already-applied ones with `prisma migrate resolve --applied <name>` if needed). Then add a Render **Pre-Deploy Command** `npx prisma migrate deploy`. Also delete the stray `database/dev.db` (SQLite) from git; the project uses Postgres.

### 8. Other cleanup 🟡

- Root `package.json` pins `prisma`/`@prisma/client` **^7.8.0**, while the backend uses **5.22.0**. Delete the root `package.json`, `package-lock.json` and `node_modules`, or make sure Render's **Root Directory = `backend`** and Netlify's **Base directory = `frontend`**.
- No `render.yaml` and no Netlify `[build]` block are committed, so build settings live only in the dashboards. Add `frontend/netlify.toml`:
  ```toml
  [build]
    command = "npm run build"
    publish = "dist"
  [build.environment]
    NODE_VERSION = "22"
    SECRETS_SCAN_OMIT_KEYS = "VITE_API_URL"
  ```
- `frontend/scripts/*.mjs` hardcode `https://learnopto.site` (apex) for sitemap/canonical URLs, while Netlify serves `www` as primary. Pick one and use it everywhere (sitemap, `og:url`, `og:image`, `FRONTEND_URL`).
- Large media (`docs/*.mp4`, `.HEIC`) and `.DS_Store` files sit in the repo. They don't break deploys but slow clones.

---

## Render environment checklist (verify in the dashboard)

| Variable | Should be |
|---|---|
| `NODE_ENV` | `production` (otherwise cookies aren't `Secure`/`SameSite=None`) |
| `JWT_SECRET` | ≥ 32 characters (server refuses to start otherwise) |
| `DATABASE_URL` | Neon pooled URL |
| `FRONTEND_URL` | `https://www.learnopto.site` |
| `ALLOWED_ORIGINS` | `https://www.learnopto.site,https://learnopto.site` |
| `GOOGLE_REDIRECT_URI` / `GITHUB_REDIRECT_URI` | must match Google/GitHub consoles exactly (`https://`) |
| `RP_ID` / `WEBAUTHN_EXPECTED_ORIGINS` | `learnopto.site` / both origins (passkeys fail if this mismatches the domain users are on) |
| `GEMINI_API_KEY_*` | set (search fails without them) |
| Root Directory / Build / Start | `backend` / `npm ci && npm run build` / `npm start` |

> Note: your local `backend/.env` has `FRONTEND_URL=http://localhost:8080` and a localhost `GITHUB_REDIRECT_URI`. That's correct for local dev, but don't copy it into Render.

---

## Recommended order of fixes

1. **Commit the untracked files** with the modified ones (prevents broken builds).
2. **Fix the apex DNS** (remove the GoDaddy A records).
3. **Add `trust proxy` and lock down CORS** (2-line backend change).
4. **Proxy `/api/*` through Netlify** and switch OAuth callbacks to `www.learnopto.site` (fixes Safari/iPhone logins).
5. **Consolidate Prisma migrations** and add `prisma migrate deploy` as a pre-deploy step.
6. Swap SMTP for an HTTP email API; add `/health` and consider avoiding cold starts.
