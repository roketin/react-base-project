# 🚀 Git Workflow (Developer Guide)

This guide explains the workflow for **developers only**.
Deployment to `demo` and `live` environments is handled by **maintainers/release engineers**.

As a developer, your responsibility ends at **develop branch** ✅

---

## 🧠 Branch Policy (Developer Scope Only)

| Branch     | Purpose              | MR Required   |
| ---------- | -------------------- | ------------- |
| `develop`  | main development     | ✅ Yes        |
| `feat/*`   | feature branches     | ✅ to develop |
| `fix/*`    | bugfix branches      | ✅ to develop |
| `hotfix/*` | emergency fix (rare) | ✅ to develop |

> **❌ You do NOT merge or push to `demo` or `live`**
> Maintainers handle releases and production

---

## ✅ Commit Format (Conventional Commits)

Use conventional commit style:

```
feat: add new module for XYZ
fix: correct query for capacity limit
refactor: optimize table rendering logic
chore: update dependencies
docs: update git workflow docs
```

---

## 🔧 Feature Development Flow

### 1️⃣ Start from `develop`

```bash
git checkout develop
git pull
```

### 2️⃣ Create your feature branch

```bash
git checkout -b feat/feature-name
```

### 3️⃣ Write code & commit frequently

```bash
git add .
git commit -m "feat: implement XYZ logic"
```

### 4️⃣ Sync with latest develop before pushing

```bash
git fetch
git rebase origin/develop
```

### 5️⃣ Push & open Merge Request

```bash
git push -u origin feat/feature-name
```

Then create **MR → develop**.

---

## 🧪 After MR Approved

Merge using **Rebase & Merge** (or maintainer will do it):

```bash
git checkout develop
git pull
```

Delete local branch if done:

```bash
git branch -d feat/feature-name
```

---

## 🆘 Reverting / Fixing Issues

If your change needs to be reverted:

1. Create revert branch

```bash
git checkout develop
git pull
git checkout -b revert/feature-name
git revert <commit-id>
git push -u origin revert/feature-name
```

2. MR → develop

---

## 🧼 Rules

- ✅ Always rebase before push
- ✅ Use MR for all changes to develop
- ✅ Small commits > huge commits
- ❌ Never push to `demo` or `live`
- ❌ Never merge develop into your branch using merge commits

---

## 🏁 Summary

| Task                 | Who                |
| -------------------- | ------------------ |
| Develop features     | ✅ You             |
| Merge to develop     | ✅ You (via MR)    |
| Promote to demo/live | ❌ Maintainer only |

---

## 💬 Questions?

Ask release engineer if unsure about release steps.
Your job: **get clean code into `develop`** ✅
Maintainer job: **release to demo & live** 🚀
