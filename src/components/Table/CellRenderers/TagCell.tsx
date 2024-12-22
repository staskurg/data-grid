import { Chip } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

type TagCellProps = {
  value: string | null;
};
const TagCell = ({ value }: TagCellProps) => {
  return (
    <Chip
      label={value}
      icon={<ArticleOutlinedIcon />}
      variant="outlined"
      size="small"
      sx={{
        borderRadius: '4px',
        backgroundColor: '#f5f5f5',
      }}
    />
  );
};

export default TagCell;
