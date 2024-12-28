import { Link } from '@mui/material';

import type { Link as LinkType } from 'shared/types';

type LinkCellProps = {
  value: LinkType | null;
};

const LinkCell = ({ value }: LinkCellProps) => {
  if (!value) return null;

  return (
    <Link
      href={value.url}
      underline="hover"
      target="_blank"
      rel="noopener noreferrer"
    >
      {value.value}
    </Link>
  );
};

export default LinkCell;
