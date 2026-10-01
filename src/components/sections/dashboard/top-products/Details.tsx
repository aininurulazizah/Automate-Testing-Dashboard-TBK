import { useEffect, useState } from 'react';
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
  Button,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { DashboardData, DetailItem } from 'data/types';
import Detail from './Detail';

type Status = 'All' | 'Passed' | 'Failed' | 'Flaky';

interface DetailsProps {
  data: DashboardData;
  selectedStatus: Status;
  executionDate?: string;
}

const DetailsItem = ({ data, selectedStatus, executionDate }: DetailsProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const details: DetailItem[] = data.details.map((item, index) => ({
    id: index + 1,
    name: item.title,
    testTitle: item.title,
    priority: item.status === 'passed' ? 'Passed' : item.status === 'failed' ? 'Failed' : 'Flaky',
    detail: [
      item.status === 'failed'
        ? {
            error: item.error ?? null,
          }
        : {
            bookingCode: item.bookingCode ?? '-',
          },
    ],
  }));

  const filteredDetails =
    selectedStatus === 'All' ? details : details.filter((item) => item.priority === selectedStatus);

  useEffect(() => {
    setPage(0);
  }, [selectedStatus, data]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRerunAllFailed = async () => {
    if (!executionDate) {
      alert('Tanggal execution tidak ditemukan.');
      return;
    }

    const failedTests = data.details
      .filter((item) => item.status === 'failed')
      .map((item) => item.title);

    if (failedTests.length === 0) {
      alert('Tidak ada test case yang failed.');
      return;
    }

    const confirmed = window.confirm(
      `Akan re-run ${failedTests.length} test case yang failed. Lanjutkan?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch('/api/rerun', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          testFile: 'reservasi_test.spec.js',
          keywords: failedTests,
          executionDate,
        }),
      });

      const result = await response.json();

      console.log('Rerun all failed response:', result);

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Gagal re-run semua failed test');
      }

      alert(`${failedTests.length} failed test berhasil dikirim ke GitHub Actions.`);
    } catch (error) {
      console.error('Rerun all failed error:', error);

      alert(error instanceof Error ? error.message : 'Gagal re-run semua failed test');
    }
  };

  return (
    <Paper sx={{ pt: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 3,
          mb: 1.25,
        }}
      >
        <Typography variant="h4" color="primary.dark">
          Details
        </Typography>

        <Button
          variant="outlined"
          size="small"
          onClick={handleRerunAllFailed}
          disabled={!data.details.some((item) => item.status === 'failed')}
          sx={{
            borderRadius: 5,
            textTransform: 'none',
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'common.white',
            },
          }}
          startIcon={<RestartAltIcon />}
        >
          Re-run All Failed Tests
        </Button>
      </Box>

      <Box sx={{ overflow: 'auto' }}>
        <Table aria-label="test details table">
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Test Case Name</TableCell>
              <TableCell>Test Result</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredDetails
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <Detail key={item.id} item={item} executionDate={executionDate} />
              ))}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        component="div"
        count={filteredDetails.length}
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
