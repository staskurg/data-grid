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
  />
);

export default UserCell;
