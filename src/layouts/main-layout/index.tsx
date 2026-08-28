import { Box, Stack, Toolbar } from '@mui/material';
import { PropsWithChildren, useState } from 'react';
import Topbar from './topbar/Topbar';
import Footer from './footer/Footer';

const drawerWidth = 0;

const MainLayout = ({ children }: PropsWithChildren) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing] = useState(false);

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Stack direction="row">
      <Topbar drawerWidth={drawerWidth} onHandleDrawerToggle={handleDrawerToggle} />

      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          p: {
            xs: theme.spacing(4, 2),
            sm: theme.spacing(4, 5),
            lg: theme.spacing(4),
          },
          minHeight: '100vh',
          width: { xs: 1, sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: 'neutral.lighter',
        })}
      >
        <Toolbar />
        {children}
        <Footer />
      </Box>
    </Stack>
  );
};

export default MainLayout;
