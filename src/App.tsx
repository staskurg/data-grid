import React from 'react';

import { Button, Typography } from '@mui/material';

const App = () => {
  return (
    <div style={{ padding: '16px' }}>
      <Typography variant="h4" gutterBottom>
        Welcome to My App
      </Typography>
      <Button variant="contained" color="primary">
        Click Me
      </Button>
    </div>
  );
};

export default App;
