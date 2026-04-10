import type { User, Project, Task } from '../types';
import { seedUsers, seedProjects, seedTasks } from './data';
import { v4 as uuidv4 } from 'uuid';





interface StoredUser extends User {
  password: string;
}

class MockDatabase {
  users: StoredUser[];
  projects: Project[];
  tasks: Task[];

  constructor() {
    this.users = [...seedUsers];
    this.projects = [...seedProjects];
    this.tasks = [...seedTasks];
  }

  
  findUserByEmail(email: string): StoredUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string): StoredUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  createUser(name: string, email: string, password: string): StoredUser {
    const user: StoredUser = {
      id: uuidv4(),
      name,
      email,
      password,
      created_at: new Date().toISOString(),
    };
    this.users.push(user);
    return user;
  }

  getAllUsers(): User[] {
    
    return this.users.map(({ password, ...user }) => user);
  }

  
  getProjectsForUser(userId: string): Project[] {
    const taskProjectIds = this.tasks
      .filter((t) => t.assignee_id === userId)
      .map((t) => t.project_id);

    return this.projects.filter(
      (p) => p.owner_id === userId || taskProjectIds.includes(p.id)
    );
  }

  findProjectById(id: string): Project | undefined {
    return this.projects.find((p) => p.id === id);
  }

  createProject(name: string, description: string | undefined, ownerId: string): Project {
    const project: Project = {
      id: uuidv4(),
      name,
      description,
      owner_id: ownerId,
      created_at: new Date().toISOString(),
    };
    this.projects.push(project);
    return project;
  }

  updateProject(id: string, updates: Partial<Pick<Project, 'name' | 'description'>>): Project | null {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.projects[idx] = { ...this.projects[idx], ...updates };
    return this.projects[idx];
  }

  deleteProject(id: string): boolean {
    const idx = this.projects.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.projects.splice(idx, 1);
    
    this.tasks = this.tasks.filter((t) => t.project_id !== id);
    return true;
  }

  
  getTasksForProject(
    projectId: string,
    filters?: { status?: string; assignee?: string }
  ): Task[] {
    let tasks = this.tasks.filter((t) => t.project_id === projectId);
    if (filters?.status && filters.status !== 'all') {
      tasks = tasks.filter((t) => t.status === filters.status);
    }
    if (filters?.assignee && filters.assignee !== 'all') {
      tasks = tasks.filter((t) => t.assignee_id === filters.assignee);
    }
    return tasks;
  }

  findTaskById(id: string): Task | undefined {
    return this.tasks.find((t) => t.id === id);
  }

  createTask(
    projectId: string,
    data: {
      title: string;
      description?: string;
      priority?: string;
      assignee_id?: string | null;
      due_date?: string | null;
    }
  ): Task {
    const now = new Date().toISOString();
    const task: Task = {
      id: uuidv4(),
      title: data.title,
      description: data.description,
      status: 'todo',
      priority: (data.priority as Task['priority']) || 'medium',
      project_id: projectId,
      assignee_id: data.assignee_id || null,
      due_date: data.due_date || null,
      created_at: now,
      updated_at: now,
    };
    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updates: Record<string, unknown>): Task | null {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    this.tasks[idx] = {
      ...this.tasks[idx],
      ...(updates as Partial<Task>),
      updated_at: new Date().toISOString(),
    };
    return this.tasks[idx];
  }

  deleteTask(id: string): boolean {
    const idx = this.tasks.findIndex((t) => t.id === id);
    if (idx === -1) return false;
    this.tasks.splice(idx, 1);
    return true;
  }
}


export const db = new MockDatabase();
