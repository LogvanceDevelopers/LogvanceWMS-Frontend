# Portal ve URL Tanımları – Nerede Ne Var?

Bu dosya, LogvanceWMS frontend ve API URL’lerinin **nerede tanımlandığını** tek yerde toplar.

---

## 1. API URL (Frontend’in istek attığı backend adresi)

### React frontend (`frontend/`)

| Konum | Açıklama |
|--------|----------|
| **`frontend/.env.development`** | Lokal geliştirme: `VITE_API_URL=https://api-dev.logvancewms.com/api` |
| **`frontend/.env.production`** | Production build: `VITE_API_URL=https://logvancewms-core-api.azurewebsites.net/api` |
| **`frontend/.env.development.local`** | Lokal override (boş = proxy kullan, `https://localhost:5001` gider) |
| **`frontend/.env.example`** | Örnek: `VITE_API_URL=https://logvancewms-api-dev.azurewebsites.net/api` |
| **`frontend/src/api/client.ts`** | Okuma: `import.meta.env.VITE_API_URL` → tüm API istekleri bu base URL’e gider |
| **`frontend/src/api/index.ts`** | Alternatif API client: yine `VITE_API_URL` kullanır |
| **`frontend/Dockerfile`** | Build arg: `ARG VITE_API_URL=https://logvancewms-core-api.azurewebsites.net/api` |

### Pipeline (build sırasında enjekte edilen API URL)

| Konum | Değişken | Değer |
|--------|----------|--------|
| **`azure-pipelines.yml`** (satır 33–34) | `apiUrlDev` | `https://logvancewms-api-dev.azurewebsites.net/api` |
| **`azure-pipelines.yml`** (satır 33–34) | `apiUrlProd` | `https://logvancewms-core-api.azurewebsites.net/api` |
| **`azure-pipelines.yml`** (satır 70–74) | DEV build | `VITE_API_URL: $(apiUrlDev)` |
| **`azure-pipelines.yml`** (satır 81–84) | PROD build | `VITE_API_URL: $(apiUrlProd)` |

**Özet:** Portal (React) hangi ortama build edilirse, o ortamın API URL’i **pipeline’daki `apiUrlDev` / `apiUrlProd`** ve **.env.*** dosyalarıyla belirlenir; kullanılan yer **`frontend/src/api/client.ts`** (ve isteğe bağlı `index.ts`).

---

## 2. Admin panel URL (Login sayfasındaki “Admin Paneli” linki)

| Konum | Açıklama |
|--------|----------|
| **`frontend/src/pages/Login.tsx`** | `import.meta.env.VITE_ADMIN_APP_URL` → boşsa `/admin` kullanılır |
| **Ortam değişkeni** | Build veya ortamda `VITE_ADMIN_APP_URL` tanımlanabilir (örn. `https://admin-dev.logvancewms.com`) |

Admin’in **kendi API URL’i** (ayrı proje):

| Konum | Açıklama |
|--------|----------|
| **`frontend-admin/src/environments/environment.ts`** | DEV: `apiUrl: 'https://api-dev.logvancewms.com/api'` |
| **`frontend-admin/src/environments/environment.prod.ts`** | PROD: `apiUrl: 'https://logvancewms-core-api.azurewebsites.net/api'` |

---

## 3. Portal (Frontend) deploy URL’leri – nereden geliyor?

Portalın **açıldığı adres** (tarayıcıda gördüğünüz URL) kodda tek bir yerde “portal URL” diye tanımlı değildir; Azure Static Web App’e deploy edildiği için URL, **Azure’daki kaynağın adına** göre oluşur.

| Ortam | Nerede tanımlı | Örnek URL |
|--------|-----------------|-----------|
| **DEV** | Azure Static Web App (Frontend-Development) + Azure Portal / Pipeline env | `https://logvancewms-frontend-dev.azurestaticapps.net` veya `https://dev.logvancewms.com` (custom domain) |
| **PROD** | Azure Static Web App (Frontend-Production) + Azure Portal | `https://www.logvancewms.com` (custom domain) |
| **Admin DEV** | Azure Static Web App (Admin-Development) | `https://logvancewms-admin-dev.azurestaticapps.net` veya `https://admin-dev.logvancewms.com` |
| **Admin PROD** | Azure Static Web App (Admin-Production) | `https://admin.logvancewms.com` |

