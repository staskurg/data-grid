import { Box, Container } from '@mui/material';
import { useTableData, useUpdateTableData, useUsers } from '../hooks/apiHooks';
import { Table } from '../components/Table';
import { Row } from '../../shared/types';

const tableId = 'd290f1ee-6c54-4b01-90e6-d701748f0852';

const Homepage = () => {
  const {
    data: tableData,
    isLoading: isTableDataLoading,
    error: tableError,
  } = useTableData(tableId);
  const {
    data: usersData,
    isLoading: isUserDataLoading,
    error: usersError,
  } = useUsers();
  const { mutate: updateRows } = useUpdateTableData(tableId);

  const handleRowsChange = (newRows: Row[]) => {
    console.log('handleRowsChange', newRows);
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
        {isTableDataLoading && <div>Loading...</div>}
        {tableError && <div>Error: {tableError.message}</div>}
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
