import { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from '@mui/material';
import { Details } from 'data/detail-test';
import Detail from './Detail';

const DetailsItem = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ pt: 3 }}>
      <Typography variant="h4" color="primary.dark" px={3} mb={1.25}>
        Details
      </Typography>

      <Box sx={{ overflow: 'auto' }}>
        <Table aria-label="top products table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Test Case Name</TableCell>
              <TableCell>Test Result</TableCell>
              <TableCell>Detail</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Details.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <Detail key={item.id} item={item} />
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        component="div"
        count={Details.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 20]}
      />
    </Paper>
  );
};

export default DetailsItem;
