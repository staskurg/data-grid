import LinkCell from './LinkCell';
import UserCell from './UserCell';
import NumberCell from './NumberCell';
import TagCell from './TagCell';
import TextCell from './TextCell';
import { COLUMN_TYPES } from 'src/utils/constants';

import type { CellValue, ColumnType, Link, User } from 'shared/types';

type CellRendererProps = {
  type: ColumnType;
  value: CellValue;
  columnWidth?: number;
  isEditable?: boolean;
  onEditStart?: () => void;
};

const getCellRenderer = ({
  type,
  value,
  columnWidth,
  isEditable,
  onEditStart,
}: CellRendererProps) => {
  const content = (() => {
    switch (type) {
      case COLUMN_TYPES.LINK:
        return <LinkCell value={value as Link} />;
      case COLUMN_TYPES.USER:
        return <UserCell value={value as User[]} columnWidth={columnWidth} />;
      case COLUMN_TYPES.NUMBER:
        return <NumberCell value={value as number} />;
      case COLUMN_TYPES.TAG:
        return <TagCell value={value as string} />;
      default:
        return <TextCell value={value as string} />;
    }
  })();

  return (
    <div
      onClick={isEditable ? onEditStart : undefined}
      style={{
        cursor: isEditable ? 'pointer' : 'default',
        width: '100%',
        height: '100%',
      }}
    >
      {content}
    </div>
  );
};

export default getCellRenderer;
