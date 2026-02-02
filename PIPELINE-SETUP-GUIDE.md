# 🚀 LogvanceWMS Frontend Pipeline Setup Rehberi

## 📋 Özet

Bu pipeline **tek bir YAML dosyasıyla** hem React frontend hem Angular admin panel'i otomatik deploy eder.

**Pipeline Özellikleri:**
- ✅ **React Frontend** (Vite) - Build & Deploy
- ✅ **Angular Admin** - Build & Deploy
- ✅ DEV ortamına otomatik deploy (`dev`/`develop` branch)
- ✅ PROD ortamına otomatik deploy (`main`/`master` branch)
- ✅ Azure Static Web Apps ile CDN, SSL, global distribution

---

## 🎯 Adım 1: Azure Static Web Apps Oluşturma

### Frontend için 4 adet Static Web App oluşturun:

```bash
# 1. Frontend DEV
az staticwebapp create \
  --name logvancewms-frontend-dev \
  --resource-group RG-Logvance-SwedenCentral \
  --sku Free \
  --location westeurope

# 2. Frontend PROD
az staticwebapp create \
  --name logvancewms-frontend-prod \
  --resource-group RG-Logvance-SwedenCentral \
  --sku Standard \
  --location westeurope

# 3. Admin DEV
az staticwebapp create \
  --name logvancewms-admin-dev \
  --resource-group RG-Logvance-SwedenCentral \
  --sku Free \
  --location westeurope

# 4. Admin PROD
az staticwebapp create \
  --name logvancewms-admin-prod \
  --resource-group RG-Logvance-SwedenCentral \
  --sku Standard \
  --location westeurope
```

### Azure Portal ile:
1. **Azure Portal** → **Create a resource** → **Static Web App**
2. Yukarıdaki 4 Static Web App'i oluşturun
3. **Source:** **Other** seçin (manuel deploy)

---

## 🔑 Adım 2: Deployment Token'larını Alma

Her bir Static Web App için token alın:

```bash
# Frontend DEV token
az staticwebapp secrets list \
  --name logvancewms-frontend-dev \
  --resource-group RG-Logvance-SwedenCentral \
  --query "properties.apiKey" -o tsv

# Frontend PROD token
az staticwebapp secrets list \
  --name logvancewms-frontend-prod \
  --resource-group RG-Logvance-SwedenCentral \
  --query "properties.apiKey" -o tsv

# Admin DEV token
az staticwebapp secrets list \
  --name logvancewms-admin-dev \
  --resource-group RG-Logvance-SwedenCentral \
  --query "properties.apiKey" -o tsv

# Admin PROD token
az staticwebapp secrets list \
  --name logvancewms-admin-prod \
  --resource-group RG-Logvance-SwedenCentral \
  --query "properties.apiKey" -o tsv
```

### Azure Portal'dan Token Alma:
1. Static Web App açın
2. **Settings** → **Deployment tokens**
3. Token'ı kopyalayın
4. Her 4 Static Web App için tekrarlayın

---

## ⚙️ Adım 3: Azure DevOps Variable Group Oluşturma

1. **Azure DevOps** → Projenizi açın
2. **Pipelines** → **Library** → **+ Variable group**
3. **Name:** `SWA-Tokens`
4. Şu variable'ları ekleyin:

| Variable Name | Description | Secret |
|--------------|-------------|--------|
| `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV` | Frontend DEV token | ✅ Yes |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` | Frontend PROD token | ✅ Yes |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN_DEV` | Admin DEV token | ✅ Yes |
| `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN_PROD` | Admin PROD token | ✅ Yes |

5. **Save** butonuna tıklayın

### Variable Group Oluşturma Adımları (Detaylı):
1. Variable group adı: `SWA-Tokens`
2. **+ Add** butonuna tıklayın
3. İlk variable ekleyin:
   - **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`
   - **Value:** Frontend DEV token'ı yapıştırın
   - 🔒 **Lock icon**'a tıklayın (secret yapmak için)
4. Diğer 3 token için tekrarlayın
5. **Save**

---

## 📝 Adım 4: Azure DevOps Pipeline Oluşturma

### Azure DevOps'ta Pipeline Oluşturun:

1. **Azure DevOps** → **Pipelines** → **New pipeline**
2. **Azure Repos Git** veya **GitHub** seçin (repo nerede?)
3. Repository seçin: `LogvanceWMS-Frontend`
4. **Existing Azure Pipelines YAML file** seçin
5. **Path:** `/azure-pipelines.yml`
6. **Continue**
7. **Run** butonuna tıklayın

### İlk Çalıştırma:
Pipeline ilk kez çalıştırıldığında:
- Variable group iznini onaylamanız istenecek
- **Permit** butonuna tıklayın
- Pipeline tekrar başlayacak

---

## 🌍 Adım 5: Custom Domain Yapılandırması (Opsiyonel)

### Frontend PROD için:

**Domain:** `www.logvancewms.com` veya `app.logvancewms.com`

1. Azure Portal → Static Web App (`logvancewms-frontend-prod`)
2. **Settings** → **Custom domains** → **+ Add**
3. **Domain name:** `www.logvancewms.com`
4. **Add** butonuna tıklayın

**DNS Ayarı (Domain sağlayıcınızda):**
```
Type: CNAME
Name: www
Value: logvancewms-frontend-prod.azurestaticapps.net
TTL: 3600
```

### Admin PROD için:

**Domain:** `admin.logvancewms.com`

**DNS Ayarı:**
```
Type: CNAME
Name: admin
Value: logvancewms-admin-prod.azurestaticapps.net
TTL: 3600
```

### DEV için:
- Frontend: `dev.logvancewms.com`
- Admin: `admin-dev.logvancewms.com`

---

## 🚀 Adım 6: Pipeline'ı Kullanma

### Otomatik Deployment:

**DEV'e deploy etmek için:**
```bash
git checkout develop
# Değişikliklerinizi yapın
git add .
git commit -m "feat: frontend update"
git push origin develop
```
→ Pipeline otomatik çalışır ve DEV'e deploy eder

**PROD'a deploy etmek için:**
```bash
git checkout main
git merge develop
git push origin main
```
→ Pipeline otomatik çalışır ve PROD'a deploy eder

### Manuel Run:
1. Azure DevOps → **Pipelines**
2. Pipeline'ı seçin
3. **Run pipeline** butonuna tıklayın
4. Branch seçin (main/develop)
5. **Run**

---

## 🔧 Environment Variables Yapılandırması

### React Frontend (.env dosyaları)

Pipeline build sırasında environment variable'ları inject eder, ancak local development için `.env` dosyaları oluşturun:

**`.env.development`** (frontend klasöründe):
```env
VITE_API_URL=https://logvancewms-api-dev.azurewebsites.net/api
VITE_ENVIRONMENT=development
```

**`.env.production`** (frontend klasöründe):
```env
VITE_API_URL=https://logvancewms-api.azurewebsites.net/api
VITE_ENVIRONMENT=production
```

### Angular Admin (environment files)

**`frontend-admin/src/environments/environment.ts`:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://logvancewms-api-dev.azurewebsites.net/api'
};
```

