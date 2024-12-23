import { Box, Container } from '@mui/material';
import { useTableData, useUpdateTableData } from '../hooks/apiHooks';
import { Table } from '../components/Table';
import { Row } from '../../shared/types';

const Homepage = () => {
  const { data: tableData, isLoading, error } = useTableData('table2');
  const { mutate: updateRows } = useUpdateTableData('table2');

  const handleRowsChange = (newRows: Row[]) => {
    updateRows(newRows);
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        bgcolor: 'background.default',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth={false} sx={{ height: '100%', py: 3 }}>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {tableData && (
          <Table
            columns={tableData.columns}
            rows={tableData.rows}
            onRowsChange={handleRowsChange}
          />
        )}
      </Container>
    </Box>
  );
};

export default Homepage;
