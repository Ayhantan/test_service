// src/services/index.ts
// Central export file for all independent services

// User Management
export { UserService, type User } from './UserService';

// Content Management
export { PostService, type Post, type CreatePost } from './PostService';
export { CommentService, type Comment, type CreateComment } from './CommentService';

// E-commerce
export { ProductService, type Product, type CreateProduct } from './ProductService';

// Notifications
export { NotificationService, type Notification, type CreateNotification } from './NotificationService';

// Application Settings
export { SettingsService, type AppSettings, type UpdateSettings } from './SettingsService';

// Export ApiClient for direct usage when needed
export { ApiClient } from '../core/ApiClient';

// Export Service Manager for creating new instances
export { ServiceManager } from '../core/ServiceManager';


export { ErrorHandler} from '../core/ErrorHandler';
export { ServiceError} from '../core/ServiceError';
