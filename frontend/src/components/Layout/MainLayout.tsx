import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Badge, Button, theme } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
  DatabaseOutlined,
  UserOutlined,
  BellOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  HomeOutlined,
  InboxOutlined,
  CarOutlined,
  FileTextOutlined,
  TeamOutlined,
  BankOutlined,
  EnvironmentOutlined,
  BarChartOutlined,
  ImportOutlined,
  ExportOutlined,
  SwapOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../hooks/useAuth'
import styles from './MainLayout.module.css'

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { token } = theme.useToken()

  const menuItems = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: 'islemler',
      icon: <ShoppingCartOutlined />,
      label: 'İşlemler',
      children: [
        {
          key: '/orders',
          icon: <FileTextOutlined />,
          label: 'Sipariş Listesi',
        },
        {
          key: '/orders/pending',
          icon: <InboxOutlined />,
          label: 'Bekleyen Siparişler',
        },
        {
          key: '/stock-receive',
          icon: <ImportOutlined />,
          label: 'Stok Kabul',
        },
        {
          key: '/stock-out',
          icon: <ExportOutlined />,
          label: 'Stok Çıkış',
        },
        {
          key: '/picking',
          icon: <ShoppingCartOutlined />,
          label: 'Toplama Listesi',
        },
        {
          key: '/packing',
          icon: <InboxOutlined />,
          label: 'Paketleme',
        },
        {
          key: '/returns',
          icon: <SwapOutlined />,
          label: 'İade İşlemleri',
        },
        {
          key: '/inventory',
          icon: <DatabaseOutlined />,
          label: 'Stok Listesi',
        },
        {
          key: '/stock-count',
          icon: <BarChartOutlined />,
          label: 'Stok Sayım',
        },
        {
          key: '/low-stock',
          icon: <WarningOutlined />,
          label: 'Kritik Stok',
        },
      ],
    },
    {
      key: 'ayarlar',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
      children: [
        {
          key: '/settings/products',
          icon: <AppstoreOutlined />,
          label: 'Stok Kartları',
        },
        {
          key: '/settings/tenants',
          icon: <BankOutlined />,
          label: 'Cari Kartlar',
        },
        {
          key: '/settings/warehouses',
          icon: <HomeOutlined />,
          label: 'Depo Tanımları',
        },
        {
          key: '/settings/locations',
          icon: <EnvironmentOutlined />,
          label: 'Raf Tanımları',
        },
        {
          key: '/settings/users',
          icon: <TeamOutlined />,
          label: 'Kullanıcı Tanımları',
        },
        {
          key: '/settings/cargo',
          icon: <CarOutlined />,
          label: 'Kargo Şirketleri',
        },
      ],
    },
    {
      key: 'raporlar',
      icon: <BarChartOutlined />,
      label: 'Raporlar',
      children: [
        {
          key: '/reports/orders',
          icon: <FileTextOutlined />,
          label: 'Sipariş Raporu',
        },
        {
          key: '/reports/performance',
          icon: <BarChartOutlined />,
          label: 'Performans Raporu',
        },
        {
          key: '/reports/stock',
          icon: <DatabaseOutlined />,
          label: 'Stok Raporu',
        },
        {
          key: '/reports/cargo',
          icon: <CarOutlined />,
          label: 'Kargo Raporu',
        },
      ],
    },
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Ayarlar',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Çıkış Yap',
      danger: true,
    },
  ]

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout()
    } else if (key !== 'islemler' && key !== 'ayarlar' && key !== 'raporlar') {
      navigate(key)
    }
  }

  // Find selected keys including parent
  const getSelectedKeys = () => {
    const path = location.pathname
    return [path]
  }

  const getOpenKeys = () => {
    const path = location.pathname
    if (path.startsWith('/orders') || path.startsWith('/stock') || path.startsWith('/picking') || path.startsWith('/packing') || path.startsWith('/returns') || path.startsWith('/inventory') || path.startsWith('/low-stock')) {
      return ['islemler']
    }
    if (path.startsWith('/settings')) {
      return ['ayarlar']
    }
    if (path.startsWith('/reports')) {
      return ['raporlar']
    }
    return []
  }

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.sider}
        width={280}
        theme="light"
      >
        <div className={styles.logo}>
          <img 
            src="/logvance-logo.svg" 
            alt="Logvance" 
            className={styles.logoImage}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          {!collapsed && (
            <span className={styles.logoText}>LOGVANCE</span>
          )}
          {collapsed && (
            <span className={styles.logoIcon}>L</span>
          )}
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          defaultOpenKeys={getOpenKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          className={styles.menu}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <div className={styles.headerLeft}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className={styles.trigger}
            />
          </div>
          <div className={styles.headerRight}>
            <Badge count={5} size="small">
              <Button type="text" icon={<BellOutlined />} className={styles.iconButton} />
            </Badge>
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              placement="bottomRight"
            >
              <div className={styles.userInfo}>
                <Avatar 
                  icon={<UserOutlined />} 
                  className={styles.avatar}
                  style={{ backgroundColor: token.colorPrimary }}
                />
                {user && (
                  <div className={styles.userDetails}>
                    <span className={styles.userName}>
                      {user.firstName} {user.lastName}
                    </span>
                    <span className={styles.userRole}>
                      {user.role === '0' || user.role === 'Admin' ? 'Yönetici' : user.role === '1' || user.role === 'Manager' ? 'Müdür' : 'Operatör'}
                    </span>
                  </div>
                )}
              </div>
            </Dropdown>
          </div>
        </Header>
        <Content className={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
