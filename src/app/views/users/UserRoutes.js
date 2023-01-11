import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const UserList = Loadable(lazy(() => import('./UserList')));
const UserDetails = Loadable(lazy(() => import('./UserDetails')));

const userRoutes = [
    {
        path: '/users/UserList', element: <UserList />,
    },
    {
        path: '/users/UserDetails', element: <UserDetails />
    }
];

export default userRoutes;