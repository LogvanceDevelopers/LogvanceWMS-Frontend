import { Routes, Route, Navigate } from 'react-router-dom'
import { ConfigProvider, App as AntApp, theme as antTheme } from 'antd'
import trTR from 'antd/locale/tr_TR'
import MainLayout from './components/Layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Login from './pages/Login'
import { useAuth } from './hooks/useAuth'

const theme = {
  algorithm: antTheme.darkAlgorithm,
  token: {
    colorPrimary: '#0D9488',
    colorBgContainer: '#1E293B',
    colorBgElevated: '#334155',
    colorBgLayout: '#0F172A',
    colorBorder: '#334155',
    colorText: '#F8FAFC',
    colorTextSecondary: '#94A3B8',
    borderRadius: 8,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Layout: {
      siderBg: '#1E293B',
      headerBg: '#1E293B',
      bodyBg: '#0F172A',
    },
    Menu: {
      darkItemBg: '#1E293B',
      darkSubMenuItemBg: '#1E293B',
    },
    Card: {
      colorBgContainer: '#1E293B',
    },
    Table: {
      colorBgContainer: '#1E293B',
      headerBg: '#334155',
    },
  },
}

function App() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <ConfigProvider theme={theme} locale={trTR}>
        <AntApp>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </AntApp>
      </ConfigProvider>
    )
  }

  return (
    <ConfigProvider theme={theme} locale={trTR}>
      <AntApp>
        <MainLayout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Dashboard />} />
            
            {/* İşlemler */}
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/pending" element={<Orders />} />
            <Route path="/orders/:id" element={<Orders />} />
            <Route path="/stock-receive" element={<Inventory />} />
            <Route path="/stock-out" element={<Inventory />} />
            <Route path="/picking" element={<Orders />} />
            <Route path="/packing" element={<Orders />} />
            <Route path="/returns" element={<Orders />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/stock-count" element={<Inventory />} />
            <Route path="/low-stock" element={<Inventory />} />
            
            {/* Ayarlar */}
            <Route path="/settings/products" element={<Products />} />
            <Route path="/settings/tenants" element={<Products />} />
            <Route path="/settings/warehouses" element={<Products />} />
            <Route path="/settings/locations" element={<Products />} />
            <Route path="/settings/users" element={<Products />} />
            <Route path="/settings/cargo" element={<Products />} />
            
            {/* Raporlar */}
            <Route path="/reports/orders" element={<Orders />} />
            <Route path="/reports/performance" element={<Dashboard />} />
            <Route path="/reports/stock" element={<Inventory />} />
            <Route path="/reports/cargo" element={<Orders />} />
            
            {/* Legacy routes */}
            <Route path="/products" element={<Products />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      </AntApp>
    </ConfigProvider>
  )
}

export default App
