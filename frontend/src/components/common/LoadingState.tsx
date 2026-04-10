import React from 'react';
import { Box, Skeleton, Grid } from '@mui/material';

interface LoadingStateProps {
  variant?: 'cards' | 'list' | 'detail';
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ variant = 'cards', count = 6 }) => {
  if (variant === 'detail') {
    return (
      <Box>
        <Skeleton variant="text" width="40%" height={48} sx={{ mb: 1 }} />
        <Skeleton variant="text" width="60%" height={24} sx={{ mb: 4 }} />
        <Box sx={{ display: 'flex', gap: 3 }}>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ flex: 1 }}>
              <Skeleton variant="rounded" height={48} sx={{ mb: 2, borderRadius: 2 }} />
              {[1, 2].map((j) => (
                <Skeleton
                  key={j}
                  variant="rounded"
                  height={120}
                  sx={{ mb: 2, borderRadius: 3 }}
                />
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  if (variant === 'list') {
    return (
      <Box>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={72}
            sx={{ mb: 1.5, borderRadius: 3 }}
          />
        ))}
      </Box>
    );
  }

  
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
          <Skeleton
            variant="rounded"
            height={180}
            sx={{ borderRadius: 4 }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default LoadingState;
