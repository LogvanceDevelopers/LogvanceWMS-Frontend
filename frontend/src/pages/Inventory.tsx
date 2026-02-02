import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { inventoryApi } from '../api'
import type { InventoryItem } from '../types'
import {
  Card,
  Table,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  Row,
  Col,
  Tag,
  Tooltip,
  message,
  Typography,
  InputNumber,
  Statistic,
  Progress,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  SwapOutlined,
  WarningOutlined,
  DatabaseOutlined,
  EnvironmentOutlined,
  AppstoreOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import styles from './Inventory.module.css'

const { Text } = Typography

const statusMap: Record<number, { label: string; color: string }> = {
  0: { label: 'Kullanılabilir', color: 'success' },
  1: { label: 'Rezerve', color: 'warning' },
  2: { label: 'Hasarlı', color: 'error' },
  3: { label: 'Karantina', color: 'default' },
}

export default function Inventory() {
  const location = useLocation()
  const isStockCountRoute = location.pathname.includes('stock-count')
  const isLowStockRoute = location.pathname.includes('low-stock')
  const [loading, setLoading] = useState(false)
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null)
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false)
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [adjustForm] = Form.useForm()
  const [transferForm] = Form.useForm()

  useEffect(() => {
    loadInventory()
  }, [selectedWarehouse])

  const loadInventory = async () => {
    try {
      setLoading(true)
      const filter: any = {}
      if (selectedWarehouse) {
        filter.warehouseId = selectedWarehouse
      }
      const response = await inventoryApi.getAll(filter)
      const items = 'items' in response ? response.items : (response as any)
      setInventory(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Failed to load inventory:', error)
      message.error('Stok listesi yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const totalItems = inventory.length
  const totalQuantity = inventory.reduce((sum, i) => sum + i.quantity, 0)
  const lowStockItems = inventory.filter((i) => i.quantity <= 5).length
  const outOfStockItems = inventory.filter((i) => i.quantity === 0).length

  const handleAdjust = (record: InventoryItem) => {
    setSelectedItem(record)
    adjustForm.setFieldsValue({
      currentQuantity: record.quantity,
      newQuantity: record.quantity,
    })
    setIsAdjustModalOpen(true)
  }

  const handleTransfer = (record: InventoryItem) => {
    setSelectedItem(record)
    transferForm.setFieldsValue({
      quantity: 1,
    })
    setIsTransferModalOpen(true)
  }

  const handleAdjustSave = async () => {
    try {
      const values = await adjustForm.validateFields()
      if (selectedItem) {
        const quantityChange = values.newQuantity - values.currentQuantity
        await inventoryApi.adjust(selectedItem.id, quantityChange, values.reason)
        message.success('Stok miktarı güncellendi')
        setIsAdjustModalOpen(false)
        loadInventory()
      }
    } catch (error) {
      console.error('Failed to adjust inventory:', error)
      message.error('Stok düzeltilirken bir hata oluştu')
    }
  }

  const handleTransferSave = async () => {
    try {
      const values = await transferForm.validateFields()
      if (selectedItem) {
        await inventoryApi.transfer(selectedItem.id, values.targetLocation, values.quantity)
        message.success(`${values.quantity} adet transfer edildi`)
        setIsTransferModalOpen(false)
        loadInventory()
      }
    } catch (error) {
      console.error('Failed to transfer inventory:', error)
      message.error('Stok transfer edilirken bir hata oluştu')
    }
  }

  const columns: ColumnsType<InventoryItem> = [
    {
      title: 'SN',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Stok Kodu',
      key: 'productSku',
      width: 100,
      render: (_, record) => record.product?.sku || '-',
      sorter: (a, b) => (a.product?.sku || '').localeCompare(b.product?.sku || ''),
    },
    {
      title: 'Stok Adı',
      key: 'productName',
      ellipsis: true,
      render: (_, record) => record.product?.name || '-',
    },
    {
      title: 'Barkod',
      key: 'barcode',
      width: 130,
      render: (_, record) => record.product?.barcode || '-',
    },
    {
      title: 'Raf',
      key: 'locationCode',
      width: 90,
      render: (_, record) => (
        <Tag icon={<EnvironmentOutlined />} color="blue">
          {record.location?.code || '-'}
        </Tag>
      ),
    },
    {
      title: 'Miktar',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'center',
      render: (value) => (
        <Tag color={value === 0 ? 'error' : value <= 5 ? 'warning' : 'success'}>
          {value}
        </Tag>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: 'Lot No',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 120,
      render: (text) => text || '-',
    },
    {
      title: 'SKT',
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      width: 100,
      render: (date) => {
        if (!date) return '-'
        const isExpiringSoon = new Date(date) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
        return (
          <Text type={isExpiringSoon ? 'danger' : undefined}>
            {new Date(date).toLocaleDateString('tr-TR')}
          </Text>
        )
      },
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'center',
      render: (status) => (
        <Tag color={statusMap[status]?.color}>
          {statusMap[status]?.label}
        </Tag>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="Stok Düzelt">
            <Button
              size="small"
              icon={<PlusCircleOutlined />}
              onClick={() => handleAdjust(record)}
            />
          </Tooltip>
          <Tooltip title="Transfer">
            <Button
              size="small"
              icon={<SwapOutlined />}
              onClick={() => handleTransfer(record)}
              disabled={record.quantity === 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  const filteredInventory = inventory.filter((i) => {
    const matchesSearch =
      !searchText ||
      (i.product?.name && i.product.name.toLowerCase().includes(searchText.toLowerCase())) ||
      (i.product?.sku && i.product.sku.toLowerCase().includes(searchText.toLowerCase())) ||
      (i.product?.barcode && i.product.barcode.includes(searchText)) ||
      (i.location?.code && i.location.code.toLowerCase().includes(searchText.toLowerCase()))
    // Warehouse bilgisi DTO'da yok; seçiliyse şimdilik filtre uygulamıyoruz
    const matchesWarehouse = !selectedWarehouse
    const matchesLowStock = !isLowStockRoute || i.quantity <= 5
    return matchesSearch && matchesWarehouse && matchesLowStock
  })

  return (
    <div className={styles.container}>
      {/* Stats Cards */}
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Toplam Kalem"
              value={totalItems}
              prefix={<AppstoreOutlined />}
              valueStyle={{ color: '#1a4686' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Toplam Miktar"
              value={totalQuantity}
              prefix={<DatabaseOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Kritik Stok"
              value={lowStockItems}
              prefix={<WarningOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card className={styles.statCard}>
            <Statistic
              title="Stokta Yok"
              value={outOfStockItems}
              prefix={<MinusCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className={styles.filterCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="large">
              <DatabaseOutlined style={{ fontSize: 24, color: '#1a4686' }} />
              <div>
                <Text strong style={{ fontSize: 18 }}>
                  {isStockCountRoute ? 'Stok Sayım' : isLowStockRoute ? 'Kritik Stok' : 'Stok Listesi'}
                </Text>
                <br />
                <Text type="secondary">
                  {isStockCountRoute
                    ? 'Stok sayımı'
                    : isLowStockRoute
                    ? 'Kritik stok takibi'
                    : 'Depo envanter yönetimi'}
                </Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Stok / Raf Ara..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Select
                placeholder="Depo Seç"
                style={{ width: 150 }}
                allowClear
                value={selectedWarehouse}
                onChange={setSelectedWarehouse}
                options={[
                  { value: 'Ana Depo', label: 'Ana Depo' },
                  { value: 'Yedek Depo', label: 'Yedek Depo' },
                ]}
              />
              <Button type="primary" icon={<PlusOutlined />}>
                Stok Girişi
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredInventory}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredInventory.length,
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
          scroll={{ x: 1200 }}
          size="small"
          rowClassName={(record) =>
            record.quantity === 0
              ? styles.outOfStock
              : record.quantity <= 5
              ? styles.lowStock
              : ''
          }
        />
      </Card>

      {/* Adjust Modal */}
      <Modal
        title="Stok Düzeltme"
        open={isAdjustModalOpen}
        onOk={handleAdjustSave}
        onCancel={() => setIsAdjustModalOpen(false)}
        okText="Kaydet"
        cancelText="İptal"
      >
        <Form form={adjustForm} layout="vertical">
          <Form.Item label="Ürün">
            <Text strong>{selectedItem?.product?.name || '-'}</Text>
          </Form.Item>
          <Form.Item label="Raf">
            <Tag color="blue">{selectedItem?.location?.code || '-'}</Tag>
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="currentQuantity" label="Mevcut Miktar">
                <InputNumber style={{ width: '100%' }} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="newQuantity"
                label="Yeni Miktar"
                rules={[{ required: true, message: 'Miktar gerekli' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="reason"
            label="Düzeltme Nedeni"
            rules={[{ required: true, message: 'Neden gerekli' }]}
          >
            <Select
              placeholder="Neden seçin"
              options={[
                { value: 'sayim', label: 'Sayım Farkı' },
                { value: 'hasar', label: 'Hasar' },
                { value: 'kayip', label: 'Kayıp' },
                { value: 'diger', label: 'Diğer' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Transfer Modal */}
      <Modal
        title="Stok Transfer"
        open={isTransferModalOpen}
        onOk={handleTransferSave}
        onCancel={() => setIsTransferModalOpen(false)}
        okText="Transfer Et"
        cancelText="İptal"
      >
        <Form form={transferForm} layout="vertical">
          <Form.Item label="Ürün">
            <Text strong>{selectedItem?.product?.name || '-'}</Text>
          </Form.Item>
          <Form.Item label="Kaynak Raf">
            <Tag color="blue">{selectedItem?.location?.code || '-'}</Tag>
            <Text type="secondary" style={{ marginLeft: 8 }}>
              (Mevcut: {selectedItem?.quantity || 0})
            </Text>
          </Form.Item>
          <Form.Item
            name="targetLocation"
            label="Hedef Raf"
            rules={[{ required: true, message: 'Hedef raf gerekli' }]}
          >
            <Select
              placeholder="Raf seçin"
              showSearch
              options={[
                { value: 'A-01-01', label: 'A-01-01' },
                { value: 'A-01-02', label: 'A-01-02' },
                { value: 'B-01-01', label: 'B-01-01' },
                { value: 'B-02-01', label: 'B-02-01' },
                { value: 'C-01-01', label: 'C-01-01' },
              ]}
            />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Transfer Miktarı"
            rules={[{ required: true, message: 'Miktar gerekli' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={1}
              max={selectedItem?.quantity || 1}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
