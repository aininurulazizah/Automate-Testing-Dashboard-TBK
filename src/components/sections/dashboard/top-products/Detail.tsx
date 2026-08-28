import { useState } from 'react';
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TableCell,
  TableRow,
  Typography,
  Button,
  useTheme,
} from '@mui/material';
import { Item } from 'data/detail-test';

const Detail = ({ item }: { item: Item }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const { id, name, priority, detail } = item;
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
            View &gt;&gt;
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{name}</DialogTitle>

        <DialogContent>
          {detail.map((item, index) => (
            <div key={index} style={{ marginBottom: 20 }}>
              {item.bookingCode && (
                <Typography color="primary">Booking Code : {item.bookingCode}</Typography>
              )}

              {item.error && <Typography color="error">Error : {item.error}</Typography>}
            </div>
          ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Detail;
