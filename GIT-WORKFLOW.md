# 🚀 Git Workflow — Rebase Strategy (Dev → Demo → Live)

## 📌 **Main Branches**

| Branch | Role                        |
| ------ | --------------------------- |
| `dev`  | Active development branch   |
| `demo` | Staging / UAT / Client demo |
| `live` | Production                  |

### 📎 **Flow**

```
feat/* → dev → demo → live
```

---

## ✅ **Branch Naming Convention**

```
feat/login-page
fix/payment-timezone
hotfix/live-signin-bug
chore/update-dependencies
```

---

## 🧠 **Rules**

- All work starts from `dev`
- All features go via MR (rebase merge)
- **No direct commits** to `dev`, `demo`, `live`
- Keep commit history linear (no unnecessary merge commits)

---

## 🛠️ **Feature Development Flow**

### 1. Create branch

```bash
git checkout dev
git pull
git checkout -b feat/xyz
```

### 2. Commit while coding

```bash
git add .
git commit -m "feat: add xyz"
```

### 3. Sync with dev (routinely)

```bash
git fetch
git rebase origin/dev
```

### 4. Push & create MR

```bash
git push -u origin feat/xyz
```

---

## ✳️ **If MR Already Created and You Need to Update**

### ➕ Add small fix commits

> **Do NOT create new MR**

```bash
git add .
git commit -m "fix: review changes"
git push
```

### 🔁 If you've rebased before

```bash
git push --force-with-lease
```

> ⚠️ Always use `--force-with-lease`, never `--force`

---

## 🚀 **Promote Dev → Demo**

```bash
git checkout demo
git pull
git rebase origin/dev
git push origin demo
```

---

## 🚀 **Promote Demo → Live**

```bash
git checkout live
git pull
git rebase origin/demo
git push origin live
```

---

## 🩹 **Hotfix Flow (Production)**

### Fix from live

```bash
git checkout live
git pull
git checkout -b hotfix/urgent-issue
```

Fix → commit → push → MR → merge to live

### Sync back

```bash
git checkout demo
git pull
git rebase origin/live
git push

git checkout dev
git pull
git rebase origin/demo
git push
```

---

## ⚠️ **Anti‑Patterns**

| Avoid                                   | Reason                     |
| --------------------------------------- | -------------------------- |
| Direct commit to dev/demo/live          | Breaks review process      |
| MR per revision                         | Clutters workflow          |
| Using `--force`                         | Can delete others' commits |
| Merging dev into feat with merge commit | Messy history              |

---

## 🎯 **Best Practice Cheatsheet**

| Action             | Command                       |
| ------------------ | ----------------------------- |
| Sync dev           | `git pull --rebase`           |
| Add revision to MR | `git push`                    |
| Rebase with dev    | `git rebase origin/dev`       |
| Push after rebase  | `git push --force-with-lease` |
| Squash commits     | `git rebase -i origin/dev`    |

---

## 📊 **Workflow Diagram**

```
(feat A) ----\
(feat B) -----\         /--> demo --> live
                  ---> dev
(feat C) ----/        \
                          hotfix --> live -> demo -> dev
```

---

## 💡 **Commit Message Style**

```
feat: add login form
fix: correct timezone handling
refactor: optimize reducer
chore: update dependencies
docs: update rebase workflow
```

---

## 🏁 Notes

- Always rebase, never merge (unless emergency)
- MR is the only entry to main branches
- Hotfix must propagate back down (`live → demo → dev`)
