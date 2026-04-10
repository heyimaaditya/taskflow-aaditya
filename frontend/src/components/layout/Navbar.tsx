import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
  useTheme,
  Chip,
  Breadcrumbs,
  Link,
  Divider,
} from '@mui/material';
import {
  DarkMode,
  LightMode,
  Logout,
  Person,
  Dashboard,
  NavigateNext,
} from '@mui/icons-material';
import { useThemeMode } from '../../theme/ThemeContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          {}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              cursor: 'pointer',
              mr: 3,
            }}
            onClick={() => navigate('/projects')}
          >
            <Dashboard
              sx={{
                fontSize: 28,
                color: 'primary.main',
              }}
            />
            {!isMobile && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6366F1, #EC4899)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                TaskFlow
              </Typography>
            )}
          </Box>

          {}
          {!isMobile && pathSegments.length > 0 && (
            <Breadcrumbs
              separator={<NavigateNext fontSize="small" />}
              sx={{ flexGrow: 1, '& .MuiBreadcrumbs-separator': { mx: 0.5 } }}
            >
              {pathSegments.map((segment, index) => {
                const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
                const isLast = index === pathSegments.length - 1;
                const label = segment.charAt(0).toUpperCase() + segment.slice(1);

                return isLast ? (
                  <Typography
                    key={path}
                    variant="body2"
                    color="text.primary"
                    sx={{ fontWeight: 500 }}
                  >
                    {label}
                  </Typography>
                ) : (
                  <Link
                    key={path}
                    component="button"
                    variant="body2"
                    underline="hover"
                    color="text.secondary"
                    onClick={() => navigate(path)}
                    sx={{ cursor: 'pointer' }}
                  >
                    {label}
                  </Link>
                );
              })}
            </Breadcrumbs>
          )}

          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton
                onClick={toggleTheme}
                size="small"
                sx={{
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'rotate(30deg)' },
                }}
              >
                {mode === 'light' ? (
                  <DarkMode fontSize="small" />
                ) : (
                  <LightMode fontSize="small" sx={{ color: '#FBBF24' }} />
                )}
              </IconButton>
            </Tooltip>

            <Chip
              avatar={
                <Avatar
                  sx={{
                    bgcolor: 'primary.main',
                    width: 28,
                    height: 28,
                    fontSize: '0.75rem',
                  }}
                >
                  {user ? getInitials(user.name) : '?'}
                </Avatar>
              }
              label={isMobile ? undefined : user?.name}
              onClick={handleMenuOpen}
              variant="outlined"
              sx={{
                cursor: 'pointer',
                borderColor: 'divider',
                '&:hover': { borderColor: 'primary.main' },
                transition: 'border-color 0.2s',
                ...(isMobile && {
                  '& .MuiChip-label': { display: 'none' },
                  px: 0,
                }),
              }}
            />

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 3,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                  },
                }
              }}
            >
              <Box sx={{ px: 2, py: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem disabled>
                <ListItemIcon>
                  <Person fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" color="error" />
                </ListItemIcon>
                <ListItemText sx={{ color: 'error.main' }}>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 64px)',
          px: { xs: 2, sm: 3, md: 4 },
          py: { xs: 2, sm: 3 },
          maxWidth: 1400,
          mx: 'auto',
          width: '100%',
        }}
      >
        <Outlet />
      </Box>
    </>
  );
};

export default Navbar;
