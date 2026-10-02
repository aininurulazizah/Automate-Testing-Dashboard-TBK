import { Typography, Grid, Paper, Stack, Button, TextField } from '@mui/material';

import dayjs from 'dayjs';
import 'dayjs/locale/id';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import IconifyIcon from 'components/base/IconifyIcon';

import { DashboardData } from 'data/types';
import SaleCard from './SummaryCard';

export type Status = 'All' | 'Passed' | 'Failed' | 'Flaky';

interface SalesProps {
  data: DashboardData;
  onStatusChange: (status: Status) => void;
  selectedDate?: string;
  availableDates: string[];
  onDateChange: (date: string) => void;
}

const Sales = ({
  data,
  onStatusChange,
  selectedDate,
  availableDates,
  onDateChange,
}: SalesProps) => {
  const summaries = [
    {
      label: 'Total Tests',
      value: data.summary.total,
      bgColor: 'secondary.lighter',
      iconBackgroundColor: 'secondary.main',
      icon: 'material-symbols:lab-profile',
    },
    {
      label: 'Passed Tests',
      value: data.summary.passed,
      bgColor: 'success.lighter',
      iconBackgroundColor: 'success.darker',
      icon: 'material-symbols:check-circle',
    },
    {
      label: 'Flaky Tests',
      value: data.summary.flaky,
      bgColor: 'warning.lighter',
      iconBackgroundColor: 'error.dark',
      icon: 'material-symbols:warning',
    },
    {
      label: 'Failed Tests',
      value: data.summary.failed,
      bgColor: 'error.lighter',
      iconBackgroundColor: 'error.main',
      icon: 'material-symbols:cancel',
    },
  ];

  const startedAtFormatted = (() => {
    if (!data.startedAt) return '-';

    const date = new Date(data.startedAt);

    const datePart = date.toLocaleDateString('id-ID', {
      timeZone: 'Asia/Jakarta',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const timePart = date.toLocaleTimeString('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `${datePart}, ${timePart} WIB`;
  })();

  return (
    <Paper sx={{ pt: 2.875, pb: 4, px: 4 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'stretch', md: 'center' }}
        gap={2}
        mb={5.375}
      >
        <div>
          <Typography variant="h4" mb={0.5}>
            Whitelabel All Mitra
          </Typography>

          <Typography variant="subtitle1" color="primary.lighter">
            Flow : Reservation
          </Typography>
        </div>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <DatePicker
              label="Execution Date"
              value={selectedDate ? dayjs(selectedDate) : null}
              onChange={(newValue) => {
                if (newValue) {
                  onDateChange(newValue.format('YYYY-MM-DD'));
                }
              }}
              inputFormat="DD MMM YYYY"
              shouldDisableDate={(date) => {
                return !availableDates.includes(date.format('YYYY-MM-DD'));
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{
                    width: 170,

                    '& .MuiInputBase-input': {
                      fontSize: 14,
                    },

                    '& .MuiInputLabel-root': {
                      fontSize: 14,
                    },

                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'grey.350',
                    },

                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },

                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>

          <Button
            component="a"
            variant="outlined"
            startIcon={<IconifyIcon icon="solar:download-linear" />}
            href={data.githubRunUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            disabled={!data.githubRunUrl}
          >
            Download Evidence
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={{ xs: 3.875, xl: 2 }} columns={{ xs: 1, sm: 2, md: 4 }}>
        {summaries.map((item) => {
          const status: Status =
            item.label === 'Passed Tests'
              ? 'Passed'
              : item.label === 'Failed Tests'
                ? 'Failed'
                : item.label === 'Flaky Tests'
                  ? 'Flaky'
                  : 'All';

          return (
            <Grid item xs={1} key={item.label}>
              <SaleCard item={item} onClick={() => onStatusChange(status)} />
            </Grid>
          );
        })}
      </Grid>

      <Typography variant="caption" color="primary.lighter">
        <br />
        Execution : {startedAtFormatted}
      </Typography>
    </Paper>
  );
};

export default Sales;
