import { Box, Typography } from '@mui/material';
import { User } from '../../../../shared/types';

import UserElement from '../../../ui/UserElement';
import { OverflowContainer } from '../../OverflowContainer';

type UserCellProps = {
  value: User[];
  columnWidth?: number;
};

const UserCell = ({ value = [], columnWidth = 0 }: UserCellProps) => (
  <OverflowContainer
    items={value}
    columnWidth={columnWidth}
    renderItem={(user, ref) => <UserElement user={user} ref={ref} />}
    renderTooltipContent={hiddenUsers => (
      <Box>
        {hiddenUsers.map(user => (
          <Typography key={user.id} variant="body2">
            {user.name}
          </Typography>
        ))}
      </Box>
    )}
  />
);

export default UserCell;
