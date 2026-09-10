import { useState } from 'react';
import { Grid } from '@mui/material';
import Summaries from 'components/sections/dashboard/todays-sales/Summaries';
import Details from 'components/sections/dashboard/top-products/Details';

export type Status = 'All' | 'Passed' | 'Failed' | 'Flaky';

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState<Status>('All');

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} xl={7}>
        <Summaries onStatusChange={setSelectedStatus} />
      </Grid>

      <Grid item xs={12} xl={5}>
        <Details selectedStatus={selectedStatus} />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
