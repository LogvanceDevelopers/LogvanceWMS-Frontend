# Azure DevOps Pipeline – YeniWMS’te Run ve Azure’a Deploy

Bu repo hem **GitHub** hem **Azure Repos**’ta. [Runs](https://dev.azure.com/Logvancewms/YeniWMS/_build?view=runs) sayfasında run görmek ve Azure Portal’a deploy için aşağıdakiler gerekir.

## 1. Pipeline’ın bu repoya bağlı olması

Pipeline **Azure Repos**’taki bu repo ile çalışmalı ki push’lar Runs’ta görünsün ve Azure’a deploy tetiklensin.

### Yeni pipeline oluşturma (Azure Repos)

1. **[Pipelines](https://dev.azure.com/Logvancewms/YeniWMS/_build)** → **New pipeline**
2. **Azure Repos Git** seçin
3. **LogvanceWMS-Frontend** repository’sini seçin
4. **Existing Azure Pipelines YAML file** → Path: **`/azure-pipelines.yml`**
5. **Continue** → **Run** (ilk run’ı manuel başlatın)
6. İzin isterse **Permit** ile onaylayın

Pipeline adı (ör. **Azure-pipelines-Frontend**) kaydedilir. Bundan sonra bu repoya `main` / `develop` push’larında run otomatik tetiklenir.

### Kaynak GitHub ise

Pipeline şu an **GitHub** (LOGVANCE/LogvanceWMS-Frontend) ile tanımlıysa, run’lar sadece GitHub’a push’ta oluşur. Azure Repos’taki push’lar Runs’ta görünmez.  
İki seçenek:

- **A)** Runs’u Azure Repos’tan görmek istiyorsanız: Yukarıdaki gibi **Azure Repos** ile yeni bir pipeline oluşturun (YAML: `/azure-pipelines.yml`).
- **B)** GitHub’ı kullanmaya devam edin: Run’lar [GitHub Actions](https://github.com/LOGVANCE/LogvanceWMS-Frontend/actions) ve/veya GitHub’a bağlı Azure pipeline’da görünür.

## 2. Kodu Azure Repos’a göndermek

Değişikliklerin [Runs](https://dev.azure.com/Logvancewms/YeniWMS/_build?view=runs) ve Azure deploy’a yansıması için Azure Repos’a push gerekir:

```bash
cd C:\Projects\LogvanceWms.Frontend\LogvanceWMS-Frontend

# Azure remote yoksa ekleyin
git remote add azure https://Logvancewms@dev.azure.com/Logvancewms/YeniWMS/_git/LogvanceWMS-Frontend

# main ve develop'ı gönderin
git push azure main
git push azure develop
```

Bundan sonra bu repoya bağlı pipeline run’ları tetiklenir ve **Runs** sayfasında görünür.

## 3. Azure Portal’a deploy

Pipeline’daki deploy adımları **Azure Static Web Apps** kullanır. Runs’ta run’ların yeşil bitmesi için:

- **Library** → **Variable group**: **SWA-Tokens** (içinde `AZURE_STATIC_WEB_APPS_API_TOKEN_DEV`, `AZURE_STATIC_WEB_APPS_API_TOKEN_PROD` vb. tanımlı olmalı)
- Gerekirse **Environments** / **Service connection** ile Azure bağlantısı tanımlanmalı

Bu ayarlar tamamsa, run başarılı olduğunda deploy otomatik olarak Azure Portal’daki ilgili Static Web App’lere gider.

---

**Özet:** Runs’ta run görmek için pipeline’ı **Azure Repos** → **LogvanceWMS-Frontend** ile oluşturun ve kodu `git push azure main` / `git push azure develop` ile bu repoya gönderin. Deploy, pipeline’daki YAML ve variable group ile Azure Portal’a yapılır.
