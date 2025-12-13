# Dynamic Badge Setup Guide

Badges di README akan otomatis update setiap kali CI berjalan di branch `main`.

---

## Part 1: GitHub Actions Badges

### 1. Buat GitHub Gist

1. Pergi ke https://gist.github.com
2. Buat gist baru dengan nama file `test-badge.json`
3. Isi dengan placeholder: `{}`
4. Klik "Create secret gist" atau "Create public gist"
5. Copy **Gist ID** dari URL (bagian setelah username, contoh: `abc123def456`)

### 2. Buat Personal Access Token

1. Pergi ke https://github.com/settings/tokens
2. Klik "Generate new token (classic)"
3. Beri nama: `GIST_TOKEN`
4. Pilih scope: `gist`
5. Generate dan copy token

### 3. Setup Repository Secrets & Variables

Di repository GitHub:

1. Pergi ke **Settings** → **Secrets and variables** → **Actions**

2. Tambah **Secret**:
   - Name: `GIST_TOKEN`
   - Value: Token dari step 2

3. Tambah **Variable**:
   - Name: `BADGE_GIST_ID`
   - Value: Gist ID dari step 1

### 4. Update README

Ganti placeholder di README.md dan README.id.md:

```
YOUR_GITHUB_USERNAME → username GitHub kamu
YOUR_GIST_ID → Gist ID dari step 1
```

Contoh:

```html
<img
  src="https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/keitazundi/abc123def456/raw/test-badge.json"
/>
```

### 5. Trigger CI

Push ke branch `main` untuk trigger workflow pertama kali.

## Troubleshooting

- **Badge tidak update**: Pastikan `GIST_TOKEN` punya scope `gist`
- **404 pada badge**: Pastikan gist sudah dibuat dan ID benar
- **CI gagal**: Cek logs di tab Actions

## Badge Types

| Badge      | File                    | Description                     |
| ---------- | ----------------------- | ------------------------------- |
| ESLint     | `eslint-badge.json`     | Status ESLint (passing/failing) |
| Tests      | `test-badge.json`       | Jumlah test yang passing        |
| TypeScript | `typescript-badge.json` | TypeScript strict mode status   |

---

## Part 2: SonarCloud Integration

### 1. Setup SonarCloud

1. Pergi ke https://sonarcloud.io
2. Login dengan GitHub
3. Klik **"+"** → **"Analyze new project"**
4. Pilih repository `react-base-project`
5. Pilih **"With GitHub Actions"** sebagai analysis method
6. Copy **Project Key** dan **Organization**

### 2. Tambah Secrets & Variables di GitHub

Di repository GitHub → **Settings** → **Secrets and variables** → **Actions**:

**Secrets:**

- `SONAR_TOKEN`: Token dari SonarCloud (Settings → Security → Generate Token)

**Variables:**

- `SONAR_PROJECT_KEY`: Project key dari SonarCloud (contoh: `roketin_react-base-project`)
- `SONAR_ORGANIZATION`: Organization name (contoh: `roketin`)

### 3. Update README

Ganti placeholder di README.md dan README.id.md:

```
YOUR_SONAR_PROJECT → Project key dari SonarCloud
```

Contoh:

```html
<img
  src="https://sonarcloud.io/api/project_badges/measure?project=roketin_react-base-project&metric=alert_status"
/>
```

### 4. SonarCloud Badges

| Badge        | Metric         | Description                 |
| ------------ | -------------- | --------------------------- |
| Quality Gate | `alert_status` | Overall quality gate status |
| Coverage     | `coverage`     | Test coverage percentage    |
| Bugs         | `bugs`         | Number of bugs detected     |
| Code Smells  | `code_smells`  | Code smell count            |

### Optional: sonar-project.properties

Jika ingin konfigurasi lebih detail, buat file `sonar-project.properties` di root:

```properties
sonar.projectKey=roketin_react-base-project
sonar.organization=roketin
sonar.sources=src
sonar.tests=tests,src
sonar.test.inclusions=**/*.test.ts,**/*.test.tsx,**/__tests__/**
sonar.exclusions=**/node_modules/**,**/dist/**,**/*.stories.tsx
sonar.javascript.lcov.reportPaths=coverage/lcov.info
```

---

## Complete Checklist

- [ ] Buat GitHub Gist
- [ ] Buat Personal Access Token (scope: gist)
- [ ] Tambah secret `GIST_TOKEN`
- [ ] Tambah variable `BADGE_GIST_ID`
- [ ] Setup SonarCloud project
- [ ] Tambah secret `SONAR_TOKEN`
- [ ] Tambah variable `SONAR_PROJECT_KEY`
- [ ] Tambah variable `SONAR_ORGANIZATION`
- [ ] Update placeholder di README.md
- [ ] Update placeholder di README.id.md
- [ ] Push ke main untuk trigger CI
