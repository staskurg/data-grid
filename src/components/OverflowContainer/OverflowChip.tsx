import { Chip, Tooltip } from '@mui/material';

import type { ReactNode } from 'react';

type OverflowChipProps = {
  count: number;
  tooltipContent: ReactNode;
};

const OverflowChip = ({ count, tooltipContent }: OverflowChipProps) => (
  <Tooltip title={tooltipContent}>
    <Chip
      label={`+${count > 9 ? '9+' : count}`}
      variant="outlined"
      size="small"
      sx={{
        borderRadius: '4px',
        backgroundColor: '#f5f5f5',
      }}
    />
  </Tooltip>
);

export default OverflowChip;
