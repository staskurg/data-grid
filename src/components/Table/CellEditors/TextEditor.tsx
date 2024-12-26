import { useState } from 'react';
import { TextField } from '@mui/material';

type TextEditorProps = {
  initialValue: string;
  onComplete: (value: string) => void;
  onCancel?: () => void;
};

const TextEditor = ({ initialValue, onComplete }: TextEditorProps) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleBlur = () => {
    onComplete(value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onComplete(value);
    }
    if (event.key === 'Escape') {
      onComplete(initialValue);
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
