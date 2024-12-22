import { Avatar, Box, Typography } from '@mui/material';
import { User } from '../../../../shared/types';

const colors = [
  '#1976d2', // blue
  '#388e3c', // green
  '#d32f2f', // red
  '#7b1fa2', // purple
  '#f57c00', // orange
  '#0288d1', // light blue
];

const getColorFromEmail = (email: string) => {
  const hash = email
    .split('')
    .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

type UserCellProps = {
  value: User[] | null;
};

const UserCell = ({ value }: UserCellProps) => {
  if (!value) return null;

  return (
    <>
      {value.map(user => (
        <Box key={user.id} display="flex" alignItems="center" gap={1} mb={0.5}>
          <Avatar
            src={user.avatarUrl}
            alt={user.email}
            sx={{
              width: 24,
              height: 24,
              bgcolor: getColorFromEmail(user.email),
            }}
          >
            <Typography variant="caption">
              {user.email[0].toUpperCase()}
            </Typography>
          </Avatar>
          <Typography variant="body2">{user.name}</Typography>
        </Box>
      ))}
    </>
  );
};

export default UserCell;
