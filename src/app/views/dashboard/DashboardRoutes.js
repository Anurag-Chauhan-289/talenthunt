import Loadable from 'app/components/Loadable';
import { lazy } from 'react';
import { authRoles } from '../../auth/authRoles';

const Analytics = Loadable(lazy(() => import('./Analytics')));
// debugger
const dashboardRoutes = [
  { path: '/dashboard', element: <Analytics />, auth: authRoles.admin },
  // { path: '/signin-oidc', element: <Analytics />, auth: authRoles.admin },
];

export default dashboardRoutes;
