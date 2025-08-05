# Service Manager App

Bu proje, herhangi bir React uygulamasının tüm API çağrılarını etkili bir şekilde yöneten, esnek ve basit bir servis yöneticisi (Service Manager) içerir.

## Özellikler

✅ **TypeScript Desteği**: Tam tip güvenliği ile API yanıtları
✅ **Modüler Yapı**: Her servis ayrı dosyada, temiz organizasyon
✅ **Hata Yönetimi**: Kapsamlı error handling ve kullanıcı dostu mesajlar
✅ **Loading States**: Her API çağrısı için loading durumu yönetimi
✅ **Retry Mekanizması**: Başarısız istekler için otomatik yeniden deneme
✅ **Request/Response Interceptors**: İstekleri ve yanıtları yakalama
✅ **Environment Configuration**: Farklı ortamlar için yapılandırma
✅ **FormData Desteği**: Dosya yükleme ve form verileri
✅ **React Admin Hazır**: React Admin ile entegrasyon için hazır
✅ **Demo Sayfası**: Tüm özellikleri gösteren interaktif demo

## Proje Yapısı

```
src/
├── core/
│   ├── ServiceManager.ts    # Ana servis yöneticisi sınıfı
│   ├── ApiClient.ts         # Yapılandırılmış API istemcisi
│   └── ErrorHandler.ts      # Hata yönetimi
├── services/
│   ├── index.ts            # Tüm servislerin merkezi export'u
│   ├── UserService.ts      # Kullanıcı işlemleri
│   ├── PostService.ts      # Post işlemleri
│   └── CommentService.ts   # Yorum işlemleri
├── components/
│   └── ServiceDemo.tsx     # Demo bileşeni
├── config/
│   └── api.config.ts       # API yapılandırması
└── App.tsx
```

## Kullanım

### 1. Basit API Çağrısı

```typescript
import { UserService } from './services';

// Kullanıcıları listele
const users = await UserService.getAll();

// Tek kullanıcı getir
const user = await UserService.getOne(1);

// Yeni kullanıcı oluştur
const newUser = await UserService.create({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### 2. Hata Yönetimi ile

```typescript
import { UserService, ErrorHandler } from './services';

try {
  const users = await UserService.getAll();
  setUsers(users);
} catch (error) {
  const serviceError = ErrorHandler.handleApiError(error);
  const userMessage = ErrorHandler.getErrorMessage(serviceError);
  setError(userMessage);
}
```

### 3. Loading State ile

```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const fetchUsers = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const users = await UserService.getAll();
    setUsers(users);
  } catch (error) {
    const serviceError = ErrorHandler.handleApiError(error);
    setError(ErrorHandler.getErrorMessage(serviceError));
  } finally {
    setLoading(false);
  }
};
```

### 4. Yeni Servis Ekleme

```typescript
// src/services/ProductService.ts
import { ApiClient } from '../core/ApiClient';

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

export const ProductService = {
  getAll: () => ApiClient.get<Product[]>('/products'),
  getOne: (id: number) => ApiClient.get<Product>(`/products/${id}`),
  create: (product: Omit<Product, 'id'>) => 
    ApiClient.post<Product>('/products', product),
  update: (id: number, data: Partial<Product>) =>
    ApiClient.put<Product>(`/products/${id}`, data),
  delete: (id: number) => ApiClient.delete(`/products/${id}`),
};
```

## Yapılandırma

### Environment Variables

`.env` dosyasında aşağıdaki değişkenleri kullanabilirsiniz:

```env
VITE_API_BASE_URL=https://your-api.com
VITE_API_TIMEOUT=10000
VITE_API_RETRIES=3
```

### API Interceptors

```typescript
import { ApiClient } from './core/ApiClient';

// Request interceptor - örneğin auth token ekleme
ApiClient.setRequestInterceptor(async (url, config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }
  return [url, config];
});

// Response interceptor - örneğin global error handling
ApiClient.setResponseInterceptor(async (response) => {
  if (response.status === 401) {
    // Token expired, redirect to login
    window.location.href = '/login';
  }
  return response;
});
```

## ServiceManager API

### HTTP Metodları

```typescript
// GET
const data = await ApiClient.get<Type>('/endpoint');

// POST
const result = await ApiClient.post<ResultType, DataType>('/endpoint', data);

// PUT
const result = await ApiClient.put<ResultType, DataType>('/endpoint', data);

// PATCH
const result = await ApiClient.patch<ResultType, DataType>('/endpoint', data);

// DELETE
await ApiClient.delete('/endpoint');

// FormData
const formData = new FormData();
formData.append('file', file);
const result = await ApiClient.postForm<ResultType>('/upload', formData);
```

### Konfigürasyon Seçenekleri

```typescript
const result = await ApiClient.get('/endpoint', {
  retries: 3,        // Yeniden deneme sayısı
  timeoutMs: 5000,   // Timeout süresi
  headers: {         // Ek header'lar
    'Custom-Header': 'value'
  }
});
```

## Demo Çalıştırma

```bash
# Projeyi klonla
git clone [repo-url]

# Bağımlılıkları yükle
npm install

# Development server'ı başlat
npm run dev

# Browser'da http://localhost:5173 adresini aç
```

## Özellikler Detayı

### ✅ Efektif ve Basit Modül
- Tek bir `ServiceManager` sınıfı tüm HTTP işlemlerini yönetir
- Basit ve anlaşılır API
- Minimum kod ile maksimum işlevsellik

### ✅ Hook Kullanmayan Yapı
- React hook'larına bağımlı değil
- Vanilla JavaScript/TypeScript service layer
- İstenirse daha sonra hook'lar eklenebilir

### ✅ Service Infrastructure
- Modüler servis yapısı
- Her API endpoint'i için ayrı service
- Kolay genişletilebilir

### ✅ Esnek ve Duplicate Olmayan
- DRY (Don't Repeat Yourself) prensibi
- Tek bir ServiceManager instance'ı
- Yeniden kullanılabilir kod

### ✅ API Çağrıları Yönetimi
- Otomatik retry mekanizması
- Timeout kontrolü
- Request/Response interceptors
- Error handling

### ✅ Tip Güvenliği
- TypeScript ile tam tip desteği
- API response'ları için interface'ler
- Runtime'da tip kontrolü

Bu service manager, herhangi bir React uygulamasının API ihtiyaçlarını karşılamak için tasarlanmıştır ve kolayca entegre edilebilir.
