import { Grid } from '@mui/material';
import Summaries from 'components/sections/dashboard/todays-sales/Summaries';
import Details from 'components/sections/dashboard/top-products/Details';

const Dashboard = () => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} xl={7}>
        <Summaries />
      </Grid>

      <Grid item xs={12} xl={5}>
        <Details />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
