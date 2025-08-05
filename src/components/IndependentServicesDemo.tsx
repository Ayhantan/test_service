import { useState } from 'react';
import {
  UserService,
  PostService,
  ProductService,
  NotificationService,
  SettingsService,
} from '../services';
import { ErrorHandler } from '../core/ErrorHandler';

interface ServiceStatus {
  loading: boolean;
  error: string | null;
  lastAction: string | null;
}

export function IndependentServicesDemo() {
  const [userStatus, setUserStatus] = useState<ServiceStatus>({ loading: false, error: null, lastAction: null });
  const [postStatus, setPostStatus] = useState<ServiceStatus>({ loading: false, error: null, lastAction: null });
  const [productStatus, setProductStatus] = useState<ServiceStatus>({ loading: false, error: null, lastAction: null });
  const [notificationStatus, setNotificationStatus] = useState<ServiceStatus>({ loading: false, error: null, lastAction: null });
  const [settingsStatus, setSettingsStatus] = useState<ServiceStatus>({ loading: false, error: null, lastAction: null });

  const [userResult, setUserResult] = useState<unknown>(null);
  const [postResult, setPostResult] = useState<unknown>(null);
  const [productResult, setProductResult] = useState<unknown>(null);
  const [notificationResult, setNotificationResult] = useState<unknown>(null);
  const [settingsResult, setSettingsResult] = useState<unknown>(null);

  const handleServiceCall = async (
    serviceName: string,
    action: string,
    serviceCall: () => Promise<unknown>,
    setStatus: React.Dispatch<React.SetStateAction<ServiceStatus>>,
    setResult: React.Dispatch<React.SetStateAction<unknown>>
  ) => {
    setStatus({ loading: true, error: null, lastAction: action });

    try {
      const result = await serviceCall();
      setResult(result);
      setStatus({ loading: false, error: null, lastAction: action });
    } catch (error) {
      const serviceError = await ErrorHandler.handleApiError(error); // ✅ AWAIT unutma
      const errorMessage = ErrorHandler.getErrorMessage(serviceError);
      setStatus({ loading: false, error: errorMessage, lastAction: action });
      ErrorHandler.logError(serviceError, `${serviceName}.${action}`);
    }
  };

  const testUserService = {
    getAll: () => handleServiceCall('UserService', 'getAll', () => UserService.getAll(), setUserStatus, setUserResult),
    getOne: () => handleServiceCall('UserService', 'getOne', () => UserService.getOne(1), setUserStatus, setUserResult),
    create: () => handleServiceCall('UserService', 'create', () =>
      UserService.create({ name: 'John Doe', email: 'john@example.com' }),
      setUserStatus, setUserResult),
    update: () => handleServiceCall('UserService', 'update', () =>
      UserService.update(1, { name: 'John Updated' }),
      setUserStatus, setUserResult),
  };

  const testPostService = {
    getAll: () => handleServiceCall('PostService', 'getAll', () => PostService.getAll(), setPostStatus, setPostResult),
    getOne: () => handleServiceCall('PostService', 'getOne', () => PostService.getOne(1), setPostStatus, setPostResult),
    create: () => handleServiceCall('PostService', 'create', () =>
      PostService.create({ title: 'Test Post', body: 'This is a test post content', userId: 1 }),
      setPostStatus, setPostResult),
    bulkCreate: () => handleServiceCall('PostService', 'bulkCreate', () =>
      PostService.bulkCreate([
        { title: 'Bulk Post 1', body: 'Content 1', userId: 1 },
        { title: 'Bulk Post 2', body: 'Content 2', userId: 1 }
      ]),
      setPostStatus, setPostResult),
  };

  const testProductService = {
    getAll: () => handleServiceCall('ProductService', 'getAll', () => ProductService.getAll(), setProductStatus, setProductResult),
    getOne: () => handleServiceCall('ProductService', 'getOne', () => ProductService.getOne(1), setProductStatus, setProductResult),
    getCategories: () => handleServiceCall('ProductService', 'getCategories', () => ProductService.getCategories(), setProductStatus, setProductResult),
    getLimited: () => handleServiceCall('ProductService', 'getLimited', () => ProductService.getLimited(5), setProductStatus, setProductResult),
  };

  const testNotificationService = {
    getAll: () => handleServiceCall('NotificationService', 'getAll', () => NotificationService.getAll(), setNotificationStatus, setNotificationResult),
    create: () => handleServiceCall('NotificationService', 'create', () =>
      NotificationService.create({ title: 'Test Notification', message: 'This is a test notification', type: 'info' }),
      setNotificationStatus, setNotificationResult),
    markAllAsRead: () => handleServiceCall('NotificationService', 'markAllAsRead', () => NotificationService.markAllAsRead(), setNotificationStatus, setNotificationResult),
    getStats: () => handleServiceCall('NotificationService', 'getStats', () => NotificationService.getStats(), setNotificationStatus, setNotificationResult),
  };

  const testSettingsService = {
    getUserSettings: () => handleServiceCall('SettingsService', 'getUserSettings', () => SettingsService.getUserSettings(1), setSettingsStatus, setSettingsResult),
    updateTheme: () => handleServiceCall('SettingsService', 'updateTheme', () => SettingsService.updateUserTheme(1, 'dark'), setSettingsStatus, setSettingsResult),
    getGlobalSettings: () => handleServiceCall('SettingsService', 'getGlobalSettings', () => SettingsService.getGlobalSettings(), setSettingsStatus, setSettingsResult),
    resetSettings: () => handleServiceCall('SettingsService', 'resetSettings', () => SettingsService.resetUserSettings(1), setSettingsStatus, setSettingsResult),
  };

  const ServiceSection = ({
    title,
    description,
    status,
    result,
    actions,
  }: {
    title: string;
    description: string;
    status: ServiceStatus;
    result: unknown;
    actions: { [key: string]: () => void };
  }) => (
    <div className="data-section">
      <h2>{title}</h2>
      <p style={{ color: '#7f8c8d', marginBottom: '1.5rem' }}>{description}</p>

      <div className="button-group" style={{ marginBottom: '1rem' }}>
        {Object.entries(actions).map(([actionName, actionFunction]) => (
          <button
            key={actionName}
            onClick={actionFunction}
            disabled={status.loading}
          >
            {status.loading && status.lastAction === actionName ? 'Loading...' : actionName}
          </button>
        ))}
      </div>

      {status.error && (
        <div className="error-container">
          <div className="error-message">{status.error}</div>
        </div>
      )}

      {status.loading && (
        <div className="loading-container">
          <div className="loading-spinner">Processing {status.lastAction}...</div>
        </div>
      )}

      {!!result && !status.loading && !status.error && (
        <div className="data-card">
          <h4>Result from {status.lastAction}:</h4>
          <pre style={{
            background: '#f8f9fa',
            padding: '1rem',
            borderRadius: '8px',
            overflow: 'auto',
            fontSize: '0.85rem',
            color: '#2c3e50'
          }}>
            {(() => {
              try {
                return typeof result === 'string'
                  ? result
                  : JSON.stringify(result, null, 2);
              } catch {
                return String(result);
              }
            })()}
          </pre>
        </div>
      )}
    </div>
  );

  return (
    <div className="service-demo">
      <h1>Independent Services Demo</h1>
      <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '1.1rem', marginBottom: '3rem' }}>
        Bu demo, Service Manager'ın birbirinden bağımsız farklı servisleri nasıl yönettiğini gösterir.
      </p>

      <ServiceSection
        title="👥 User Management Service"
        description="Kullanıcı yönetimi için CRUD işlemleri."
        status={userStatus}
        result={userResult}
        actions={testUserService}
      />

      <ServiceSection
        title="📝 Content Management Service"
        description="Blog yazıları ve içerik yönetimi."
        status={postStatus}
        result={postResult}
        actions={testPostService}
      />

      <ServiceSection
        title="🛍️ E-commerce Product Service"
        description="Ürün kataloğu yönetimi."
        status={productStatus}
        result={productResult}
        actions={testProductService}
      />

      <ServiceSection
        title="🔔 Notification Service"
        description="Bildirim yönetimi."
        status={notificationStatus}
        result={notificationResult}
        actions={testNotificationService}
      />

      <ServiceSection
        title="⚙️ Application Settings Service"
        description="Kullanıcı ve sistem ayarları."
        status={settingsStatus}
        result={settingsResult}
        actions={testSettingsService}
      />
    </div>
  );
}
