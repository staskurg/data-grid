import { memo, useCallback } from 'react';
import UserElement from '../../../ui/UserElement';
import { OverflowContainer } from '../../../components/OverflowContainer';

import type { User } from '../../../../shared/types';

type UserCellProps = {
  value: User[];
  columnWidth?: number;
};

const UserCell = ({ value = [], columnWidth = 0 }: UserCellProps) => {
  const renderItem = useCallback(
    (user: User, ref: (el: HTMLDivElement | null) => void) => (
      <UserElement user={user} ref={ref} />
    ),
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
