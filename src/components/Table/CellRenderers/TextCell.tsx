import { Typography } from '@mui/material';

type TextCellProps = {
  value: string | null;
};

const TextCell = ({ value }: TextCellProps) => {
  return (
    <Typography variant="body2" component="span">
      {value}
    </Typography>
  );
};

export default TextCell;
