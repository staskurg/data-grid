import TextEditor from './TextEditor';
import UserEditor from './UserEditor';
import { COLUMN_TYPES } from '../../../utils/constants';

import type { CellValue, ColumnType, User } from '../../../../shared/types';

type CellEditorProps = {
  type: ColumnType;
  initialValue: CellValue;
  onComplete: (value: CellValue) => void;
  onCancel: () => void;
};

const getCellEditor = ({
  type,
  initialValue,
  onComplete,
  onCancel,
}: CellEditorProps) => {
  switch (type) {
    case COLUMN_TYPES.USER:
      return (
        <UserEditor
          initialValue={initialValue as User[]}
          onComplete={onComplete}
          onCancel={onCancel}
        />
      );
    default:
      return (
        <TextEditor
          initialValue={initialValue as string}
          onComplete={onComplete}
          onCancel={onCancel}
        />
      );
  }
};

export default getCellEditor;
