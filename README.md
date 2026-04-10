# TaskFlow — Frontend Engineer Submission

**TaskFlow** is a frontend-only task management application built to satisfy the Frontend Engineer assignment requirements. It is implemented with React, TypeScript, Vite, Material UI, and a browser-based mock API using MSW.

## Tech stack

- React + TypeScript
- Vite
- Material UI (MUI)
- React Router v7
- Mock Service Worker (MSW) for API mocking
- @dnd-kit for drag-and-drop interaction
- Docker for containerized frontend delivery

## What’s included

- Login and register screens with form validation
- Protected routes for authenticated UI flows
- Projects list with create/edit support
- Project detail view with task board and filters
- Task create/edit modal with status, priority, assignee, and due date
- Optimistic task updates for a fast experience
- Mobile-friendly responsive layout
- Clear loading, error, and empty states

## Running locally

From the repo root:

```bash
git clone https://github.com/heyimaaditya/taskflow-aaditya
cd taskflow
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Docker

This repository includes a frontend Docker service. To build the frontend image:

```bash
docker-compose build frontend
```

The root `docker-compose.yml` currently configures the frontend web application only, which matches the frontend-only submission scope.

## Mock API behavior

The frontend uses MSW to simulate the following endpoints from Appendix A:

- `POST /auth/register`
- `POST /auth/login`
- `GET /projects`
- `POST /projects`
- `GET /projects/:id`
- `PATCH /projects/:id`
- `DELETE /projects/:id`
- `GET /projects/:id/tasks`
- `POST /projects/:id/tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`

All mock responses are served from the browser, so no backend server is required for this submission.

## Notes on submission choices

- I chose **MSW** because it provides a real-feeling REST API for frontend development while keeping the submission frontend-only.
- I used **MUI** for a polished, accessible UI and fast responsive layout implementation.

## Test credentials

Use the mock auth flow to log in instantly:

```text
Email:    test@example.com
Password: password123
```

## What I’d improve with more time

- Add full end-to-end tests with Playwright or Cypress
- Add a backend implementation for a Full Stack submission
- Add pagination and task stats endpoint for larger projects
- Improve offline handling and persistence beyond in-memory MSW data
