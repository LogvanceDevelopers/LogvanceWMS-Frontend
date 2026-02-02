# LogvanceWMS Frontend Repository

Bu repository **LogvanceWMS** projesinin frontend uygulamalarını içerir:
- **frontend/** - React + Vite + TypeScript (Ana kullanıcı arayüzü)
- **frontend-admin/** - Angular (Admin panel)

## 🚀 Hızlı Başlangıç

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde açılacak.

### Admin Panel (Angular)

```bash
cd frontend-admin
npm install
npm start
```

Uygulama `http://localhost:4200` adresinde açılacak.

## 📦 Build

### Frontend

```bash
cd frontend
npm run build              # Development build
npm run build:staging      # Staging build
npm run build:production   # Production build
```

### Admin Panel

```bash
cd frontend-admin
npm run build                              # Development build
npm run build -- --configuration=production # Production build
```

## 🔧 Environment Variables

### Frontend (.env dosyaları)

`.env.development` ve `.env.production` dosyaları oluşturun:

```env
VITE_API_URL=https://logvancewms-api-dev.azurewebsites.net/api
VITE_ENVIRONMENT=development
```

### Admin Panel

`frontend-admin/src/environments/` klasöründe:
- `environment.ts` - Development
- `environment.prod.ts` - Production

## 🚀 CI/CD Pipeline

Bu repository Azure DevOps pipeline'ı ile otomatik deploy edilir:
- **develop/dev branch** → DEV ortamına otomatik deploy
- **main/master branch** → PROD ortamına otomatik deploy

Pipeline dosyası: `azure-pipelines.yml`

Detaylı bilgi için: [PIPELINE-SETUP-GUIDE.md](./PIPELINE-SETUP-GUIDE.md)

## 📁 Proje Yapısı

```
LogvanceWMS-Frontend/
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── .env.development
│   ├── .env.production
│   ├── package.json
│   └── vite.config.ts
├── frontend-admin/              # Angular admin panel
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   │   └── main.ts
│   ├── angular.json
│   └── package.json
├── azure-pipelines.yml          # CI/CD pipeline
├── PIPELINE-SETUP-GUIDE.md      # Pipeline kurulum rehberi
└── README.md
```

## 🛠️ Teknolojiler

### Frontend
- React 18
- TypeScript
- Vite
- Ant Design
- React Router
- Axios
- React Query

### Admin Panel
- Angular 19
- TypeScript
- Angular Material
- RxJS

## 📝 Development Workflow

### Yeni Feature Geliştirme

1. Feature branch oluşturun:
```bash
git checkout develop
git pull origin develop
git checkout -b feature/yeni-ozellik
```

2. Değişikliklerinizi yapın ve test edin

3. Commit ve push:
```bash
git add .
git commit -m "feat: yeni özellik eklendi"
git push origin feature/yeni-ozellik
```

4. Pull Request oluşturun: `feature/yeni-ozellik` → `develop`

5. Code review sonrası merge edilir

6. DEV'de test edin

7. PROD'a almak için: `develop` → `main` PR oluşturun

### Branch Stratejisi

- `main` - Production ortamı (PROD)
- `develop` - Development ortamı (DEV)
- `feature/*` - Yeni özellikler
- `fix/*` - Bug fix'ler
- `hotfix/*` - Production hotfix'ler

## 🌐 Deployment URL'leri

### DEV
- Frontend: https://logvancewms-frontend-dev.azurestaticapps.net
- Admin: https://logvancewms-admin-dev.azurestaticapps.net

### PROD
- Frontend: https://www.logvancewms.com (veya custom domain)
- Admin: https://admin.logvancewms.com (veya custom domain)

## 🐛 Troubleshooting

### "Module not found" hatası
```bash
cd frontend  # veya frontend-admin
rm -rf node_modules package-lock.json
npm install
```

### Port zaten kullanımda
```bash
# Frontend için (5173)
lsof -ti:5173 | xargs kill -9

# Admin için (4200)
lsof -ti:4200 | xargs kill -9
```

### Build hatası
```bash
npm run lint  # Lint hatalarını kontrol edin
npm run type-check  # TypeScript hatalarını kontrol edin
```

## 📚 Dokümantasyon

- [Pipeline Setup Guide](./PIPELINE-SETUP-GUIDE.md) - CI/CD pipeline kurulumu
- [Frontend README](./frontend/README.md) - React frontend detayları
- [Admin README](./frontend-admin/README.md) - Angular admin detayları

## 🤝 Contributing

1. Repo'yu fork edin
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Branch'inizi push edin
5. Pull Request oluşturun

## 📄 License

Bu proje LogvanceWMS şirketi için özel geliştirilmiştir.

## 📞 İletişim

Sorularınız için proje ekibiyle iletişime geçin.
