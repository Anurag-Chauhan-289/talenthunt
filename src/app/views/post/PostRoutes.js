import Loadable from 'app/components/Loadable';
import { lazy } from 'react';

const CreatPost = Loadable(lazy(() => import('./CreatePost')));
const ListPost = Loadable(lazy(() => import('./ListPost')));
const DetailPost = Loadable(lazy(() => import('./DetailPost')));

const postRoutes = [
    {
        path: '/post/CreatePost', element: <CreatPost />,
    },
    {
        path: '/post/listPost', element: <ListPost />,
    },
    {
        path: '/post/detailPost', element: <DetailPost />,
    }
];

export default postRoutes;