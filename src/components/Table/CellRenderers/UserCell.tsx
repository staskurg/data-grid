import { memo, useCallback } from 'react';
import UserElement from 'src/ui/UserElement';
import { OverflowContainer } from 'src/components/OverflowContainer';

import type { User } from 'shared/types';

type UserCellProps = {
  value: User[];
  columnWidth?: number;
};

const UserCell = ({ value = [], columnWidth = 0 }: UserCellProps) => {
  const renderItem = useCallback(
    (user: User) => <UserElement user={user} />,
    []
  );

  return (
    <OverflowContainer
      items={value}
      columnWidth={columnWidth}
      renderItem={renderItem}
    />
  );
};

UserCell.displayName = 'UserCell';
export default memo(UserCell);
