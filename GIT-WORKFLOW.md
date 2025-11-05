# 🚀 Git Rebase Workflow

This document explains our full development-to-production workflow using:

- **Rebase strategy**
- **Semantic Versioning**
- **Conventional Commits**
- **Automated Changelog**
- **Release pipeline (`develop → demo → live`)**
- **MR only required for feat → develop**

---

## 🧠 Branch Philosophy

| Branch     | Purpose                   | MR Required        |
| ---------- | ------------------------- | ------------------ |
| `develop`  | Main development branch   | ✅ Yes (from feat) |
| `demo`     | Staging / UAT environment | ❌ No              |
| `live`     | Production                | ❌ No              |
| `feat/*`   | Feature work              | ✅ Yes → develop   |
| `hotfix/*` | Prod emergency fix        | ✅ Yes → live      |

Flow:

```
[feat/fix]/* (source branch from develop)  →  develop  →  demo  →  live
```

> ⚠️ **No MR is needed for develop → demo → live**
> Deployment duties handled by maintainer/release engineer.

---

## ✅ Commit Format: Conventional Commits

Examples:

```
feat: add treaty auto layer calculation
fix: correct capacity sort bug
refactor: optimize claim recalculation function
chore: update dependencies
docs: add git workflow docs
```

---

## 🔢 Versioning (SemVer)

Format:

```
MAJOR.MINOR.PATCH
```

Rules:

| Situation                       | Bump  |
| ------------------------------- | ----- |
| New feat                        | MINOR |
| Internal fixes                  | PATCH |
| Breaking changes / big refactor | MAJOR |

Example flow:

| Branch  | Version  |
| ------- | -------- |
| develop | (no tag) |
| demo    | `v1.4.0` |
| live    | `v1.4.0` |

---

## 📜 Automated Changelog

Generated from commit messages.

Example entry:

```
## [1.4.0] - 2025-11-05

### Added
- Auto treaty layering with WPC and OR handling

### Fixed
-  Capacity not correct
```

---

## 🛠 Tooling

We use:

- `standard-version`
- `husky + commitlint`
- `conventional-changelog`

Install example:

```bash
pnpm add -D standard-version @commitlint/{config-conventional,cli} husky
```

---

## ✅ Full Workflow Steps

### 1️⃣ Create Feature Branch

```bash
git checkout develop
git pull
git checkout -b feat/treaty-auto-layering
```

Develop, then commit using conventional commits:

```bash
git add .
git commit -m "feat: add treaty auto layer calculation"
```

Rebase to sync with latest develop:

```bash
git fetch
git rebase origin/develop
```

Push branch & create MR:

```bash
git push -u origin feat/treaty-auto-layering
```

✅ **MR required only here**

---

### 2️⃣ After MR Approved → Merge to develop

- Use **Rebase & Merge**
- No merge commits allowed

Update local:

```bash
git checkout develop
git pull
```

---

### 3️⃣ Prepare Release Version

On `develop`

```bash
pnpm release:minor
git push --follow-tags
```

This will:

✔ Bump version in package.json (if FE) or tag repo (if BE)
✔ Generate changelog
✔ Create git tag

---

### 4️⃣ Promote to DEMO

```bash
git checkout demo
git pull
git rebase origin/develop
git push origin demo
```

Demo/UAT testing happens here ✅

---

### 5️⃣ Promote to LIVE (Production)

After approval:

```bash
git checkout live
git pull
git rebase origin/demo
git push origin live
```

🎉 Production deployed

---

## 🧯 Hotfix Flow (Production Issue)

```bash
git checkout live
git pull
git checkout -b hotfix/fix-login-token
```

Fix → commit → MR → merge to live → rebase down:

```bash
git checkout demo && git pull && git rebase origin/live && git push
git checkout develop && git pull && git rebase origin/demo && git push
```

---

## 📊 Illustration Diagram

```
(feat A) ----\
(feat B) -----\         /--> demo --> live
                  ---> develop
(feat C) ----/

hotfix --> live -> demo -> develop
```

---

## 🎁 Best Practices

- Always rebase before push
- Never merge develop → feat using merge commits
- Only release engineer promotes to demo/live

---

## 🏁 Final Notes

This workflow ensures:

- Clean git history
- Automated release notes
- Fast deployment flow
- Minimal MR noise
- Enterprise-grade control

---