Pipeline tarafı:

| Konum | Açıklama |
|--------|----------|
| **`azure-pipelines.yml`** | `AzureStaticWebApp@0` + `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` / `_ADMIN_DEV` vb. → Hangi Static Web App’e deploy edileceği **Azure DevOps Library (variable group: SWA-Tokens)** ve ilgili Azure Static Web App kaynağına bağlı. |
| **Azure Portal** | Static Web App → Overview → **URL** = portalın gerçek adresi. Custom domain varsa Configuration → Custom domains’te tanımlı. |

Yani: **Portal URL’i “kodda bir yerde tanımlı” değil; Azure’da oluşturduğunuz Static Web App’in URL’i (ve varsa custom domain) portal adresidir. Pipeline sadece bu kaynağa deploy eder.

---

## 4. Backend (API) CORS – hangi portal/origin’lere izin var?

| Konum | Açıklama |
|--------|----------|
| **LogvanceWms3.0 backend** `Program.cs` | CORS varsayılan listesi: `logvancewms-dev.azurewebsites.net`, `dev.logvancewms.com`, `www.logvancewms.com`, `logvancewms.com`, `localhost:5173`, vb. |
| **`appsettings.Production.json`** | `Cors:AllowedOrigins` dizisi (production’da kullanılan origin’ler) |
| **`appsettings.Development.json`** | `Cors:AllowedOrigins` string (virgülle ayrılmış) |

Portal farklı bir domain’de açılıyorsa (örn. yeni bir Static Web App URL’i), o origin’in **backend’in CORS listesine** eklenmesi gerekir; yoksa tarayıcı API isteklerini bloklar.

---

## 5. Kısa özet

- **Portal nerede açılıyor?** → Azure Static Web App URL’i (Azure Portal’da kaynağın URL’i; custom domain varsa o). Kodda “portal URL” tek satırda tanımlı değil.
- **API URL nerede tanımlı?** → `azure-pipelines.yml` (apiUrlDev / apiUrlProd), `frontend/.env.*` ve `frontend/src/api/client.ts` (VITE_API_URL).
- **Admin panel URL (link)?** → `frontend/src/pages/Login.tsx` içinde `VITE_ADMIN_APP_URL`; yoksa `/admin`.
- **Portal URL’ini değiştirmek** → Azure’da ilgili Static Web App’in adını/custom domain’ini değiştirir veya yeni bir Static Web App kullanırsınız; pipeline’daki token’ın doğru kaynağa ait olduğundan emin olursunuz.

---

## 6. Canlı API’ye (logvancewms-core-api) ulaşamıyorsanız

**Güncel adresler:** DEV = `https://logvancewms-api-dev.azurewebsites.net/api`, CANLI = `https://logvancewms-core-api.azurewebsites.net/api`.

- **Frontend tarafı:** Yukarıdaki tüm prod ayarları `logvancewms-core-api.azurewebsites.net` kullanacak şekilde güncellendi. Canlı build’den sonra tarayıcı bu adrese istek atmalı.
- **CORS:** Canlı frontend’in açıldığı origin (örn. `https://www.logvancewms.com` veya Static Web App URL’i), **canlı API’nin** (`logvancewms-core-api`) CORS listesinde olmalı. Backend’de `Cors:AllowedOrigins` / `Program.cs` içinde bu origin’i ekleyin.
- **Path:** İstekler `https://logvancewms-core-api.azurewebsites.net/api/...` şeklinde (sonunda `/api`) gidiyor; backend’in route’ları `/api` prefix’i ile eşleşiyor mu kontrol edin.
- **Test:** Tarayıcıda veya `curl` ile doğrudan test:  
  `curl -I https://logvancewms-core-api.azurewebsites.net/api/health` (veya backend’in bir GET endpoint’i). 401/403 CORS veya auth’dan, 404 route’tan, 5xx sunucu hatasından kaynaklanabilir.
