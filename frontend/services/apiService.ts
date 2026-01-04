// services/apiService.ts

// Hardcode API_BASE_URL to '/api' to rely on the Vite proxy.
const API_BASE_URL = '/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: { msg: string }[]; // For express-validator errors
}

const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

async function request<T>(
  endpoint: string,
  method: string,
  body: unknown = null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      let errorToThrow: Error;

      try {
        // Try to parse JSON error from backend
        const errorResult = await response.json();
        errorToThrow = new Error(
          errorResult.message ||
            errorResult.error ||
            `API Error: ${response.status} ${response.statusText}`
        );
        (errorToThrow as any).data = errorResult;
      } catch {
        // Not JSON
        errorToThrow = new Error(
          `API Error: ${response.status} ${response.statusText}`
        );
      }

      throw errorToThrow;
    }

    // Handle 204 / empty body
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    const result: ApiResponse<T> = JSON.parse(text);

    if (!result.success) {
      const error = new Error(
        result.message || result.error || 'An unknown API error occurred'
      );
      (error as any).data = result;
      throw error;
    }

    // If backend intentionally returns no data with success: true
    if (result.data === undefined) {
      return (method === 'GET' ? (null as any) : ({} as any)) as T;
    }

    return result.data as T;
  } catch (error: any) {
    // Network / connection errors
    if (error instanceof TypeError) {
      const networkError = new Error(
        'Cannot connect to the server. Please check your network connection and try again.'
      );
      (networkError as any).data = { isNetworkError: true };
      throw networkError;
    }

    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw error;
  }
}

const apiService = {
  get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, 'GET');
  },

  post<T>(endpoint: string, body: unknown): Promise<T> {
    return request<T>(endpoint, 'POST', body);
  },

  put<T>(endpoint: string, body: unknown): Promise<T> {
    return request<T>(endpoint, 'PUT', body);
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, 'DELETE');
  },
};

export default apiService;
