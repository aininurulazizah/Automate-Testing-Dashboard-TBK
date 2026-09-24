import {
  Typography,
  Grid,
  Paper,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

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

  const formatDate = (date: string) => {
    return new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

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
          <FormControl size="small" sx={{ minWidth: 170 }}>
            <InputLabel id="execution-date-label" sx={{ fontSize: 14 }}>
              Execution Date
            </InputLabel>

            <Select
              labelId="execution-date-label"
              value={selectedDate ?? ''}
              label="Execution Date"
              onChange={(event) => onDateChange(event.target.value)}
              sx={{
                fontSize: 14,
                color: 'neutral.darker',

                '& .MuiSelect-select': {
                  py: 1.4,
                },

                '& .MuiSelect-icon': {
                  color: 'primary.lighter',
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
            >
              {availableDates.map((date) => (
                <MenuItem
                  key={date}
                  value={date}
                  sx={{
                    fontSize: 14,
                    color: 'primary.darker',
                  }}
                >
                  {formatDate(date)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
