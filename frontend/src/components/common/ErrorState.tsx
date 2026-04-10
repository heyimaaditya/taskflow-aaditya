import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh } from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An error occurred while communicating with the server. Please check your connection and try again.',
  onRetry,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 400,
          width: '100%',
          textAlign: 'center',
          bgcolor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(239, 68, 68, 0.04)' : 'rgba(239, 68, 68, 0.08)',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'light' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.3)',
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" color="error.main" gutterBottom sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {message}
        </Typography>
        {onRetry && (
          <Button
            variant="outlined"
            onClick={onRetry}
            startIcon={<Refresh />}
            color="error"
            size="small"
          >
            Try Again
          </Button>
        )}
      </Paper>
    </Box>
  );
};

export default ErrorState;
