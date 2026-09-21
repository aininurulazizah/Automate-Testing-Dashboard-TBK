import { SvgIconProps } from '@mui/material';

export interface DashboardData {
  startedAt: string | null;
  generatedAt: string;

  summary: {
    total: number;
    passed: number;
    failed: number;
    flaky: number;
    skipped: number;
    duration: number;
    durationFormatted: string;
  };

  details: {
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
  }[];
}

export interface SummaryItem {
  label: string;
  value: number;
  bgColor: string;
  iconBackgroundColor: string;
  icon?: string;
  svgIcon?: (props: SvgIconProps) => JSX.Element;
}

export interface DetailItem {
  id: number;
  name: string;
  priority: 'Passed' | 'Failed' | 'Flaky';
  detail: {
    bookingCode?: string;
    error?: string;
  }[];
}
