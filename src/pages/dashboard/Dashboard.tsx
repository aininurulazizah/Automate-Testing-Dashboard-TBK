import { useState } from 'react';
import { Grid } from '@mui/material';
import { useParams } from 'react-router-dom';

import Summaries from 'components/sections/dashboard/todays-sales/Summaries';
import Details from 'components/sections/dashboard/top-products/Details';

import report from 'data/dashboard-data.json';
import { executions } from 'data/executions';

import type { Status } from 'components/sections/dashboard/todays-sales/Summaries';

const Dashboard = () => {
  const { date } = useParams();

  const [selectedStatus, setSelectedStatus] = useState<Status>('All');

  const selectedExecution = date
    ? executions.find((execution) => execution.date === date)?.data
    : report;

  if (date && !selectedExecution) {
    return <div>Data execution untuk tanggal {date} tidak ditemukan.</div>;
  }

  const dashboardData = selectedExecution ?? report;

  return (
    <>
      <Grid container spacing={4}>
        <Grid item xs={12} xl={7}>
          <Summaries data={dashboardData} onStatusChange={setSelectedStatus} />
        </Grid>

        <Grid item xs={12} xl={5}>
          <Details data={dashboardData} selectedStatus={selectedStatus} />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
