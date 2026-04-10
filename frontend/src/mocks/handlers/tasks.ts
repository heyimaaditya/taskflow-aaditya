import { http, HttpResponse } from 'msw';
import { db } from '../db';
import { parseToken } from './auth';

export const taskHandlers = [
  
  http.get('/projects/:id/tasks', ({ request, params }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = db.findProjectById(params.id as string);
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const assignee = url.searchParams.get('assignee') || undefined;

    const tasks = db.getTasksForProject(params.id as string, { status, assignee });
    return HttpResponse.json({ tasks });
  }),

  
  http.post('/projects/:id/tasks', async ({ request, params }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const project = db.findProjectById(params.id as string);
    if (!project) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const { title, description, priority, assignee_id, due_date } = body;

    const fields: Record<string, string> = {};
    if (!title || !(title as string).trim()) fields.title = 'is required';
    if (priority && !['low', 'medium', 'high'].includes(priority as string)) {
      fields.priority = 'must be low, medium, or high';
    }

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json({ error: 'validation failed', fields }, { status: 400 });
    }

    const task = db.createTask(params.id as string, {
      title: (title as string).trim(),
      description: description as string | undefined,
      priority: priority as string | undefined,
      assignee_id: assignee_id as string | null | undefined,
      due_date: due_date as string | null | undefined,
    });

    return HttpResponse.json(task, { status: 201 });
  }),

  
  http.patch('/tasks/:id', async ({ request, params }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const task = db.findTaskById(params.id as string);
    if (!task) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const updates: Record<string, unknown> = {};

    if (body.title !== undefined) updates.title = (body.title as string).trim();
    if (body.description !== undefined) updates.description = body.description;
    if (body.status !== undefined) {
      if (!['todo', 'in_progress', 'done'].includes(body.status as string)) {
        return HttpResponse.json(
          { error: 'validation failed', fields: { status: 'must be todo, in_progress, or done' } },
          { status: 400 }
        );
      }
      updates.status = body.status;
    }
    if (body.priority !== undefined) {
      if (!['low', 'medium', 'high'].includes(body.priority as string)) {
        return HttpResponse.json(
          { error: 'validation failed', fields: { priority: 'must be low, medium, or high' } },
          { status: 400 }
        );
      }
      updates.priority = body.priority;
    }
    if (body.assignee_id !== undefined) updates.assignee_id = body.assignee_id;
    if (body.due_date !== undefined) updates.due_date = body.due_date;

    const updated = db.updateTask(params.id as string, updates);
    return HttpResponse.json(updated);
  }),

  
  http.delete('/tasks/:id', ({ request, params }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const task = db.findTaskById(params.id as string);
    if (!task) {
      return HttpResponse.json({ error: 'not found' }, { status: 404 });
    }

    db.deleteTask(params.id as string);
    return new HttpResponse(null, { status: 204 });
  }),

  
  http.get('/users', ({ request }) => {
    const auth = parseToken(request.headers.get('Authorization'));
    if (!auth) {
      return HttpResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const users = db.getAllUsers();
    return HttpResponse.json({ users });
  }),
];
