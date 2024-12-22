import { Typography } from '@mui/material';

type NumberCellProps = {
  value: number | null;
};

const NumberCell = ({ value }: NumberCellProps) => {
  return (
    <Typography variant="body2" component="span">
      {value?.toLocaleString()}
    </Typography>
  );
};

export default NumberCell;
