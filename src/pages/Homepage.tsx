import { Box, Container } from '@mui/material';
import {
  useTableData,
  useUpdateRowUsers,
  useUpdateTableRow,
} from 'src/hooks/apiHooks';
import { Table } from 'src/components/Table';
import { TABLE_UPDATE_TYPES } from 'src/utils/constants';

import type { TableUpdate } from 'shared/types';

const tableId = 'd290f1ee-6c54-4b01-90e6-d701748f0852';

const Homepage = () => {
  const {
    data: tableData,
    isLoading: isTableDataLoading,
    isFetching: isFetchingTableData,
    error: tableError,
  } = useTableData(tableId);
  const { mutate: updateTableRow, isPending: isSavingTableRow } =
    useUpdateTableRow(tableId);
  const { mutate: updateRowUsers, isPending: isSavingRowUsers } =
    useUpdateRowUsers(tableId);

  const handleUpdateTableData = (update: TableUpdate) => {
    switch (update.type) {
      case TABLE_UPDATE_TYPES.ROW_UPDATE:
        updateTableRow(update);
        break;
      case TABLE_UPDATE_TYPES.USER_ASSIGNMENT:
        updateRowUsers(update);
        break;
    }
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
      <Container
        maxWidth={false}
        sx={{ height: '100%', maxWidth: `1320px`, py: 3 }}
      >
        <Table
          tableData={tableData}
          isLoading={isTableDataLoading}
          isSaving={isFetchingTableData || isSavingTableRow || isSavingRowUsers}
          error={tableError}
          onUpdateTableData={handleUpdateTableData}
        />
      </Container>
    </Box>
  );
};

export default Homepage;
