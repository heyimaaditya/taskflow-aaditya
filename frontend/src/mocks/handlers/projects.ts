import { http, HttpResponse } from 'msw';
import { db } from '../db';
import { parseToken } from './auth';

export const projectHandlers = [
  
  http.get('/projects', ({ request }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const projects = db.getProjectsForUser(auth.user_id);
    return HttpResponse.json({ projects });
  }),

  
  http.post('/projects', async ({ request }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const body = (await request.json()) as Record<string, string>;
    const { name, description } = body;

    const fields: Record<string, string> = {};
    if (!name || !name.trim()) fields.name = 'is required';

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json({ error: 'validation failed', fields }, { status: 400 });
    }

    const project = db.createProject(name.trim(), description?.trim(), auth.user_id);
    return HttpResponse.json(project, { status: 201 });
  }),

  
  http.get('/projects/:id', ({ request, params }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = db.findProjectById(params.id as string);
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    const tasks = db.getTasksForProject(project.id);
    return HttpResponse.json({ ...project, tasks });
  }),

  
  http.patch('/projects/:id', async ({ request, params }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = db.findProjectById(params.id as string);
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    if (project.owner_id !== auth.user_id) {
      return HttpResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const body = (await request.json()) as Record<string, string>;
    const updates: Record<string, string> = {};
    if (body.name !== undefined) updates.name = body.name.trim();
    if (body.description !== undefined) updates.description = body.description.trim();

    const updated = db.updateProject(params.id as string, updates);
    return HttpResponse.json(updated);
  }),

  
  http.delete('/projects/:id', ({ request, params }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = db.findProjectById(params.id as string);
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    if (project.owner_id !== auth.user_id) {
      return HttpResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    db.deleteProject(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),
];
