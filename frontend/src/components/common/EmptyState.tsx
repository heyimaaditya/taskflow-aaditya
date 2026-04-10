import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Add } from '@mui/icons-material';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '64px 24px',
        bgcolor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)',
        borderRadius: 4,
        border: '1px dashed',
        borderColor: 'divider',
        width: '100%',
        minHeight: 300,
      }}
    >
      {icon && (
        <Box
          sx={{
            mb: 2,
            color: 'text.disabled',
            '& > svg': {
              fontSize: 64,
            },
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="h6" color="text.primary" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: actionLabel ? 3 : 0, maxWidth: 400 }}
      >
        {description}
      </Typography>
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} startIcon={<Add />}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
