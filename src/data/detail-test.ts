import report from './dashboard-data.json';

export interface Item {
  id: number;
  name: string;
  priority: 'Passed' | 'Failed' | 'Flaky';
  detail: {
    bookingCode?: string;
    error?: string;
  }[];
}

type ReportDetail = {
  title: string;
  status: string;
  duration: number;
  browser: string;
  startTime: string;
  bookingCode?: string | null;
  error?: {
    summary?: string | null;
    detail?: string | null;
  } | null;
};

export const Details: Item[] = (report.details as ReportDetail[]).map((item, index) => ({
  id: index + 1,
  name: item.title,
  priority: item.status === 'passed' ? 'Passed' : item.status === 'failed' ? 'Failed' : 'Flaky',
  detail: [
    item.status === 'failed'
      ? {
          error: item.error?.summary ?? '-',
        }
      : {
          bookingCode: item.bookingCode ?? '-',
        },
  ],
}));
