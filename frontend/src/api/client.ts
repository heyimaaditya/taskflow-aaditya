import type { ApiError } from '../types';

const API_BASE = '';

class ApiClient {
  private getToken(): string | null {
    return localStorage.getItem('taskflow-token');
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    requiresAuth = true
  ): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 204) {
      return undefined as T;
    }

    const data = await response.json();

    if (!response.ok) {
      const error = data as ApiError;
      if (response.status === 401) {
        localStorage.removeItem('taskflow-token');
        localStorage.removeItem('taskflow-user');
        window.location.href = '/login';
      }
      throw new ApiClientError(
        error.error || 'An error occurred',
        response.status,
        error.fields
      );
    }

    return data as T;
  }

  async login(email: string, password: string) {
    return this.request<import('../types').AuthResponse>(
      'POST',
      '/auth/login',
      { email, password },
      false
    );
  }

  async register(name: string, email: string, password: string) {
    return this.request<import('../types').AuthResponse>(
      'POST',
      '/auth/register',
      { name, email, password },
      false
    );
  }

  async getProjects() {
    return this.request<{ projects: import('../types').Project[] }>('GET', '/projects');
  }

  async getProject(id: string) {
    return this.request<import('../types').ProjectWithTasks>('GET', `/projects/${id}`);
  }

  async createProject(data: import('../types').CreateProjectRequest) {
    return this.request<import('../types').Project>('POST', '/projects', data);
  }

  async updateProject(id: string, data: import('../types').UpdateProjectRequest) {
    return this.request<import('../types').Project>('PATCH', `/projects/${id}`, data);
  }

  async deleteProject(id: string) {
    return this.request<void>('DELETE', `/projects/${id}`);
  }

  async getTasks(projectId: string, filters?: { status?: string; assignee?: string }) {
    const params = new URLSearchParams();
    if (filters?.status && filters.status !== 'all') params.set('status', filters.status);
    if (filters?.assignee && filters.assignee !== 'all') params.set('assignee', filters.assignee);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ tasks: import('../types').Task[] }>(
      'GET',
      `/projects/${projectId}/tasks${query}`
    );
  }

  async createTask(projectId: string, data: import('../types').CreateTaskRequest) {
    return this.request<import('../types').Task>(
      'POST',
      `/projects/${projectId}/tasks`,
      data
    );
  }

  async updateTask(id: string, data: import('../types').UpdateTaskRequest) {
    return this.request<import('../types').Task>('PATCH', `/tasks/${id}`, data);
  }

  async deleteTask(id: string) {
    return this.request<void>('DELETE', `/tasks/${id}`);
  }
}

export class ApiClientError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.fields = fields;
  }
}

export const apiClient = new ApiClient();
