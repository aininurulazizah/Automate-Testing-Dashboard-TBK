import { DashboardData } from './types';

const executionFiles = import.meta.glob<DashboardData>('./executions/*.json', {
  eager: true,
  import: 'default',
});

export const executions = Object.entries(executionFiles)
  .map(([filePath, data]) => {
    const fileName = filePath.split('/').pop()!;

    const date = fileName.replace('.json', '');

    return {
      date,
      data,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));
