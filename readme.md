ServiceManager Proje README.md

ServiceManager Template
Bu proje şablonu, herhangi bir uygulamada (React, Node, Next.js, mobil) tüm API çağrılarını tek noktadan, tip güvenli, retry, timeout, interceptor destekli şekilde yönetmek için tasarlanmıştır.

1. Klasör Yapısı
bash
Kopyala
Düzenle
src/
 ├── core/
 │    ├── ServiceManager.ts    # Tüm HTTP mantığı burada
 │    └── ApiClient.ts         # Singleton örneği
 ├── services/
 │    ├── UserService.ts       # Domain servisi örneği
 │    ├── ProductService.ts    # Yeni domain servisleri
 │    └── ...
 ├── App.tsx                   # UI örneği (React)

2. Nasıl Çalışır?
2.1 ServiceManager.ts
GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS destekler

postForm, putForm, patchForm ile dosya yükleme yapılabilir.

Retry ve Timeout parametreleri her istek için ayarlanabilir.

Request ve Response interceptors eklenebilir.

2.2 ApiClient.ts (Singleton)
ts
Kopyala
Düzenle
import { ServiceManager } from './ServiceManager';

export const ApiClient = new ServiceManager('https://jsonplaceholder.typicode.com');

// Örnek interceptor:
ApiClient.setRequestInterceptor(async (url, config) => {
  console.log('Request →', config.method, url);
  return [url, config];
});

ApiClient.setResponseInterceptor(async (response) => {
  console.log('Response →', response.status);
  return response;
});

2.3 Domain Service Örneği (UserService.ts)
import { ApiClient } from '../core/ApiClient';

3. UI'da Nasıl Kullanılır?
App.tsx içinde:


4. Projen Genişledikçe


5. Sık Sorulanlar

%100 saf TypeScript

Sıfır framework bağımlılığı

Her ortamda kullanabilir ? 