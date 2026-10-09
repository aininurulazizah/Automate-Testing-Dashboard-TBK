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
  const [rerunningAll, setRerunningAll] = useState(false);

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
      // Ambil generatedAt execution saat ini
      const currentResponse = await fetch(`/executions/${executionDate}.json?t=${Date.now()}`, {
        cache: 'no-store',
      });

      if (!currentResponse.ok) {
        throw new Error('Gagal mengambil data execution saat ini.');
      }

      const currentData = await currentResponse.json();
      const currentGeneratedAt = currentData.generatedAt;

      // Trigger GitHub Actions
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

      const responseText = await response.text();

      let result: {
        message?: string;
        error?: string;
      } = {};

      if (responseText) {
        try {
          result = JSON.parse(responseText);
        } catch {
          // Response bukan JSON, abaikan
        }
      }

      if (!response.ok) {
        throw new Error(
          result.message || result.error || responseText || 'Gagal re-run semua failed test',
        );
      }

      // Trigger berhasil → ubah tombol menjadi Re-running...
      setRerunningAll(true);

      // Polling setiap 5 detik
      const interval = setInterval(async () => {
        try {
          const latestResponse = await fetch(`/executions/${executionDate}.json?t=${Date.now()}`, {
            cache: 'no-store',
          });

          if (!latestResponse.ok) {
            return;
          }

          const latestData = await latestResponse.json();

          // Execution baru sudah masuk
          if (latestData.generatedAt !== currentGeneratedAt) {
            clearInterval(interval);
            window.location.reload();
          }
        } catch (error) {
          console.error('Polling execution error:', error);
        }
      }, 5000);
    } catch (error) {
      console.error('Rerun all failed error:', error);
      setRerunningAll(false);

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
          disabled={rerunningAll || !data.details.some((item) => item.status === 'failed')}
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
          {rerunningAll ? 'Re-running All Failed Test...' : 'Re-run All Failed Tests'}
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
                <Detail
                  key={item.id}
                  item={item}
                  executionDate={executionDate}
                  rerunningAll={rerunningAll}
                />
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
