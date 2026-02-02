# 🚀 LogvanceWMS Frontend - Hızlı Başlangıç

## ⚡ 5 Dakikada Başla

### 1️⃣ Frontend Çalıştırma (React)

```bash
cd frontend
npm install
npm run dev
```

✅ Tarayıcıda açılır: `http://localhost:5173`

### 2️⃣ Admin Panel Çalıştırma (Angular)

```bash
cd frontend-admin
npm install
npm start
```

✅ Tarayıcıda açılır: `http://localhost:4200`

---

## 🔧 Geliştirme Öncesi Hazırlık

### Frontend Environment Variables

```bash
cd frontend

# .env.development dosyası zaten mevcut
# Eğer yoksa:
cp .env.example .env.development

# API URL'ini kontrol edin:
cat .env.development
```

### Admin Environment Variables

Angular admin panel `src/environments/` klasöründeki dosyaları kullanır:
- ✅ `environment.ts` (DEV)
- ✅ `environment.prod.ts` (PROD)

Değişiklik gerekmez, hazır durumda.

---

## 📦 Build Yapma

### Frontend Build

```bash
cd frontend

# Development build
npm run build

# Production build
npm run build:production

# Staging build
npm run build:staging
```

Build output: `frontend/dist/`

### Admin Build

```bash
cd frontend-admin

# Development build
npm run build

# Production build
npm run build -- --configuration=production
```

Build output: `frontend-admin/dist/`

---

## 🧪 Test & Lint

### Frontend

```bash
cd frontend

# Lint
npm run lint

# Type check
npm run type-check  # veya: npx tsc --noEmit
```

### Admin

```bash
cd frontend-admin

# Lint
npm run ng lint

# Tests
npm run test
```

---

## 🌐 API Bağlantısı

### Frontend API URL'leri

DEV:
```
https://logvancewms-api-dev.azurewebsites.net/api
```

PROD:
```
https://logvancewms-api.azurewebsites.net/api
```

### API Test

```bash
# Health check
curl https://logvancewms-api-dev.azurewebsites.net/api/health

# Login test (örnek)
curl -X POST https://logvancewms-api-dev.azurewebsites.net/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'
```

---

## 🔥 Sık Kullanılan Komutlar

### Frontend

```bash
cd frontend

# Dev server
npm run dev

# Build
npm run build:production

# Lint
npm run lint

# Clean & reinstall
rm -rf node_modules package-lock.json && npm install
```

### Admin

```bash
cd frontend-admin

# Dev server
npm start

# Build
npm run build -- --configuration=production

# Lint
npm run ng lint

# Clean & reinstall
rm -rf node_modules package-lock.json && npm install
```

---

## 🐛 Yaygın Problemler

### Problem 1: Port zaten kullanımda

**Frontend (5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

**Admin (4200):**
```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:4200 | xargs kill -9
```

### Problem 2: Module not found

```bash
cd frontend  # veya frontend-admin
rm -rf node_modules package-lock.json
npm install
```

### Problem 3: TypeScript hataları

```bash
cd frontend

# Type check
npm run type-check

# Auto-fix (bazı hatalar)
npm run lint -- --fix
```

### Problem 4: Build hatası

```bash
# Cache temizle
rm -rf node_modules/.vite
rm -rf dist

# Tekrar build
npm run build
```

---

## 📋 Proje Yapısı

```
LogvanceWMS-Frontend/
├── frontend/              # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── .env.development
│   ├── .env.production
│   └── package.json
│
├── frontend-admin/        # Angular
│   ├── src/
│   │   ├── app/
│   │   └── environments/
│   ├── angular.json
│   └── package.json
│
├── azure-pipelines.yml    # CI/CD
└── README.md
```

---

## 🚀 CI/CD Pipeline

Pipeline otomatik çalışır:

**DEV Deploy:**
```bash
git checkout develop
git pull
git add .
git commit -m "feat: yeni özellik"
git push origin develop
```
→ Otomatik DEV'e deploy edilir

**PROD Deploy:**
```bash
git checkout main
git merge develop
git push origin main
```
→ Otomatik PROD'a deploy edilir

Pipeline detayları: [PIPELINE-SETUP-GUIDE.md](./PIPELINE-SETUP-GUIDE.md)

---

## 📚 Daha Fazla Bilgi

- [README.md](./README.md) - Genel bilgiler
- [PIPELINE-SETUP-GUIDE.md](./PIPELINE-SETUP-GUIDE.md) - Pipeline kurulum
- Frontend README (frontend/README.md)
- Admin README (frontend-admin/README.md)

---

## ✅ Checklist

Geliştirmeye başlamadan önce:

- [ ] Node.js 20.x kurulu
- [ ] npm güncel (`npm install -g npm@latest`)
- [ ] Frontend dependencies kurulu (`cd frontend && npm install`)
- [ ] Admin dependencies kurulu (`cd frontend-admin && npm install`)
- [ ] `.env.development` dosyası var
- [ ] API'ye erişilebiliyor
- [ ] Dev server çalışıyor

Hepsi tamam mı? O zaman başlayabilirsiniz! 🎉

---

## 💡 İpuçları

1. **Hot Reload:** Kod değişiklikleriniz otomatik tarayıcıya yansır
2. **Console:** Tarayıcı console'u açık tutun (F12)
3. **API Calls:** Network tab'den API call'ları izleyin
4. **Error Handling:** Hataları yakalamanız için try-catch kullanın
5. **Git:** Sık sık commit yapın, küçük parçalarda ilerleyin

---

**Başarılar! 🚀**
