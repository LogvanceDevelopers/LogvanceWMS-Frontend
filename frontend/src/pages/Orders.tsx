import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ordersApi, dashboardApi } from '../api'
import type { Order, OrderStatus as OrderStatusType } from '../types'
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  DatePicker, 
  Space, 
  Tag, 
  Badge, 
  Dropdown, 
  Modal, 
  Form,
  Row,
  Col,
  Tooltip,
  message,
  Typography
} from 'antd'
import {
  SearchOutlined,
  FilterOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  PrinterOutlined,
  CheckOutlined,
  CloseOutlined,
  DownloadOutlined,
  ReloadOutlined,
  ShopOutlined,
  LoadingOutlined,
  InboxOutlined,
  GiftOutlined,
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import styles from './Orders.module.css'

const { RangePicker } = DatePicker
const { Text } = Typography

// Order Status Enum
enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Processing = 2,
  Picking = 3,
  Packing = 4,
  Packed = 5,
  Shipped = 6,
  Completed = 7,
  Cancelled = 8,
  InvoiceOnly = 9
}

const statusConfig: Record<number, { label: string; color: string; icon: React.ReactNode }> = {
  [OrderStatus.Pending]: { label: 'Sipariş Alındı', color: 'default', icon: <ShopOutlined /> },
  [OrderStatus.Confirmed]: { label: 'Onaylandı', color: 'blue', icon: <CheckOutlined /> },
  [OrderStatus.Processing]: { label: 'Hazırlanıyor', color: 'orange', icon: <LoadingOutlined /> },
  [OrderStatus.Picking]: { label: 'Toplanıyor', color: 'gold', icon: <ShopOutlined /> },
  [OrderStatus.Packing]: { label: 'Paketleniyor', color: 'cyan', icon: <InboxOutlined /> },
  [OrderStatus.Packed]: { label: 'Paketlendi', color: 'geekblue', icon: <GiftOutlined /> },
  [OrderStatus.Shipped]: { label: 'Kargoya Verildi', color: 'purple', icon: <CarOutlined /> },
  [OrderStatus.Completed]: { label: 'Tamamlandı', color: 'green', icon: <CheckCircleOutlined /> },
  [OrderStatus.Cancelled]: { label: 'İptal', color: 'red', icon: <CloseCircleOutlined /> },
  [OrderStatus.InvoiceOnly]: { label: 'Sadece Fatura', color: 'volcano', icon: <FileTextOutlined /> },
}

interface StatusSummary {
  id: number
  label: string
  count: number
}

