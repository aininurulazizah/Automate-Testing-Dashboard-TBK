import { SvgIconProps } from '@mui/material';
import { rootPaths } from './paths';
import DashboardIcon from 'components/icons/DashboardIcon';

export interface MenuItem {
  id: number;
  name: string;
  pathName: string;
  path?: string;
  active?: boolean;
  icon?: string;
  svgIcon?: (props: SvgIconProps) => JSX.Element;
  items?: MenuItem[];
}

const sitemap: MenuItem[] = [
  {
    id: 1,
    name: 'Automate Test Summary Report',
    path: rootPaths.root,
    pathName: 'dashboard',
    svgIcon: DashboardIcon,
    active: true,
  },
];

export default sitemap;
