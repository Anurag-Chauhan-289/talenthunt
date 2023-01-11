import AuthGuard from 'app/auth/AuthGuard';
import chartsRoute from 'app/views/charts/ChartsRoute';
import dashboardRoutes from 'app/views/dashboard/DashboardRoutes';
import materialRoutes from 'app/views/material-kit/MaterialRoutes';
import NotFound from 'app/views/sessions/NotFound';
import sessionRoutes from 'app/views/sessions/SessionRoutes';
import { Navigate } from 'react-router-dom';
import MatxLayout from './components/MatxLayout/MatxLayout';
import postRoutes from './views/post/PostRoutes';
import userRoutes from './views/users/UserRoutes';

const routes = [
  {
    element: (
      <AuthGuard>
        <MatxLayout />
      </AuthGuard>
    ),
    children: [...dashboardRoutes, ...chartsRoute, ...materialRoutes, ...userRoutes, ...postRoutes],
  },
  ...sessionRoutes,
  { path: '/', element: <Navigate to="dashboard" /> },
  // { path: '/', element: <Navigate to="signin-oidc" /> },
  { path: '*', element: <NotFound /> }
  // { path: '/detailPost', element: <Navigate to="DetailPost" /> },
];

export default routes;