export default function Orders() {
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [statusSummary, setStatusSummary] = useState<StatusSummary[]>([])
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null)
  const [searchText, setSearchText] = useState('')
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([null, null])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadOrders()
    loadStatusSummary()
  }, [selectedStatus])

  // Sync route-based shortcuts (e.g., /orders/pending) to selected status
  useEffect(() => {
    const path = location.pathname.toLowerCase()
    if (path.includes('/orders/pending')) {
      // Backend enum: Created = 0
      setSelectedStatus(OrderStatus.Pending) // kept for UI consistency; Pending maps to Created below
    } else if (path.includes('/orders/picking') || path === '/picking') {
      setSelectedStatus(OrderStatus.Picking)
    } else if (path.includes('/orders/packing') || path === '/packing') {
      setSelectedStatus(OrderStatus.Packing)
    } else if (path.includes('/orders/shipped')) {
      setSelectedStatus(OrderStatus.Shipped)
    } else if (path.includes('/orders/completed')) {
      setSelectedStatus(OrderStatus.Completed)
    } else if (path.includes('/orders/cancelled') || path.includes('/returns')) {
      setSelectedStatus(OrderStatus.Cancelled)
    } else {
      setSelectedStatus(null)
    }
    // we only want to run this when route changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const filter: any = {}
      if (selectedStatus !== null) {
        filter.status = mapStatusForApi(selectedStatus)
      }
      const response = await ordersApi.getAll(filter)
      const items = 'items' in response ? response.items : (response as any)
      setOrders(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Failed to load orders:', error)
      message.error('Siparişler yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const loadStatusSummary = async () => {
    try {
      const response = await ordersApi.getStatusSummary()
      const summary = response.map((item: any) => ({
        id: item.status ?? item.id,
        label: statusConfig[item.status || item.id]?.label || item.label || 'Bilinmeyen',
        count: item.count || 0,
      }))
      setStatusSummary(summary)
    } catch (error) {
      console.error('Failed to load status summary:', error)
      // Set default empty summary on error
      setStatusSummary([])
    }
  }

  const handleStatusFilter = (statusId: number | null) => {
    setSelectedStatus(statusId === selectedStatus ? null : statusId)
  }

  const handleSearch = () => {
    loadOrders()
  }

  const handleResetFilters = () => {
    setSelectedStatus(null)
    setSearchText('')
    setDateRange([null, null])
  }

  const handleExportExcel = () => {
    message.success('Excel dosyası indiriliyor...')
  }

  const handleApproveOrder = async (order: Order) => {
    Modal.confirm({
      title: 'Sipariş Onayı',
      content: `${order.orderNumber} numaralı siparişi onaylamak istiyor musunuz?`,
      okText: 'Onayla',
      cancelText: 'İptal',
      onOk: async () => {
        try {
          await ordersApi.approve(order.id)
          message.success('Sipariş onaylandı')
          loadOrders()
          loadStatusSummary()
        } catch (error) {
          console.error('Failed to approve order:', error)
          message.error('Sipariş onaylanırken bir hata oluştu')
        }
      },
    })
  }

  const handleCancelOrder = async (order: Order) => {
    Modal.confirm({
      title: 'Sipariş İptali',
      content: `${order.orderNumber} numaralı siparişi iptal etmek istiyor musunuz?`,
      okText: 'İptal Et',
      okButtonProps: { danger: true },
      cancelText: 'Vazgeç',
      onOk: async () => {
        try {
          await ordersApi.cancel(order.id)
          message.success('Sipariş iptal edildi')
          loadOrders()
          loadStatusSummary()
        } catch (error) {
          console.error('Failed to cancel order:', error)
          message.error('Sipariş iptal edilirken bir hata oluştu')
        }
      },
    })
  }

  const printMenuItems = [
    { key: 'invoice', label: 'Fatura Yazdır' },
    { key: 'invoice-screen', label: 'Fatura Yazdır (Ekran)' },
    { key: 'cargo-label', label: 'Kargo Etiketi Yazdır' },
    { key: 'cargo-label-screen', label: 'Kargo Etiketi Yazdır (Ekran)' },
  ]

  const columns: ColumnsType<Order> = [
    {
      title: 'SN',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Sipariş Durumu',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status: number, record) => (
        <div>
          <Text type="secondary" style={{ fontSize: 11 }}>{record.id}</Text>
          <br />
          <Tag color={statusConfig[status]?.color} icon={statusConfig[status]?.icon}>
            {statusConfig[status]?.label}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Sipariş / Oluşturma Tarihi',
      key: 'dates',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div>
          <div>{dayjs(record.orderDate).format('DD.MM.YYYY HH:mm')}</div>
          <div style={{ color: '#999', fontSize: 12 }}>{dayjs(record.createDate).format('DD.MM.YYYY HH:mm')}</div>
        </div>
      ),
    },
    {
      title: 'Sipariş / Fatura No',
      key: 'orderNumbers',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.orderNumber}</div>
          {record.externalOrderNumber && (
            <div style={{ color: '#999', fontSize: 12 }}>{record.externalOrderNumber}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Firma Ünvanı',
      dataIndex: 'tenantId',
      key: 'tenantId',
      width: 120,
      render: (_, record) => (
        <div>
          {/* Tenant name will come from API */}
          {record.priority === 1 && (
            <Tag color="warning" style={{ marginLeft: 4 }}>Öncelikli</Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Alıcı Ünvanı / Telefon',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <div>
          <div>{record.customerName}</div>
          {record.customerPhone && (
            <div style={{ color: '#999', fontSize: 12 }}>{record.customerPhone}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Adres / Kargo',
      key: 'address',
      width: 200,
      render: (_, record) => (
        <div>
          {record.customerAddress && <div>{record.customerAddress}</div>}
          {record.cargoTrackingNumber && (
            <div>
              <Text strong style={{ fontSize: 12 }}>
                {record.cargoTrackingNumber}
              </Text>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Kalem',
      key: 'totalItems',
      width: 70,
      align: 'center',
      render: (_, record) => record.orderLines?.length || 0,
    },
    {
      title: 'Miktar',
      key: 'totalQuantity',
      width: 70,
      align: 'center',
      render: (_, record) => 
        record.orderLines?.reduce((sum, line) => sum + (line.quantity || 0), 0) || 0,
    },
    {
      title: (
        <Button type="primary" icon={<PlusOutlined />} size="small" block>
          Yeni Sipariş
        </Button>
      ),
      key: 'actions',
      width: 160,
      align: 'center',
      render: (_, record) => (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Space size={4}>
            <Tooltip title="Görüntüle">
              <Button size="small" icon={<EyeOutlined />} />
            </Tooltip>
            <Tooltip title="Düzenle">
              <Button size="small" icon={<EditOutlined />} />
            </Tooltip>
          </Space>
          {record.status === 0 && (
            <Space size={4}>
              <Tooltip title="Onayla">
                <Button 
                  size="small" 
                  type="primary" 
                  icon={<CheckOutlined />}
                  style={{ background: '#52c41a' }}
                  onClick={() => handleApproveOrder(record)}
                />
              </Tooltip>
              <Tooltip title="İptal Et">
                <Button 
                  size="small" 
                  danger 
                  icon={<CloseOutlined />}
                  onClick={() => handleCancelOrder(record)}
                />
              </Tooltip>
            </Space>
          )}
          <Dropdown 
            menu={{ 
              items: printMenuItems,
              onClick: ({ key }) => message.info(`${key} seçildi`)
            }}
          >
            <Button size="small" icon={<PrinterOutlined />} block>
              Yazdır
            </Button>
          </Dropdown>
        </Space>
      ),
    },
  ]

  const totalItems = orders.reduce((sum, o) => sum + (o.orderLines?.length || 0), 0)
  const totalQuantity = orders.reduce((sum, o) => 
    sum + (o.orderLines?.reduce((lineSum, line) => lineSum + (line.quantity || 0), 0) || 0), 0)

  // Map UI status enum to backend enum values
  const mapStatusForApi = (status: number | null) => {
    if (status === null) return null
    // Backend enum: Created=0, Approved=1, Picking=2, Packing=3, Shipped=4, Delivered=5, Cancelled=6, Returned=7
    switch (status) {
      case OrderStatus.Pending: // UI "Pending" -> backend Created (0)
        return 0
      case OrderStatus.Processing: // UI "Processing" -> backend Approved (1)
        return 1
      case OrderStatus.Picking:
        return 2
      case OrderStatus.Packing:
        return 3
      case OrderStatus.Shipped:
        return 4
      case OrderStatus.Completed: // map to Delivered (5)
        return 5
      case OrderStatus.Cancelled:
        return 6
      default:
        return status
    }
  }

  return (
    <div className={styles.container}>
      {/* Status Summary Cards */}
      <div className={styles.statusCards}>
        {statusSummary.map((status) => (
          <Card
            key={status.id}
            className={`${styles.statusCard} ${selectedStatus === status.id ? styles.active : ''}`}
            onClick={() => handleStatusFilter(status.id)}
            hoverable
          >
            <div className={styles.statusCardContent}>
              <div className={styles.statusCardTitle}>{status.label}</div>
              <div className={styles.statusCardCount}>{status.count} Adet</div>
            </div>
            <div className={styles.statusCardIcon}>
              {statusConfig[status.id]?.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={4}>
            <label>Başlangıç Tarihi:</label>
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Başlangıç"
              onChange={(date) => setDateRange([date, dateRange[1]])}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>Bitiş Tarihi:</label>
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Bitiş"
              onChange={(date) => setDateRange([dateRange[0], date])}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>Sipariş Kaynağı:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="--Seçiniz--"
              allowClear
              options={[
                { value: '1', label: 'Trendyol' },
                { value: '2', label: 'Hepsiburada' },
                { value: '3', label: 'Amazon' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={8}>
            <label>Arama:</label>
            <Input
              placeholder="Sipariş Ara..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>Kargo Durumu:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="Tümü"
              allowClear
              options={[
                { value: 'pending', label: 'İşlemde' },
                { value: 'sent', label: 'Gönderildi' },
                { value: 'error', label: 'Hatalı' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>Cari Kart:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="--Seçiniz--"
              allowClear
              showSearch
              options={[
                { value: '1', label: 'NUREDERM' },
                { value: '2', label: 'VİTAFENİX' },
                { value: '3', label: 'GENOTEK' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>Kargo Şirketi:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="--Seçiniz--"
              allowClear
              options={[
                { value: '1', label: 'YURTİÇİ' },
                { value: '2', label: 'ARAS' },
                { value: '3', label: 'MNG' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={4}>
            <label>Personel:</label>
            <Select
              style={{ width: '100%' }}
              placeholder="--Seçiniz--"
              allowClear
              options={[
                { value: '1', label: 'Ahmet Yılmaz' },
                { value: '2', label: 'Mehmet Demir' },
              ]}
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <label>&nbsp;</label>
            <Button icon={<DownloadOutlined />} block style={{ background: '#52c41a', color: '#fff' }} onClick={handleExportExcel}>
              Excel'e Aktar
            </Button>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <label>&nbsp;</label>
            <Button icon={<ReloadOutlined />} block onClick={handleResetFilters}>
              Temizle
            </Button>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <label>&nbsp;</label>
            <Button type="primary" icon={<FilterOutlined />} block onClick={handleSearch}>
              Filtrele
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Orders Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{
            total: orders.length,
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
          scroll={{ x: 1400, y: 'calc(100vh - 450px)' }}
          size="small"
          rowClassName={(record) => record.priority === 1 ? styles.priorityRow : ''}
          summary={() => (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={7} />
                <Table.Summary.Cell index={7} align="center">
                  <Text type="danger" strong>{totalItems}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} align="center">
                  <Text type="danger" strong>{totalQuantity}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9} />
              </Table.Summary.Row>
            </Table.Summary>
          )}
        />
      </Card>
    </div>
  )
}