**`frontend-admin/src/environments/environment.prod.ts`:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://logvancewms-api.azurewebsites.net/api'
};
```

---

## ✅ Kurulum Kontrol Listesi

Pipeline'ı çalıştırmadan önce kontrol edin:

- [ ] 4 adet Static Web App oluşturuldu
- [ ] 4 adet deployment token alındı
- [ ] Azure DevOps'ta `SWA-Tokens` variable group oluşturuldu
- [ ] Variable group'a 4 token eklendi (hepsi secret olarak işaretlendi)
- [ ] Pipeline oluşturuldu ve `azure-pipelines.yml` seçildi
- [ ] Frontend klasöründe `package.json` var
- [ ] Frontend-admin klasöründe `package.json` var
- [ ] Git repo'da `main` ve `develop` branch'leri var

---

## 🎯 Pipeline Davranışları

| Branch | Frontend Build | Admin Build | Frontend Deploy | Admin Deploy |
|--------|---------------|-------------|-----------------|--------------|
| `develop` | ✅ Staging | ✅ Development | ✅ DEV | ✅ DEV |
| `main` | ✅ Production | ✅ Production | ✅ PROD | ✅ PROD |
| Diğer | ❌ | ❌ | ❌ | ❌ |

---

## 🐛 Sorun Giderme

### "Variable group not found"
**Çözüm:** 
1. Azure DevOps → Pipelines → Library
2. `SWA-Tokens` variable group'unun var olduğunu kontrol edin
3. Pipeline'a izin verildiğini kontrol edin

### "Deployment failed: Invalid token"
**Çözüm:**
1. Token'ların doğru kopyalandığını kontrol edin
2. Token'ların doğru Static Web App'e ait olduğunu kontrol edin
3. Token'ları yeniden alıp variable group'u güncelleyin

### "Build failed: npm ci"
**Çözüm:**
1. `package-lock.json` dosyasının commit edildiğini kontrol edin
2. Node version'ı kontrol edin (pipeline: 20.x)
3. Dependencies'lerin doğru tanımlandığını kontrol edin

### "Frontend dist folder not found"
**Çözüm:**
1. Build script'lerini kontrol edin:
   - React: `npm run build:production`
   - Angular: `npm run build`
2. Output folder'ların doğru olduğunu kontrol edin:
   - React: `frontend/dist`
   - Angular: `frontend-admin/dist`

---

## 📚 Ek Bilgiler

### Pipeline Stages:

1. **BuildFrontend** - React frontend build
2. **BuildAdmin** - Angular admin build
3. **DeployFrontendDev** - Frontend DEV deploy (develop branch)
4. **DeployAdminDev** - Admin DEV deploy (develop branch)
5. **DeployFrontendProduction** - Frontend PROD deploy (main branch)
6. **DeployAdminProduction** - Admin PROD deploy (main branch)

### Build Süreleri (Tahmini):
- Frontend build: 2-4 dakika
- Admin build: 3-5 dakika
- Deploy: 1-2 dakika
- **Toplam:** ~10-15 dakika

### Environment'lar (Approval için):
Azure DevOps → Pipelines → Environments:
- `Frontend-Development`
- `Admin-Development`
- `Frontend-Production` ← Approval ekleyin
- `Admin-Production` ← Approval ekleyin

---

## 🎉 Tamamlandı!

Pipeline'ınız hazır! Test için:

```bash
# Frontend klasöründe değişiklik yapın
cd frontend
# ... kod değişikliği ...

# Commit ve push
git add .
git commit -m "feat: update frontend"
git push origin develop
```

Pipeline otomatik çalışacak ve her iki frontend'i de DEV'e deploy edecek! 🚀

**URL'ler:**
- Frontend DEV: `https://logvancewms-frontend-dev.azurestaticapps.net`
- Admin DEV: `https://logvancewms-admin-dev.azurestaticapps.net`
- Frontend PROD: `https://logvancewms-frontend-prod.azurestaticapps.net`
- Admin PROD: `https://logvancewms-admin-prod.azurestaticapps.net`

---

## 📞 Destek

Sorun yaşarsanız:
1. Pipeline log'larını inceleyin
2. Variable group'u kontrol edin
3. Token'ların doğru olduğunu kontrol edin
4. Bu rehberdeki adımları tekrar gözden geçirin
