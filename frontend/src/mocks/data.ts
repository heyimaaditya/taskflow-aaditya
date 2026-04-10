import type { User, Project, Task } from '../types';


export const seedUsers: (User & { password: string })[] = [
  {
    id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    created_at: '2026-04-01T08:00:00Z',
  },
  {
    id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    name: 'Jane Cooper',
    email: 'jane@example.com',
    password: 'password123',
    created_at: '2026-04-02T09:00:00Z',
  },
  {
    id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    password: 'password123',
    created_at: '2026-04-03T10:00:00Z',
  },
];


export const seedProjects: Project[] = [
  {
    id: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website for Q2 launch. Focus on modern UI, performance, and mobile responsiveness.',
    owner_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    created_at: '2026-04-01T10:00:00Z',
  },
  {
    id: 'p2b3c4d5-e6f7-8901-bcde-f12345678901',
    name: 'Mobile App MVP',
    description: 'Build the first version of our mobile application with core features.',
    owner_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    created_at: '2026-04-05T14:00:00Z',
  },
];


export const seedTasks: Task[] = [
  {
    id: 't1a2b3c4-d5e6-7890-abcd-ef1234567890',
    title: 'Design homepage mockups',
    description: 'Create high-fidelity mockups for the new homepage including hero section, features grid, and testimonials.',
    status: 'in_progress',
    priority: 'high',
    project_id: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    assignee_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    due_date: '2026-04-15',
    created_at: '2026-04-01T11:00:00Z',
    updated_at: '2026-04-08T15:30:00Z',
  },
  {
    id: 't2b3c4d5-e6f7-8901-bcde-f12345678901',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing and deployment to staging.',
    status: 'todo',
    priority: 'low',
    project_id: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    assignee_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    due_date: '2026-04-20',
    created_at: '2026-04-02T09:00:00Z',
    updated_at: '2026-04-02T09:00:00Z',
  },
  {
    id: 't3c4d5e6-f7a8-9012-cdef-123456789012',
    title: 'Implement responsive navigation',
    description: 'Build the navigation component with mobile hamburger menu and desktop mega-menu.',
    status: 'done',
    priority: 'medium',
    project_id: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    assignee_id: 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    due_date: '2026-04-10',
    created_at: '2026-04-03T10:00:00Z',
    updated_at: '2026-04-09T16:00:00Z',
  },
  {
    id: 't4d5e6f7-a8b9-0123-defa-234567890123',
    title: 'Write API documentation',
    description: 'Document all REST endpoints with request/response examples using OpenAPI spec.',
    status: 'todo',
    priority: 'medium',
    project_id: 'p1a2b3c4-d5e6-7890-abcd-ef1234567890',
    assignee_id: null,
    due_date: '2026-04-25',
    created_at: '2026-04-04T11:00:00Z',
    updated_at: '2026-04-04T11:00:00Z',
  },
  {
    id: 't5e6f7a8-b9c0-1234-efab-345678901234',
    title: 'Design app onboarding flow',
    description: 'Create wireframes and user flow for the mobile app onboarding experience.',
    status: 'todo',
    priority: 'high',
    project_id: 'p2b3c4d5-e6f7-8901-bcde-f12345678901',
    assignee_id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    due_date: '2026-04-18',
    created_at: '2026-04-05T15:00:00Z',
    updated_at: '2026-04-05T15:00:00Z',
  },
  {
    id: 't6f7a8b9-c0d1-2345-fabc-456789012345',
    title: 'Implement auth screens',
    description: 'Build login, register, and forgot password screens for the mobile app.',
    status: 'in_progress',
    priority: 'high',
    project_id: 'p2b3c4d5-e6f7-8901-bcde-f12345678901',
    assignee_id: 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    due_date: '2026-04-16',
    created_at: '2026-04-06T09:00:00Z',
    updated_at: '2026-04-09T11:00:00Z',
  },
];
