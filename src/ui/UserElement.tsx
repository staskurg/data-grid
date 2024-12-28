import React from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { getColorFromEmail } from 'src/utils/getColorFromEmail';

import type { User } from 'shared/types';

const UserElement = React.forwardRef<HTMLDivElement, { user: User }>(
  ({ user }, ref) => (
    <Box
      ref={ref}
      key={user.id}
      display="flex"
      alignItems="center"
      gap={1}
      mb={0.5}
      sx={{ whiteSpace: 'nowrap' }}
    >
      <Avatar
        src={user.avatarUrl}
        alt={user.email}
        sx={{
          width: 24,
          height: 24,
          bgcolor: getColorFromEmail(user.email),
        }}
      >
        <Typography variant="caption">{user.email[0].toUpperCase()}</Typography>
      </Avatar>
      <Typography variant="body2">{user.name}</Typography>
    </Box>
  )
);

export default UserElement;
