import { SvgIconProps } from '@mui/material';
import report from './dashboard-data.json';

export interface SummaryItem {
  label: string;
  value: number;
  bgColor: string;
  iconBackgroundColor: string;
  icon?: string;
  svgIcon?: (props: SvgIconProps) => JSX.Element;
}

export const summaries: SummaryItem[] = [
  {
    label: 'Total Tests',
    value: report.summary.total,
    bgColor: 'secondary.lighter',
    iconBackgroundColor: 'secondary.main',
    icon: 'material-symbols:lab-profile',
  },
  {
    label: 'Passed Tests',
    value: report.summary.passed,
    bgColor: 'success.lighter',
    iconBackgroundColor: 'success.darker',
    icon: 'material-symbols:check-circle',
  },
  {
    label: 'Flaky Tests',
    value: report.summary.flaky,
    bgColor: 'warning.lighter',
    iconBackgroundColor: 'error.dark',
    icon: 'material-symbols:warning',
  },
  {
    label: 'Failed Tests',
    value: report.summary.failed,
    bgColor: 'error.lighter',
    iconBackgroundColor: 'error.main',
    icon: 'material-symbols:cancel',
  },
];

export const generatedAt = report.generatedAt;

export const generatedAtFormatted = (() => {
  const date = new Date(report.generatedAt);

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
