import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Project } from '../types';
import { ApiClientError } from '../api/client';
import EmptyState from '../components/common/EmptyState';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActionArea,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Fab,
  useMediaQuery,
  useTheme,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Add,
  FolderOutlined,
  AccessTime,
  AssignmentOutlined,
} from '@mui/icons-material';
import { format } from 'date-fns';

const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [createErrors, setCreateErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/projects', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setProjects(data.projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreate = async () => {
    const errors: Record<string, string> = {};
    if (!newName.trim()) errors.name = 'Project name is required';
    setCreateErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsCreating(true);
    try {
      const response = await fetch('/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName.trim(), description: newDescription.trim() || undefined }),
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.fields) {
          setCreateErrors(data.fields);
          return;
        }
        throw new ApiClientError(data.error, response.status);
      }
      setProjects((prev) => [...prev, data]);
      setCreateOpen(false);
      setNewName('');
      setNewDescription('');
      setSnackbar({ open: true, message: 'Project created successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err instanceof Error ? err.message : 'Failed to create project',
        severity: 'error',
      });
    } finally {
      setIsCreating(false);
    }
  };


  const gradients = [
    'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
    'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
    'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
  ];

  if (isLoading) return <LoadingState variant="cards" count={6} />;
  if (error) return <ErrorState message={error} onRetry={fetchProjects} />;

  return (
    <Fade in timeout={400}>
      <Box>
  
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Projects
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {projects.length} project{projects.length !== 1 ? 's' : ''} • Manage your work
            </Typography>
          </Box>
          {!isMobile && (
            <Button
              id="create-project-btn"
              variant="contained"
              startIcon={<Add />}
              onClick={() => setCreateOpen(true)}
              size="large"
            >
              New Project
            </Button>
          )}
        </Box>

  
        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderOutlined />}
            title="No projects yet"
            description="Create your first project to start organizing tasks and collaborating with your team."
            actionLabel="Create Project"
            onAction={() => setCreateOpen(true)}
          />
        ) : (
          <Grid container spacing={3}>
            {projects.map((project, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardActionArea
                    onClick={() => navigate(`/projects/${project.id}`)}
                    sx={{
                      flexGrow: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                    }}
                  >
             
                    <Box
                      sx={{
                        height: 6,
                        background: gradients[index % gradients.length],
                        borderRadius: '16px 16px 0 0',
                      }}
                    />
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            width: 44,
                            height: 44,
                            background: gradients[index % gradients.length],
                            fontSize: '1.1rem',
                            fontWeight: 700,
                          }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="h6"
                            noWrap
                            sx={{ lineHeight: 1.3, fontWeight: 600 }}
                          >
                            {project.name}
                          </Typography>
                          {project.owner_id === user?.id && (
                            <Chip
                              label="Owner"
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ mt: 0.5, height: 22, fontSize: '0.7rem' }}
                            />
                          )}
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          minHeight: 40,
                        }}
                      >
                        {project.description || 'No description provided'}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          Created {format(new Date(project.created_at), 'MMM d, yyyy')}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

  
        {isMobile && (
          <Fab
            id="create-project-fab"
            color="primary"
            onClick={() => setCreateOpen(true)}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <Add />
          </Fab>
        )}

    
        <Dialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          maxWidth="sm"
          fullWidth
          slotProps={{ paper: { sx: { borderRadius: 4 } } }}
        >
          <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AssignmentOutlined color="primary" />
              <Typography sx={{ fontWeight: 600 }}>Create New Project</Typography>
            </Box>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              id="project-name-input"
              fullWidth
              label="Project Name"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                setCreateErrors((prev) => ({ ...prev, name: '' }));
              }}
              error={!!createErrors.name}
              helperText={createErrors.name}
              sx={{ mb: 2.5, mt: 1 }}
              placeholder="e.g., Website Redesign"
              autoFocus
            />
            <TextField
              id="project-description-input"
              fullWidth
              label="Description (optional)"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              multiline
              rows={3}
              placeholder="What's this project about?"
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={() => setCreateOpen(false)}
              variant="outlined"
              sx={{ borderColor: 'divider' }}
            >
              Cancel
            </Button>
            <Button
              id="project-create-submit"
              onClick={handleCreate}
              variant="contained"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogActions>
        </Dialog>

  
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
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

export default ProjectsPage;
