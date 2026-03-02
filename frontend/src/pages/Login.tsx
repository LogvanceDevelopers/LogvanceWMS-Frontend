import { Form, Input, Button, Card, Typography, Alert, Checkbox } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../hooks/useAuth'
import styles from './Login.module.css'

const { Title, Text } = Typography

export default function Login() {
  const { login, isLoading, error } = useAuth()
  const [form] = Form.useForm()

  const handleSubmit = async (values: { username: string; password: string; remember: boolean }) => {
    try {
      await login({ username: values.username, password: values.password })
      // Yönlendirme useAuth içinde yapılıyor
    } catch {
      // Error is handled in useAuth
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        <div className={styles.version}>V : 3.1.0</div>
        <div className={styles.formWrapper}>
          <div className={styles.logoSection}>
            <img 
              src="/logvance-logo.svg" 
              alt="Logvance" 
              className={styles.logo}
              onError={(e) => {
                e.currentTarget.src = '/vite.svg'
              }}
            />
            <Title level={3} className={styles.logoText}>LOGVANCE WMS</Title>
          </div>

          <div className={styles.formSection}>
            {error && (
              <Alert
                message={error}
                type="error"
                showIcon
                className={styles.alert}
              />
            )}

            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              initialValues={{ remember: false }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: 'Kullanıcı adınızı giriniz' }]}
              >
                <Input
                  prefix={<UserOutlined className={styles.inputIcon} />}
                  placeholder="Kullanıcı Adınız..."
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Şifrenizi giriniz' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className={styles.inputIcon} />}
                  placeholder="Şifreniz"
                  className={styles.input}
                />
              </Form.Item>

              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Beni Hatırla</Checkbox>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  block
                  className={styles.submitButton}
                >
                  {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                </Button>
              </Form.Item>

              {(import.meta.env.VITE_ADMIN_APP_URL || '/admin').trim() && (
                <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                  <a
                    href={(import.meta.env.VITE_ADMIN_APP_URL || '/admin').trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.adminLink}
                  >
                    Admin Paneli
                  </a>
                </Form.Item>
              )}
            </Form>

          </div>
        </div>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.backgroundImage} />
      </div>
    </div>
  )
}
