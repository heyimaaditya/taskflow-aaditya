import { http, HttpResponse } from 'msw';
import { db } from '../db';


function createToken(userId: string, email: string): string {
  const payload = {
    user_id: userId,
    email,
    exp: Date.now() + 24 * 60 * 60 * 1000, 
  };
  return btoa(JSON.stringify(payload));
}

export function parseToken(authHeader: string | null): { user_id: string; email: string } | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    const token = authHeader.replace('Bearer ', '');
    const payload = JSON.parse(atob(token));
    if (payload.exp < Date.now()) return null;
    return { user_id: payload.user_id, email: payload.email };
  } catch {
    return null;
  }
}

export const authHandlers = [
  
  http.post('/auth/register', async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    const { name, email, password } = body;

    
    const fields: Record<string, string> = {};
    if (!name || !name.trim()) fields.name = 'is required';
    if (!email || !email.trim()) fields.email = 'is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.email = 'is invalid';
    if (!password) fields.password = 'is required';
    else if (password.length < 6) fields.password = 'must be at least 6 characters';

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json({ error: 'validation failed', fields }, { status: 400 });
    }

    
    if (db.findUserByEmail(email)) {
      return HttpResponse.json(
        { error: 'validation failed', fields: { email: 'already exists' } },
        { status: 400 }
      );
    }

    const user = db.createUser(name.trim(), email.trim().toLowerCase(), password);
    const token = createToken(user.id, user.email);

    return HttpResponse.json(
      {
        token,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 201 }
    );
  }),

  
  http.post('/auth/login', async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    const { email, password } = body;

    
    const fields: Record<string, string> = {};
    if (!email || !email.trim()) fields.email = 'is required';
    if (!password) fields.password = 'is required';

    if (Object.keys(fields).length > 0) {
      return HttpResponse.json({ error: 'validation failed', fields }, { status: 400 });
    }

    const user = db.findUserByEmail(email.trim().toLowerCase());
    if (!user || user.password !== password) {
      return HttpResponse.json({ error: 'invalid credentials' }, { status: 401 });
    }

    const token = createToken(user.id, user.email);

    return HttpResponse.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  }),
];
