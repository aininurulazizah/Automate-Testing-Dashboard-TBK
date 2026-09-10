import { Typography, Grid, Paper, Stack, Button } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import { generatedAtFormatted, summaries } from 'data/summary-test';
import SaleCard from './SummaryCard';

type Status = 'All' | 'Passed' | 'Failed' | 'Flaky';

type SalesProps = {
  onStatusChange: (status: Status) => void;
};

const Sales = ({ onStatusChange }: SalesProps) => {
  return (
    <Paper sx={{ pt: 2.875, pb: 4, px: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={5.375}>
        <div>
          <Typography variant="h4" mb={0.5}>
            Whitelabel All Mitra
          </Typography>

          <Typography variant="subtitle1" color="primary.lighter">
            Flow : Reservation
          </Typography>
        </div>

        <Button variant="outlined" startIcon={<IconifyIcon icon="solar:upload-linear" />}>
          Export
        </Button>
      </Stack>

      <Grid container spacing={{ xs: 3.875, xl: 2 }} columns={{ xs: 1, sm: 2, md: 4 }}>
        {summaries.map((item) => {
          const status =
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
        Last Execution : {generatedAtFormatted}
      </Typography>
    </Paper>
  );
};

export default Sales;
