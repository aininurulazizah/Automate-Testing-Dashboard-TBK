import { useState } from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TableCell,
  TableRow,
  Typography,
  Button,
  IconButton,
  useTheme,
} from '@mui/material';

import ReplayIcon from '@mui/icons-material/Replay';
import ViewIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

import { DetailItem } from 'data/types';

interface DetailProps {
  item: DetailItem;
  executionDate?: string;
}

const Detail = ({ item, executionDate }: DetailProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [rerunning, setRerunning] = useState(false);

  const { id, name, testTitle, priority, detail } = item;

  let color = '';

  switch (priority) {
    case 'Passed':
      color = theme.palette.success.main;
      break;

    case 'Failed':
      color = theme.palette.error.main;
      break;

    case 'Flaky':
      color = theme.palette.warning.main;
      break;
  }

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);

      setTimeout(() => {
        setCopied(null);
      }, 1500);
    } catch (error) {
      console.error('Gagal copy:', error);
    }
  };

  const handleRerun = async () => {
    if (!executionDate) {
      alert('Tanggal execution tidak ditemukan.');
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
          keyword: testTitle,
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
        throw new Error(result.message || result.error || responseText || 'Gagal re-run');
      }

      alert('Re-run berhasil');

      // Trigger berhasil → ubah tombol menjadi Re-running...
      setRerunning(true);

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
      console.error('Rerun error:', error);

      setRerunning(false);

      alert(error instanceof Error ? error.message : 'Gagal re-run');
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{id}</TableCell>

        <TableCell size="small">
          <Typography variant="subtitle2" whiteSpace="nowrap">
            {name}
          </Typography>
        </TableCell>

        <TableCell>
          <Chip
            label={priority}
            sx={{
              bgcolor: color,
              color: 'common.white',
            }}
          />
        </TableCell>

        <TableCell>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ViewIcon />}
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 5,
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'primary.main',
                color: 'common.white',
              },
            }}
          >
            Detail
          </Button>

          {priority === 'Failed' && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ReplayIcon />}
              onClick={handleRerun}
              disabled={rerunning}
              sx={{
                borderRadius: 5,
                textTransform: 'none',
                ml: 1,
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'common.white',
                },
              }}
            >
              {rerunning ? 'Re-running...' : 'Re-run'}
            </Button>
          )}
        </TableCell>
      </TableRow>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{name}</DialogTitle>

        <DialogContent>
          {detail.map((item, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              {item.bookingCode && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mb: 1,
                  }}
                >
                  <Typography color="primary">Booking Code : {item.bookingCode}</Typography>

                  <IconButton
                    size="small"
                    onClick={() => handleCopy(item.bookingCode!, `booking-${index}`)}
                    title="Copy booking code"
                  >
                    {copied === `booking-${index}` ? (
                      <CheckIcon fontSize="small" color="success" />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              )}

              {item.error && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 0.5,
                  }}
                >
                  <Typography
                    color="error"
                    component="pre"
                    sx={{
                      whiteSpace: 'pre-wrap',
                      fontFamily: 'inherit',
                      fontSize: '0.875rem',
                      margin: 0,
                      flex: 1,
                    }}
                  >
                    Error : {item.error.detail || item.error.summary}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() =>
                      handleCopy(item.error?.detail || item.error?.summary || '', `error-${index}`)
                    }
                    title="Copy error detail"
                  >
                    {copied === `error-${index}` ? (
                      <CheckIcon fontSize="small" color="success" />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Box>
              )}
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Detail;
