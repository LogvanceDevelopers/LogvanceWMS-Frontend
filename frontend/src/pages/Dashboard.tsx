import { useState, useEffect } from 'react'
import { Card, Row, Col, Segmented, Spin, Avatar, Badge, Statistic, Empty, Typography, Progress } from 'antd'
import {
  ShopOutlined,
  LoadingOutlined,
  InboxOutlined,
  GiftOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import styles from './Dashboard.module.css'
import { dashboardApi } from '../api'
import type { TenantOrderSummary, UserPerformance } from '../types'

const { Title, Text } = Typography

export default function Dashboard() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [loading, setLoading] = useState(false)
  const [tenantOrders, setTenantOrders] = useState<TenantOrderSummary[]>([])
  const [userPerformance, setUserPerformance] = useState<UserPerformance[]>([])

  useEffect(() => {
    loadDashboardData()
  }, [period])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [tenantData, userData] = await Promise.all([
        dashboardApi.getTenantOrderSummary(period),
        dashboardApi.getUserPerformance(period),
      ])
      setTenantOrders(Array.isArray(tenantData) ? tenantData : [])
      setUserPerformance(Array.isArray(userData) ? userData : [])
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      // Set empty arrays on error
      setTenantOrders([])
      setUserPerformance([])
    } finally {
      setLoading(false)
    }
  }

  const periodOptions = [
    { label: 'Bugün', value: 'daily' },
    { label: 'Bu Hafta', value: 'weekly' },
    { label: 'Bu Ay', value: 'monthly' },
  ]

  const getTotalForTenant = (tenant: TenantOrderSummary) => {
    return tenant.pendingCount + tenant.processingCount + tenant.packingCount + tenant.packedCount
  }

  const isInactive = (tenant: TenantOrderSummary) => {
    return getTotalForTenant(tenant) === 0
  }

  return (
    <div className={styles.container}>
      {/* Period Selector */}
      <div className={styles.periodSelector}>
        <Segmented
          options={periodOptions}
          value={period}
          onChange={(value) => setPeriod(value as 'daily' | 'weekly' | 'monthly')}
          size="large"
          className={styles.segmented}
        />
      </div>

      {loading ? (
        <div className={styles.loadingContainer}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
          <Text className={styles.loadingText}>Raporlar listeleniyor, Lütfen bekleyiniz.</Text>
        </div>
      ) : (
        <>
          {/* Tenant Order Summary Cards */}
          <div className={styles.section}>
            <Title level={4} className={styles.sectionTitle}>Firma Bazlı Sipariş Durumu</Title>
            <Row gutter={[16, 16]}>
              {tenantOrders.map((tenant) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={tenant.tenantId}>
                  <Card 
                    className={`${styles.tenantCard} ${isInactive(tenant) ? styles.inactive : ''}`}
                    bordered={false}
                  >
                    <div className={styles.tenantHeader}>
                      {tenant.tenantLogo ? (
                        <img src={tenant.tenantLogo} alt={tenant.tenantName} className={styles.tenantLogo} />
                      ) : (
                        <Text strong className={styles.tenantName}>{tenant.tenantName}</Text>
                      )}
                    </div>
                    
                    <div className={styles.statusList}>
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>
                          <ShopOutlined className={styles.statusIconPrimary} />
                          <span>Alındı</span>
                        </div>
                        <Badge 
                          count={tenant.pendingCount} 
                          showZero 
                          className={styles.badgePrimary}
                          overflowCount={999}
                        />
                      </div>
                      
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>
                          <LoadingOutlined className={styles.statusIconWarning} />
                          <span>Hazırlanıyor</span>
                        </div>
                        <Badge 
                          count={tenant.processingCount} 
                          showZero 
                          className={styles.badgeWarning}
                          overflowCount={999}
                        />
                      </div>
                      
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>
                          <InboxOutlined className={styles.statusIconInfo} />
                          <span>Paketleniyor</span>
                        </div>
                        <Badge 
                          count={tenant.packingCount} 
                          showZero 
                          className={styles.badgeInfo}
                          overflowCount={999}
                        />
                      </div>
                      
                      <div className={styles.statusItem}>
                        <div className={styles.statusLabel}>
                          <GiftOutlined className={styles.statusIconSuccess} />
                          <span>Paketlendi</span>
                        </div>
                        <Badge 
                          count={tenant.packedCount} 
                          showZero 
                          className={styles.badgeSuccess}
                          overflowCount={999}
                        />
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Divider */}
          <div className={styles.divider} />

          {/* User Performance Section */}
          <div className={styles.section}>
            <Title level={4} className={styles.sectionTitle}>Personel Performansı</Title>
            <Row gutter={[16, 16]}>
              {userPerformance.map((user) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={user.userId}>
                  <Card className={styles.userCard} bordered={false}>
                    <div className={styles.userHeader}>
                      <Avatar 
                        src={user.userImage} 
                        icon={<UserOutlined />}
                        size={40}
                        className={styles.userAvatar}
                      />
                      <Text strong className={styles.userName}>{user.userName}</Text>
                    </div>
                    
                    <div className={styles.userStats}>
                      <div className={styles.userStat}>
                        <FileTextOutlined className={styles.userStatIcon} />
                        <div className={styles.userStatInfo}>
                          <Text type="secondary">Toplama</Text>
                          <Text strong>{user.pickingCount}</Text>
                        </div>
                      </div>
                      
                      <div className={styles.userStat}>
                        <ShoppingCartOutlined className={styles.userStatIcon} />
                        <div className={styles.userStatInfo}>
                          <Text type="secondary">Sipariş</Text>
                          <Text strong>{user.orderCount}</Text>
                        </div>
                      </div>
                      
                      <div className={styles.userStat}>
                        <AppstoreOutlined className={styles.userStatIcon} />
                        <div className={styles.userStatInfo}>
                          <Text type="secondary">Miktar</Text>
                          <Text strong>{user.itemCount}</Text>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </>
      )}
    </div>
  )
}
