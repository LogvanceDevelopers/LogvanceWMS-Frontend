# 🎯 Logvance WMS Admin Panel

Angular-based administration panel for **Logvance WMS 3.0** - Pluggable Module Management System.

## 🚀 Features

- ✅ **Module Management** - Enable/disable warehouse modules
- ✅ **Dynamic Workflow Configuration** - Configure execution order
- ✅ **Conditional Logic** - Skip conditions (JSON-based)
- ✅ **Custom Settings** - Warehouse-specific module configuration
- ✅ **JWT Authentication** - Secure API access
- ✅ **Angular Material UI** - Modern, responsive design
- ✅ **Multi-Warehouse Support** - Manage multiple warehouses

---

## 📋 Prerequisites

- Node.js 18+ (or Node 16+)
- npm or yarn
- Angular CLI 13+

---

## 🛠️ Installation

```bash
cd frontend-admin
npm install
```

---

## ⚙️ Configuration

Update API endpoint in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7295/api'  // Your backend API URL
};
```

For production (`environment.prod.ts`):

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://logvancewms-core-api.azurewebsites.net/api'
};
```

---

## 🏃 Running the Application

### Development Server

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### Build for Production

```bash
npm run build
# or
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

---

## 📱 Usage

### 1. Login

Default credentials (from your backend):
- Username: `admin`
- Password: `yourpassword`

### 2. Select Warehouse

Choose a warehouse from the dropdown to view/configure its modules.

### 3. Module Management

**Enable Module:**
- Click ➕ icon next to any module
- Configure:
  - **Execution Order**: 10, 20, 30... (determines workflow sequence)
  - **Required**: Cannot be disabled
  - **Can Skip**: Allow conditional skipping
  - **Skip Conditions**: JSON rules for when to skip
  - **Custom Settings**: Warehouse-specific config

**Disable Module:**
- Click ➖ icon (only for non-required modules)

**Configure Module:**
- Click ⚙️ icon to update existing configuration

---

## 📊 Module Examples

### Example 1: Enable Sorting Module

```json
{
  "executionOrder": 20,
  "isRequired": false,
  "canSkip": true,
  "skipConditions": {
    "skipIfProductType": "digital"
  },
  "customSettings": {
    "maxCapacity": 100,
    "autoRelease": true
  }
}
```

### Example 2: Quality Control (Conditional)

```json
{
  "executionOrder": 30,
  "isRequired": false,
  "canSkip": true,
  "skipConditions": {
    "skipIfOrderType": "express",
    "skipIfCustomer": "premium-customer-id"
  },
  "customSettings": {
    "samplingRate": 10,
    "requirePhotos": true
  }
}
```

---

## 🗂️ Project Structure

```
frontend-admin/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── login/              # Login page
│   │   │   ├── dashboard/          # Main layout (sidebar, toolbar)
│   │   │   ├── module-list/        # Module management table
│   │   │   └── module-config/      # Enable/configure dialog
│   │   ├── services/
│   │   │   ├── auth.service.ts     # Authentication service
│   │   │   └── module.service.ts   # Module CRUD operations
│   │   ├── guards/
│   │   │   └── auth.guard.ts       # Route protection
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts # JWT token injection
│   │   └── models/
│   │       ├── auth.model.ts       # Auth DTOs
│   │       └── module.model.ts     # Module DTOs
│   ├── environments/
│   │   ├── environment.ts          # Dev config
│   │   └── environment.prod.ts     # Prod config
│   └── styles.scss                 # Global styles
└── angular.json
```

---

## 🎨 UI Screenshots

### Login Page
- Modern gradient background
- Material Design form
- Error handling

### Dashboard
- Responsive sidebar navigation
- User info in toolbar
- Logout functionality

### Module Management
- Warehouse selector
- Module table with status chips
- Enable/disable actions
- Configure dialog with JSON editors

---

## 🔧 API Endpoints Used

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User authentication |
| `/api/modules/definitions` | GET | Get all module definitions |
| `/api/modules/warehouse/{id}` | GET | Get warehouse modules |
| `/api/modules/enable` | POST | Enable/configure module |
| `/api/modules/disable` | POST | Disable module |
| `/api/warehouses` | GET | Get all warehouses |

---

## 🐛 Troubleshooting

### CORS Issues

If you get CORS errors, ensure your backend `appsettings.json` includes:

```json
{
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:4200"
    ]
  }
}
```

### API Connection Failed

1. Check if backend is running (`https://localhost:7295`)
2. Verify `environment.ts` has correct API URL
3. Check browser console for errors

### Module Not Appearing

1. Ensure `ModuleDefinitionSeeder` ran successfully
2. Check database has records in `ModuleDefinitions` table
3. Verify API endpoint `/api/modules/definitions` returns data

---

## 📦 Build & Deploy

### Azure Static Web App

```bash
npm run build
# Upload dist/ folder to Azure Static Web Apps
```

### Docker

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/frontend-admin /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### IIS

1. Build: `npm run build`
2. Copy `dist/frontend-admin/*` to IIS folder
3. Add `web.config` for SPA routing

---

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

---

## 📄 License

Private - Logvance WMS © 2026

---

## 🙏 Credits

Built with:
- **Angular 13**
- **Angular Material**
- **RxJS**
- **TypeScript**

---

**Happy Module Managing! 🚀🔌**
