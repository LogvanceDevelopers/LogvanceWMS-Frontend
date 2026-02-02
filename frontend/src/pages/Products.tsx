import { useState, useEffect } from 'react'
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
  Upload,
  InputNumber,
  Popconfirm,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
  BarcodeOutlined,
  AppstoreOutlined,
} from '@ant-design/icons'
import type { ColumnsType } from 'antd/es/table'
import styles from './Products.module.css'
import { productsApi } from '../api'
import type { Product } from '../types'

const { Text } = Typography
const { TextArea } = Input

export default function Products() {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form] = Form.useForm()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productsApi.getAll()
      // API returns PaginatedResponse, extract items
      const items = 'items' in response ? response.items : (response as any)
      setProducts(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Failed to load products:', error)
      message.error('Ürünler yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingProduct(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  const handleEdit = (record: Product) => {
    setEditingProduct(record)
    form.setFieldsValue(record)
    setIsModalOpen(true)
  }

  const handleDelete = async (record: Product) => {
    try {
      await productsApi.delete(record.id)
      message.success(`${record.name} silindi`)
      loadProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      message.error('Ürün silinirken bir hata oluştu')
    }
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      if (editingProduct) {
        // Update
        await productsApi.update(editingProduct.id, values)
        message.success('Stok kartı güncellendi')
      } else {
        // Create
        await productsApi.create(values)
        message.success('Stok kartı eklendi')
      }
      setIsModalOpen(false)
      loadProducts()
    } catch (error) {
      console.error('Failed to save product:', error)
      message.error('Stok kartı kaydedilirken bir hata oluştu')
    }
  }

  const columns: ColumnsType<Product> = [
    {
      title: 'SN',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Stok Kodu',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
      sorter: (a, b) => a.sku.localeCompare(b.sku),
    },
    {
      title: 'Barkod',
      dataIndex: 'barcode',
      key: 'barcode',
      width: 140,
      render: (text) => (
        <Space>
          <BarcodeOutlined />
          {text}
        </Space>
      ),
    },
    {
      title: 'Stok Adı',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Kategori',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      filters: [
        { text: 'Kozmetik', value: 'Kozmetik' },
        { text: 'Takviye', value: 'Takviye' },
        { text: 'Medikal', value: 'Medikal' },
      ],
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Marka',
      dataIndex: 'brand',
      key: 'brand',
      width: 120,
    },
    {
      title: 'Birim',
      dataIndex: 'unitOfMeasure',
      key: 'unitOfMeasure',
      width: 80,
      align: 'center',
    },
    {
      title: 'Min. Stok',
      dataIndex: 'minStockLevel',
      key: 'minStockLevel',
      width: 90,
      align: 'center',
    },
    {
      title: 'Min. Stok',
      dataIndex: 'minStockLevel',
      key: 'minStockLevel',
      width: 100,
      align: 'center',
      sorter: (a, b) => (a.minStockLevel || 0) - (b.minStockLevel || 0),
    },
    {
      title: 'Durum',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      align: 'center',
      render: (value) => (
        <Tag color={value ? 'success' : 'default'}>
          {value ? 'Aktif' : 'Pasif'}
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
          <Tooltip title="Düzenle">
            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Stok kartını silmek istediğinize emin misiniz?"
            onConfirm={() => handleDelete(record)}
            okText="Sil"
            cancelText="İptal"
          >
            <Tooltip title="Sil">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !searchText ||
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchText.toLowerCase()) ||
      p.barcode.includes(searchText)
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className={styles.container}>
      {/* Header */}
      <Card className={styles.headerCard}>
        <Row gutter={[16, 16]} align="middle">
          <Col flex="auto">
            <Space size="large">
              <AppstoreOutlined style={{ fontSize: 24, color: '#1a4686' }} />
              <div>
                <Text strong style={{ fontSize: 18 }}>Stok Kartları</Text>
                <br />
                <Text type="secondary">Toplam {filteredProducts.length} kayıt</Text>
              </div>
            </Space>
          </Col>
          <Col>
            <Space>
              <Input
                placeholder="Stok Ara..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Select
                placeholder="Kategori"
                style={{ width: 150 }}
                allowClear
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={[
                  { value: 'Kozmetik', label: 'Kozmetik' },
                  { value: 'Takviye', label: 'Takviye' },
                  { value: 'Medikal', label: 'Medikal' },
                ]}
              />
              <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                Yeni Stok Kartı
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card className={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={filteredProducts}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredProducts.length,
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Toplam ${total} kayıt`,
          }}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingProduct ? 'Stok Kartı Düzenle' : 'Yeni Stok Kartı'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        okText="Kaydet"
        cancelText="İptal"
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sku"
                label="Stok Kodu"
                rules={[{ required: true, message: 'Stok kodu gerekli' }]}
              >
                <Input placeholder="Örn: NRD-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="barcode"
                label="Barkod"
                rules={[{ required: true, message: 'Barkod gerekli' }]}
              >
                <Input placeholder="Barkod numarası" prefix={<BarcodeOutlined />} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                name="name"
                label="Stok Adı"
                rules={[{ required: true, message: 'Stok adı gerekli' }]}
              >
                <Input placeholder="Ürün adı" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="category" label="Kategori">
                <Select
                  placeholder="Kategori seçin"
                  options={[
                    { value: 'Kozmetik', label: 'Kozmetik' },
                    { value: 'Takviye', label: 'Takviye' },
                    { value: 'Medikal', label: 'Medikal' },
                    { value: 'Gıda', label: 'Gıda' },
                    { value: 'Tekstil', label: 'Tekstil' },
                    { value: 'Diğer', label: 'Diğer' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="brand" label="Marka">
                <Input placeholder="Marka adı" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unitOfMeasure" label="Birim" initialValue="Adet">
                <Select
                  options={[
                    { value: 'Adet', label: 'Adet' },
                    { value: 'Kutu', label: 'Kutu' },
                    { value: 'Paket', label: 'Paket' },
                    { value: 'Kg', label: 'Kg' },
                    { value: 'Lt', label: 'Lt' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="weight" label="Ağırlık (kg)">
                <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="minStockLevel" label="Minimum Stok">
                <InputNumber style={{ width: '100%' }} min={0} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
