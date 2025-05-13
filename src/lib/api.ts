/**
 * Utility for making API requests in Next.js
 */

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export async function fetchApi<T = any>(
  endpoint: string,
  method: RequestMethod = 'GET',
  body?: any,
  customHeaders: HeadersInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...customHeaders,
  };
  
  const options: RequestInit = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  
  if (!response.ok) {
    // Try to get error message from response
    let errorMessage = `Request failed with status ${response.status}`;
    
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // Ignore parsing error
    }
    
    throw new Error(errorMessage);
  }
  
  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }
  
  return response.json();
}

// Helper methods for common HTTP verbs
export const api = {
  get: <T = any>(endpoint: string, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, 'GET', undefined, headers),
    
  post: <T = any>(endpoint: string, data?: any, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, 'POST', data, headers),
    
  put: <T = any>(endpoint: string, data?: any, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, 'PUT', data, headers),
    
  patch: <T = any>(endpoint: string, data?: any, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, 'PATCH', data, headers),
    
  delete: <T = any>(endpoint: string, data?: any, headers?: HeadersInit) => 
    fetchApi<T>(endpoint, 'DELETE', data, headers),
};