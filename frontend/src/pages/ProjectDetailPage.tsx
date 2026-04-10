import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type {
  Task,
  TaskStatus,
  TaskPriority,
  ProjectWithTasks,
  User,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '../types';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Badge,
  Fade,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Autocomplete,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Flag,
  CalendarToday,
  CheckCircleOutlined,
  RadioButtonUnchecked,
  PlayCircleOutlined,
  ArrowBack,
  FilterList,
  AssignmentOutlined,
  Close,
} from '@mui/icons-material';
import { format, isPast, parseISO } from 'date-fns';


const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode; bgColor: string }> = {
  todo: {
    label: 'To Do',
    color: '#6B7280',
    icon: <RadioButtonUnchecked sx={{ fontSize: 18 }} />,
    bgColor: 'rgba(107, 114, 128, 0.08)',
  },
  in_progress: {
    label: 'In Progress',
    color: '#3B82F6',
    icon: <PlayCircleOutlined sx={{ fontSize: 18 }} />,
    bgColor: 'rgba(59, 130, 246, 0.08)',
  },
  done: {
    label: 'Done',
    color: '#10B981',
    icon: <CheckCircleOutlined sx={{ fontSize: 18 }} />,
    bgColor: 'rgba(16, 185, 129, 0.08)',
  },
};

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  high: { label: 'High', color: '#EF4444' },
  medium: { label: 'Medium', color: '#F59E0B' },
  low: { label: 'Low', color: '#10B981' },
};


interface SortableTaskCardProps {
  task: Task;
  users: User[];
  onClick: () => void;
}

