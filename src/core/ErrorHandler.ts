import { ServiceError } from './ServiceError';

export const ErrorHandler = {
  handleApiError: async (error: unknown): Promise<ServiceError> => {
    if (error instanceof ServiceError) {
      return error;
    }

    // Sadece native fetch için
    if (error instanceof Response) {
      const data = await error.json().catch(() => ({}));
      return new ServiceError(
        data?.message || error.statusText || 'API Error',
        error.status,
        data?.code,
        data
      );
    }

    // Timeout ya da iptal durumu
    if (error instanceof DOMException && error.name === 'AbortError') {
      return new ServiceError('İstek zaman aşımına uğradı', undefined, 'TIMEOUT');
    }

    if (error instanceof Error) {
      return new ServiceError(error.message, undefined, 'UNKNOWN_ERROR');
    }

    return new ServiceError('Unknown Error', undefined, 'UNKNOWN_ERROR');
  },

  logError: (error: ServiceError, context?: string) => {
    console.error(`[ERROR${context ? ` - ${context}` : ''}]:`, {
      message: error.message,
      status: error.status,
      code: error.code,
      details: error.details,
    });
  },

  getErrorMessage: (error: ServiceError): string => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'İnternet bağlantınızı kontrol edin';
      case 'TIMEOUT':
        return 'İstek zaman aşımına uğradı';
      case 'UNAUTHORIZED':
        return 'Yetkiniz bulunmuyor';
      case 'FORBIDDEN':
        return 'Bu işlem için izniniz yok';
      case 'NOT_FOUND':
        return 'Aradığınız kayıt bulunamadı';
      case 'VALIDATION_ERROR':
        return 'Girdiğiniz bilgileri kontrol edin';
      default:
        return error.message || 'Bir hata oluştu';
    }
  },
};
