// src/services/ProductService.ts
import { ApiClient } from '../core/ApiClient';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CreateProduct {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export const ProductService = {
  // Use fakestoreapi for products (different from jsonplaceholder)
  getAll: () => ApiClient.request<Product[]>({
    url: '/products',
    method: 'GET'
  }),
  
  getOne: (id: number) => ApiClient.request<Product>({
    url: `/products/${id}`,
    method: 'GET'
  }),
  
  getCategories: () => ApiClient.request<string[]>({
    url: '/products/categories',
    method: 'GET'
  }),
  
  getByCategory: (category: string) => ApiClient.request<Product[]>({
    url: `/products/category/${category}`,
    method: 'GET'
  }),
  
  create: (product: CreateProduct) => 
    ApiClient.post<Product, CreateProduct>('/products', product),
  
  update: (id: number, data: Partial<Product>) =>
    ApiClient.put<Product, Partial<Product>>(`/products/${id}`, data),
    
  delete: (id: number) => ApiClient.delete(`/products/${id}`),
  
  // Bulk operations
  getLimited: (limit: number) => ApiClient.request<Product[]>({
    url: `/products?limit=${limit}`,
    method: 'GET'
  }),
  
  getSorted: (sort: 'asc' | 'desc') => ApiClient.request<Product[]>({
    url: `/products?sort=${sort}`,
    method: 'GET'
  }),
};