const SortableTaskCard: React.FC<SortableTaskCardProps> = ({ task, users, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { task } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const assignee = users.find((u) => u.id === task.assignee_id);
  const isOverdue = task.due_date && isPast(parseISO(task.due_date)) && task.status !== 'done';

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      sx={{
        mb: 1.5,
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' },
        borderLeft: `3px solid ${PRIORITY_CONFIG[task.priority].color}`,
        '&:hover': {
          transform: isDragging ? undefined : 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1,
            lineHeight: 1.4,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontWeight: 600,
          }}
        >
          {task.title}
        </Typography>

        {task.description && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
            component="p"
          >
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
      
          <Chip
            icon={<Flag sx={{ fontSize: 14 }} />}
            label={PRIORITY_CONFIG[task.priority].label}
            size="small"
            sx={{
              height: 24,
              fontSize: '0.7rem',
              bgcolor: `${PRIORITY_CONFIG[task.priority].color}18`,
              color: PRIORITY_CONFIG[task.priority].color,
              border: 'none',
              '& .MuiChip-icon': { color: 'inherit' },
            }}
          />

      
          {task.due_date && (
            <Chip
              icon={<CalendarToday sx={{ fontSize: 12 }} />}
              label={format(parseISO(task.due_date), 'MMM d')}
              size="small"
              sx={{
                height: 24,
                fontSize: '0.7rem',
                bgcolor: isOverdue ? 'rgba(239, 68, 68, 0.1)' : 'action.hover',
                color: isOverdue ? 'error.main' : 'text.secondary',
                '& .MuiChip-icon': { color: 'inherit', fontSize: 12 },
              }}
            />
          )}

          <Box sx={{ flexGrow: 1 }} />

      
          {assignee && (
            <Tooltip title={assignee.name}>
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: '0.65rem',
                  bgcolor: 'primary.main',
                }}
              >
                {assignee.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)}
              </Avatar>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};


const TaskCardOverlay: React.FC<{ task: Task; users: User[] }> = ({ task, users }) => {
  const assignee = users.find((u) => u.id === task.assignee_id);
  return (
    <Card
      sx={{
        width: 280,
        cursor: 'grabbing',
        borderLeft: `3px solid ${PRIORITY_CONFIG[task.priority].color}`,
        boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
        transform: 'rotate(3deg)',
      }}
    >
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          {task.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label={PRIORITY_CONFIG[task.priority].label}
            size="small"
            sx={{ height: 22, fontSize: '0.7rem' }}
          />
          {assignee && (
            <Avatar sx={{ width: 22, height: 22, fontSize: '0.6rem', bgcolor: 'primary.main' }}>
              {assignee.name.charAt(0)}
            </Avatar>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};


interface DroppableColumnProps {
  status: TaskStatus;
  columnTasks: Task[];
  users: User[];
  openEditDialog: (task: Task) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ status, columnTasks, users, openEditDialog }) => {
  const { setNodeRef } = useDroppable({ id: status });

  return (
    <Box
      ref={setNodeRef}
      id={`column-${status}`}
      data-status={status}
      sx={{
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
        borderRadius: 3,
        p: 1.5,
        minHeight: 200,
        transition: 'background-color 0.2s',
      }}
    >
      {columnTasks.map((task) => (
        <SortableTaskCard key={task.id} task={task} users={users} onClick={() => openEditDialog(task)} />
      ))}
      {columnTasks.length === 0 && (
        <Box sx={{ py: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Drop tasks here
          </Typography>
        </Box>
      )}
    </Box>
  );
};


const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [project, setProject] = useState<ProjectWithTasks | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);


  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');


  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
    status: 'todo' as TaskStatus,
    assignee_id: '' as string,
    due_date: '',
  });
  const [taskFormErrors, setTaskFormErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);


  const [editProjectOpen, setEditProjectOpen] = useState(false);
  const [editProjectName, setEditProjectName] = useState('');
  const [editProjectDesc, setEditProjectDesc] = useState('');


  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);


  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);


  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projectRes, usersRes] = await Promise.all([
        fetch(`/projects/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/users', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const projectData = await projectRes.json();
      const usersData = await usersRes.json();

      if (!projectRes.ok) throw new Error(projectData.error);

      setProject(projectData);
      setTasks(projectData.tasks || []);
      setUsers(usersData.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project');
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const filteredTasks = tasks.filter((t) => {
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;
    if (assigneeFilter !== 'all' && t.assignee_id !== assigneeFilter) return false;
    return true;
  });

  const getTasksByStatus = (status: TaskStatus) =>
    filteredTasks.filter((t) => t.status === status);

  const openCreateDialog = () => {
    setEditingTask(null);
    setTaskForm({
      title: '',
      description: '',
      priority: 'medium',
      status: 'todo',
      assignee_id: '',
      due_date: '',
    });
    setTaskFormErrors({});
    setTaskDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      assignee_id: task.assignee_id || '',
      due_date: task.due_date?.slice(0, 10) || '',
    });
    setTaskFormErrors({});
    setTaskDialogOpen(true);
  };

  const handleSaveTask = async () => {
    const errors: Record<string, string> = {};
    if (!taskForm.title.trim()) errors.title = 'Title is required';
    setTaskFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    try {
      if (editingTask) {
    
        const updates: UpdateTaskRequest = {
          title: taskForm.title.trim(),
          description: taskForm.description.trim() || undefined,
          status: taskForm.status,
          priority: taskForm.priority,
          assignee_id: taskForm.assignee_id || null,
          due_date: taskForm.due_date || null,
        };
        const res = await fetch(`/tasks/${editingTask.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updates),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? data : t)));
        setSnackbar({ open: true, message: 'Task updated', severity: 'success' });
      } else {
 
        const newTask: CreateTaskRequest = {
          title: taskForm.title.trim(),
          description: taskForm.description.trim() || undefined,
          priority: taskForm.priority,
          assignee_id: taskForm.assignee_id || null,
          due_date: taskForm.due_date || null,
        };
        const res = await fetch(`/projects/${id}/tasks`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newTask),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setTasks((prev) => [...prev, data]);
        setSnackbar({ open: true, message: 'Task created', severity: 'success' });
      }
      setTaskDialogOpen(false);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to save task',
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const res = await fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete');
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setTaskDialogOpen(false);
      setSnackbar({ open: true, message: 'Task deleted', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete task', severity: 'error' });
    }
  };


  const handleEditProject = async () => {
    try {
      const res = await fetch(`/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editProjectName.trim(),
          description: editProjectDesc.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProject((prev) => (prev ? { ...prev, ...data } : prev));
      setEditProjectOpen(false);
      setSnackbar({ open: true, message: 'Project updated', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Failed to update project', severity: 'error' });
    }
  };

  const handleDeleteProject = async () => {
    try {
      await fetch(`/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/projects', { replace: true });
    } catch {
      setSnackbar({ open: true, message: 'Failed to delete project', severity: 'error' });
    }
  };


  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    if (task) setActiveTask(task);
  };

  const handleDragOver = () => {

  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;


    let targetStatus: TaskStatus | null = null;

  
    if (['todo', 'in_progress', 'done'].includes(overId)) {
      targetStatus = overId as TaskStatus;
    } else {
  
      const overTask = tasks.find((t) => t.id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    if (!targetStatus) return;

    const task = tasks.find((t) => t.id === taskId);
    if (!task || task.status === targetStatus) return;

    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: targetStatus as TaskStatus, updated_at: new Date().toISOString() } : t
      )
    );


    try {
      const res = await fetch(`/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: targetStatus }),
      });
      if (!res.ok) throw new Error();
    } catch {
  
      setTasks(previousTasks);
      setSnackbar({ open: true, message: 'Failed to update task status', severity: 'error' });
    }
  };


  if (isLoading) return <LoadingState variant="detail" />;
  if (error) return <ErrorState message={error} onRetry={fetchData} />;
  if (!project) return <ErrorState message="Project not found" />;

  const isOwner = project.owner_id === user?.id;
  const statuses: TaskStatus[] = ['todo', 'in_progress', 'done'];

  return (
    <Fade in timeout={400}>
      <Box>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/projects')}
            sx={{ mb: 2, color: 'text.secondary' }}
            size="small"
          >
            Back to Projects
          </Button>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                {project.name}
              </Typography>
              {project.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {project.description}
                </Typography>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                id="add-task-btn"
                variant="contained"
                startIcon={<Add />}
                onClick={openCreateDialog}
                size={isMobile ? 'small' : 'medium'}
              >
                {isMobile ? 'Task' : 'Add Task'}
              </Button>

              {isOwner && (
                <>
                  <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
                    <MoreVert />
                  </IconButton>
                  <Menu
                    anchorEl={menuAnchor}
                    open={Boolean(menuAnchor)}
                    onClose={() => setMenuAnchor(null)}
                    slotProps={{ paper: { sx: { borderRadius: 3, minWidth: 180 } } }}
                  >
                    <MenuItem
                      onClick={() => {
                        setMenuAnchor(null);
                        setEditProjectName(project.name);
                        setEditProjectDesc(project.description || '');
                        setEditProjectOpen(true);
                      }}
                    >
                      <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                      <ListItemText>Edit Project</ListItemText>
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setMenuAnchor(null);
                        setDeleteConfirmOpen(true);
                      }}
                      sx={{ color: 'error.main' }}
                    >
                      <ListItemIcon><Delete fontSize="small" color="error" /></ListItemIcon>
                      <ListItemText>Delete Project</ListItemText>
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Box>
        </Box>


        <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
          <FilterList sx={{ fontSize: 20, color: 'text.secondary' }} />

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Chip
              label="All"
              size="small"
              onClick={() => setStatusFilter('all')}
              variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              color={statusFilter === 'all' ? 'primary' : 'default'}
            />
            {statuses.map((s) => (
              <Chip
                key={s}
                icon={STATUS_CONFIG[s].icon as React.ReactElement}
                label={STATUS_CONFIG[s].label}
                size="small"
                onClick={() => setStatusFilter(s)}
                variant={statusFilter === s ? 'filled' : 'outlined'}
                color={statusFilter === s ? 'primary' : 'default'}
              />
            ))}
          </Box>

    
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel id="assignee-filter-label">Assignee</InputLabel>
            <Select
              labelId="assignee-filter-label"
              id="assignee-filter"
              value={assigneeFilter}
              label="Assignee"
              onChange={(e) => setAssigneeFilter(e.target.value as string)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="all">All Assignees</MenuItem>
              {users.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

    
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </Typography>
        </Box>

    
        {filteredTasks.length === 0 && statusFilter === 'all' && assigneeFilter === 'all' ? (
          <EmptyState
            icon={<AssignmentOutlined />}
            title="No tasks yet"
            description="Create your first task to get started on this project."
            actionLabel="Add Task"
            onAction={openCreateDialog}
          />
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            icon={<FilterList />}
            title="No matching tasks"
            description="Try adjusting your filters to see more tasks."
          />
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <Box
              sx={{
                display: 'flex',
                gap: 2.5,
                overflowX: 'auto',
                pb: 2,
                flexDirection: { xs: 'column', md: 'row' },
              }}
            >
              {statuses.map((status) => {
                const columnTasks = getTasksByStatus(status);
                return (
                  <SortableContext
                    key={status}
                    items={columnTasks.map((t) => t.id)}
                    strategy={verticalListSortingStrategy}
                    id={status}
                  >
                    <Box
                      sx={{
                        flex: 1,
                        minWidth: { xs: '100%', md: 300 },
                        maxWidth: { md: 400 },
                      }}
                    >
                      {/* Column header */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 2,
                          px: 1,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.75,
                            color: STATUS_CONFIG[status].color,
                          }}
                        >
                          {STATUS_CONFIG[status].icon}
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {STATUS_CONFIG[status].label}
                          </Typography>
                        </Box>
                        <Badge
                          badgeContent={columnTasks.length}
                          color="default"
                          sx={{
                            '& .MuiBadge-badge': {
                              position: 'relative',
                              transform: 'none',
                              bgcolor: STATUS_CONFIG[status].bgColor,
                              color: STATUS_CONFIG[status].color,
                              fontWeight: 600,
                              fontSize: '0.75rem',
                            },
                          }}
                        />
                      </Box>

                      <DroppableColumn
                        status={status}
                        columnTasks={columnTasks}
                        users={users}
                        openEditDialog={openEditDialog}
                      />
                    </Box>
                  </SortableContext>
                );
              })}
            </Box>

            <DragOverlay>
              {activeTask ? (
                <TaskCardOverlay task={activeTask} users={users} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}

   
        <Dialog
          open={taskDialogOpen}
          onClose={() => setTaskDialogOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 4 } } }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentOutlined color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {editingTask ? 'Edit Task' : 'Create Task'}
              </Typography>
            </Box>
            <IconButton onClick={() => setTaskDialogOpen(false)} size="small">
              <Close />
            </IconButton>
          </DialogTitle>

          <DialogContent dividers sx={{ pt: 3 }}>
            <TextField
              id="task-title-input"
              fullWidth
              label="Task Title"
              value={taskForm.title}
              onChange={(e) => {
                setTaskForm((prev) => ({ ...prev, title: e.target.value }));
                setTaskFormErrors({});
              }}
              error={!!taskFormErrors.title}
              helperText={taskFormErrors.title}
              sx={{ mb: 2.5 }}
              placeholder="What needs to be done?"
              autoFocus
            />

            <TextField
              id="task-description-input"
              fullWidth
              label="Description"
              value={taskForm.description}
              onChange={(e) => setTaskForm((prev) => ({ ...prev, description: e.target.value }))}
              multiline
              rows={3}
              sx={{ mb: 2.5 }}
              placeholder="Add more details..."
            />

            <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
              <FormControl fullWidth size="medium">
                <InputLabel>Status</InputLabel>
                <Select
                  id="task-status-select"
                  value={taskForm.status}
                  label="Status"
                  onChange={(e) =>
                    setTaskForm((prev) => ({ ...prev, status: e.target.value as TaskStatus }))
                  }
                >
                  {statuses.map((s) => (
                    <MenuItem key={s} value={s}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {STATUS_CONFIG[s].icon}
                        {STATUS_CONFIG[s].label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="medium">
                <InputLabel>Priority</InputLabel>
                <Select
                  id="task-priority-select"
                  value={taskForm.priority}
                  label="Priority"
                  onChange={(e) =>
                    setTaskForm((prev) => ({ ...prev, priority: e.target.value as TaskPriority }))
                  }
                >
                  {(['low', 'medium', 'high'] as TaskPriority[]).map((p) => (
                    <MenuItem key={p} value={p}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Flag sx={{ fontSize: 18, color: PRIORITY_CONFIG[p].color }} />
                        {PRIORITY_CONFIG[p].label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth size="medium">
                <Autocomplete
                  id="task-assignee-select"
                  options={users}
                  getOptionLabel={(option) => option.name}
                  value={users.find((u) => u.id === taskForm.assignee_id) || null}
                  onChange={(_, newValue) =>
                    setTaskForm((prev) => ({ ...prev, assignee_id: newValue?.id || '' }))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Assignee"
                      placeholder="Select assignee"
                    />
                  )}
                  renderOption={(props, option) => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const { key, ...optionProps } = props as any;
                    return (
                      <li key={key || option.id} {...optionProps}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                            {option.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2">{option.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {option.email}
                            </Typography>
                          </Box>
                        </Box>
                      </li>
                    );
                  }}
                />
              </FormControl>

              <TextField
                id="task-due-date-input"
                fullWidth
                label="Due Date"
                type="date"
                value={taskForm.due_date}
                onChange={(e) => setTaskForm((prev) => ({ ...prev, due_date: e.target.value }))}
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2, justifyContent: editingTask ? 'space-between' : 'flex-end' }}>
            {editingTask && (
              <Button
                id="task-delete-btn"
                color="error"
                startIcon={<Delete />}
                onClick={() => handleDeleteTask(editingTask.id)}
                variant="outlined"
              >
                Delete
              </Button>
            )}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button onClick={() => setTaskDialogOpen(false)} variant="outlined" sx={{ borderColor: 'divider' }}>
                Cancel
              </Button>
              <Button
                id="task-save-btn"
                onClick={handleSaveTask}
                variant="contained"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : editingTask ? 'Update' : 'Create'}
              </Button>
            </Box>
          </DialogActions>
        </Dialog>

    
        <Dialog
          open={editProjectOpen}
          onClose={() => setEditProjectOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 4 } } }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Edit Project</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={editProjectName}
              onChange={(e) => setEditProjectName(e.target.value)}
              sx={{ mb: 2.5, mt: 1 }}
            />
            <TextField
              fullWidth
              label="Description"
              value={editProjectDesc}
              onChange={(e) => setEditProjectDesc(e.target.value)}
              multiline
              rows={3}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setEditProjectOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleEditProject} variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

   
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          slotProps={{ paper: { sx: { borderRadius: 4, maxWidth: 400 } } }}
        >
          <DialogTitle sx={{ fontWeight: 600 }}>Delete Project?</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="text.secondary">
              This will permanently delete <strong>{project.name}</strong> and all its tasks.
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDeleteConfirmOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDeleteProject} variant="contained" color="error">
              Delete Project
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            sx={{ borderRadius: 2 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default ProjectDetailPage;
