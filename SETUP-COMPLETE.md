# ✅ Azure Deployment Setup - TAMAMLANDI

> **Not:** Repo artık **GitHub** üzerinde: [https://github.com/LOGVANCE/LogvanceWMS-Frontend](https://github.com/LOGVANCE/LogvanceWMS-Frontend). Azure DevOps pipeline için **Logvancewms / YeniWMS** projesi kullanılmaktadır.

## 🎉 Başarılı Olan İşlemler

### ✅ 1. Azure Static Web Apps Oluşturuldu

| Kaynak | SKU | Status | URL |
|--------|-----|--------|-----|
| `logvancewms-frontend-dev` | Free | ✅ Oluşturuldu | https://polite-wave-0b5b23903.1.azurestaticapps.net |
| `logvancewms-frontend-prod` | Standard | ✅ Oluşturuldu | https://ambitious-bay-084bd5903.1.azurestaticapps.net |
| `logvancewms-admin-dev` | Free | ✅ Oluşturuldu | https://thankful-smoke-097936803.2.azurestaticapps.net |
| `logvancewms-admin-prod` | Standard | ✅ Oluşturuldu | https://yellow-forest-04a2ada03.6.azurestaticapps.net |

### ✅ 2. Deployment Token'lar Alındı

Tüm token'lar `AZURE-DEPLOYMENT-TOKENS.md` dosyasında saklandı. ✅

### ✅ 3. Git Remote Eklendi

Azure DevOps remote başarıyla eklendi. ✅

---

## 📋 ŞİMDİ YAPMANIZ GEREKENLER (3 Kolay Adım)

### ADIM 1: Personal Access Token Oluşturun

Git authentication için PAT gerekiyor:

1. **Bu linke tıklayın:** https://dev.azure.com/Logvancewms/_usersSettings/tokens

2. **+ New Token** butonuna tıklayın

3. Formu doldurun:
   - **Name:** `Frontend-Git-Push`
   - **Organization:** `Logvancewms`
   - **Expiration:** 90 days (veya istediğiniz)
   - **Scopes:** **Full access** veya **Code (Read & Write)** ✅

4. **Create** butonuna tıklayın

5. **Token'ı KOPYALAYIN** (bir daha gösterilmez!)
   - Örnek: `abcd1234efgh5678ijkl9012mnop3456qrst7890`

6. Token'ı geçici olarak bir yere yapıştırın (sonra silebilirsiniz)

---

### ADIM 2: Kodu Azure DevOps'a Push Edin

PowerShell'de çalıştırın:

```powershell
cd C:\Projects\LogvanceWms.Frontend\LogvanceWMS-Frontend

# Main branch'i push edin
git checkout main
git push azure main

# Develop branch'i push edin
git checkout develop
git push azure develop
```

**Password istediğinde:**
- Username: `Logvancewms` (veya email'iniz)
- Password: **Yukarıda oluşturduğunuz PAT token'ı yapıştırın**

---

### ADIM 3: Azure DevOps Variable Group Oluşturun

1. **Bu linke tıklayın:** https://dev.azure.com/Logvancewms/YeniWMS/_library

2. **+ Variable group** butonuna tıklayın

3. **Variable group name:** `SWA-Tokens` yazın

4. Şimdi 4 token ekleyeceğiz. Her biri için:

#### Token 1: Frontend DEV
- **+ Add** tıklayın
- **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`
- **Value:** `AZURE-DEPLOYMENT-TOKENS.md` dosyasını açın ve "Frontend DEV Token" altındaki token'ı kopyala-yapıştır yapın
- 🔒 **Lock icon**'a tıklayın (secret yapmak için)

#### Token 2: Frontend PROD
- **+ Add** tıklayın
- **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD`
- **Value:** "Frontend PROD Token" kopyala-yapıştır
- 🔒 **Lock icon**'a tıklayın

#### Token 3: Admin DEV
- **+ Add** tıklayın
- **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN_DEV`
- **Value:** "Admin DEV Token" kopyala-yapıştır
- 🔒 **Lock icon**'a tıklayın

#### Token 4: Admin PROD
- **+ Add** tıklayın
- **Name:** `AZURE_STATIC_WEB_APPS_API_TOKEN_ADMIN_PROD`
- **Value:** "Admin PROD Token" kopyala-yapıştır
- 🔒 **Lock icon**'a tıklayın

5. **Save** butonuna tıklayın

---

### ADIM 4: Pipeline Oluşturun

1. **Bu linke tıklayın:** https://dev.azure.com/Logvancewms/YeniWMS/_build

2. **New pipeline** butonuna tıklayın

3. **Azure Repos Git** seçin

4. **LogvanceWMS-Frontend** (veya ilgili frontend repo) repository'sini seçin

5. **Existing Azure Pipelines YAML file** seçin

6. **Path:** dropdown'dan `/azure-pipelines.yml` seçin

7. **Continue** butonuna tıklayın

8. Pipeline YAML önizlemesi açılır, **Run** butonuna tıklayın

9. İlk çalıştırmada izin uyarısı çıkacak:
   - "This pipeline needs permission to access a resource"
   - **Permit** veya **View** → **Permit** butonuna tıklayın
   - Pipeline otomatik tekrar başlayacak

---

## 🎯 TAMAMLANDI!

Pipeline artık çalışıyor! 🚀

### Pipeline İzleme

Pipeline'ı buradan izleyebilirsiniz:
https://dev.azure.com/Logvancewms/YeniWMS/_build

### Otomatik Deployment

Artık kod push ettiğinizde otomatik deploy olacak:

**DEV'e deploy:**
```powershell
git checkout develop
# Kod değişiklikleri...
git add .
git commit -m "feat: new feature"
git push azure develop
```
→ Pipeline otomatik çalışır ve DEV'e deploy eder

**PROD'a deploy:**
```powershell
git checkout main
git merge develop
git push azure main
```
→ Pipeline otomatik çalışır ve PROD'a deploy eder

---

## 📊 Pipeline Stages

Pipeline 6 stage'den oluşuyor:

1. **BuildFrontend** - React frontend build
2. **BuildAdmin** - Angular admin build
3. **DeployFrontendDev** - Frontend DEV deploy (develop branch)
4. **DeployAdminDev** - Admin DEV deploy (develop branch)
5. **DeployFrontendProduction** - Frontend PROD deploy (main branch)
6. **DeployAdminProduction** - Admin PROD deploy (main branch)

---

## 🌍 Deployment URL'leri

Deploy tamamlandıktan sonra uygulamalara erişim:

### DEV Ortamı
- **Frontend DEV:** https://polite-wave-0b5b23903.1.azurestaticapps.net
- **Admin DEV:** https://thankful-smoke-097936803.2.azurestaticapps.net

### PROD Ortamı
- **Frontend PROD:** https://ambitious-bay-084bd5903.1.azurestaticapps.net
- **Admin PROD:** https://yellow-forest-04a2ada03.6.azurestaticapps.net

---

## 🌐 Custom Domain (İlerisi İçin)

Production'da custom domain kullanmak isterseniz:

### Frontend: www.logvancewms.com

1. Azure Portal → Static Web App: `logvancewms-frontend-prod`
2. Settings → Custom domains → + Add
3. Domain: `www.logvancewms.com`
4. DNS CNAME ekleyin:
   ```
   Type: CNAME
   Name: www
   Value: ambitious-bay-084bd5903.1.azurestaticapps.net
   ```

### Admin: admin.logvancewms.com

1. Azure Portal → Static Web App: `logvancewms-admin-prod`
2. Settings → Custom domains → + Add
3. Domain: `admin.logvancewms.com`
4. DNS CNAME ekleyin:
   ```
   Type: CNAME
   Name: admin
   Value: yellow-forest-04a2ada03.6.azurestaticapps.net
   ```

---

## ✅ Checklist

Tamamlandı mı kontrol edin:

- [x] 4 Static Web App oluşturuldu ✅
- [x] 4 Deployment token alındı ✅
- [x] Token dosyası oluşturuldu ✅
- [x] Git remote eklendi ✅
- [ ] Personal Access Token oluşturuldu (ADIM 1)
- [ ] Kod Azure DevOps'a push edildi (ADIM 2)
- [ ] Variable Group oluşturuldu (ADIM 3)
- [ ] Pipeline oluşturuldu (ADIM 4)

---

## 🆘 Yardım

Sorun yaşarsanız:

1. **AZURE-DEPLOYMENT-TOKENS.md** - Token'lar burada
2. **PIPELINE-SETUP-GUIDE.md** - Detaylı rehber
3. **QUICK-START.md** - Hızlı başlangıç
4. **README.md** - Genel bilgiler

---

**Başarılar! 🎉**

Pipeline setup tamamlandı. Artık her code push'ta otomatik deployment yapılacak!
