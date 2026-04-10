import { createTheme, type ThemeOptions } from '@mui/material/styles';

const sharedTypography = {
  fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
  h1: { fontWeight: 700, fontSize: '2.25rem', letterSpacing: '-0.02em' },
  h2: { fontWeight: 700, fontSize: '1.875rem', letterSpacing: '-0.01em' },
  h3: { fontWeight: 600, fontSize: '1.5rem', letterSpacing: '-0.01em' },
  h4: { fontWeight: 600, fontSize: '1.25rem' },
  h5: { fontWeight: 600, fontSize: '1.1rem' },
  h6: { fontWeight: 600, fontSize: '1rem' },
  subtitle1: { fontWeight: 500, fontSize: '0.95rem' },
  subtitle2: { fontWeight: 500, fontSize: '0.85rem' },
  body1: { fontSize: '0.938rem', lineHeight: 1.6 },
  body2: { fontSize: '0.85rem', lineHeight: 1.5 },
  button: { fontWeight: 600, textTransform: 'none' as const, letterSpacing: '0.01em' },
};

const sharedShape = {
  borderRadius: 12,
};

const sharedComponents: ThemeOptions['components'] = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 10,
        padding: '8px 20px',
        fontSize: '0.875rem',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
        '&.MuiButton-containedPrimary': {
          background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5558E6 0%, #727BF7 100%)',
          },
        },
      },
    },
    defaultProps: {
      disableElevation: true,
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      },
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 20,
      },
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: 'outlined',
      size: 'medium',
    },
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 10,
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        fontWeight: 500,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 16,
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        borderRadius: 0,
      },
    },
  },
  MuiFab: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        borderRadius: 8,
        fontSize: '0.8rem',
      },
    },
  },
  MuiSelect: {
    styleOverrides: {
      root: {
        borderRadius: 10,
      },
    },
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366F1',
      light: '#818CF8',
      dark: '#4F46E5',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#EC4899',
      light: '#F472B6',
      dark: '#DB2777',
    },
    background: {
      default: '#F8F9FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E1B4B',
      secondary: '#6B7280',
    },
    divider: '#E5E7EB',
    error: { main: '#EF4444' },
    warning: { main: '#F59E0B' },
    success: { main: '#10B981' },
    info: { main: '#3B82F6' },
  },
  typography: sharedTypography,
  shape: sharedShape,
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #F0F0F5',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(99, 102, 241, 0.08), 0 4px 10px rgba(0,0,0,0.04)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #F0F0F5',
          color: '#1E1B4B',
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#818CF8',
      light: '#A5B4FC',
      dark: '#6366F1',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F472B6',
      light: '#F9A8D4',
      dark: '#EC4899',
    },
    background: {
      default: '#0F0E1A',
      paper: '#1A1929',
    },
    text: {
      primary: '#F1F0FF',
      secondary: '#9CA3AF',
    },
    divider: '#2D2B42',
    error: { main: '#F87171' },
    warning: { main: '#FBBF24' },
    success: { main: '#34D399' },
    info: { main: '#60A5FA' },
  },
  typography: sharedTypography,
  shape: sharedShape,
  components: {
    ...sharedComponents,
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #2D2B42',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          '&:hover': {
            boxShadow: '0 10px 30px rgba(129, 140, 248, 0.1), 0 4px 10px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
            borderColor: '#3D3B52',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          backgroundColor: 'rgba(15, 14, 26, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #2D2B42',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 20px',
          fontSize: '0.875rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&.MuiButton-containedPrimary': {
            background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5558E6 0%, #727BF7 100%)',
            },
          },
          '&.MuiButton-outlinedPrimary': {
            borderColor: '#3D3B52',
            '&:hover': {
              borderColor: '#818CF8',
              backgroundColor: 'rgba(129, 140, 248, 0.08)',
            },
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
  },
});
