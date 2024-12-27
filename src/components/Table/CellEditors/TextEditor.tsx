import { useState } from 'react';
import { TextField } from '@mui/material';

type TextEditorProps = {
  initialValue: string;
  onComplete: (value: string) => void;
  onCancel: () => void;
};

const TextEditor = ({
  initialValue,
  onComplete,
  onCancel,
}: TextEditorProps) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    if (value !== initialValue) {
      onComplete(value);
    } else {
      onCancel();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (value !== initialValue) {
        onComplete(value);
      } else {
        onCancel();
      }
    }
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <TextField
      autoFocus
      fullWidth
      size="small"
      variant="standard"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      sx={{ minHeight: '32px' }}
    />
  );
};

export default TextEditor;
