import { createBrowserRouter } from 'react-router';
import Root from '../Root/Root';
import Home from '../Pages/Home/Home';
import Coverage from '../Pages/Coverage/Coverage';
import Authentication from '../Pages/Authentication/Authentication';
import Login from '../Pages/Authentication/Login/Login';
import SignUp from '../Pages/Authentication/SignUP/SignUp';
import Rider from '../Pages/Rider/Rider';
import PrivateRoutes from './PrivateRoutes';
import SendParcel from '../Pages/SendParcel/SendParcel';
import DashBoard from '../Pages/DashBoard/DashBoard';
import Myparcels from '../component/MyParcels/Myparcels';
import PaymentPage from '../Pages/PaymentPage/PaymentPage';
import PaymentSuccessPage from '../Pages/PaymentSuccessPage/PaymentSuccessPage';
import PaymentHistory from '../Pages/PaymentHistory/PaymentHistory';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        children: [
            { index: true, Component: Home },
            {
                path: '/coverage',
                Component: Coverage,
                loader: () => fetch('/serviceCenters.json').then((res) => res.json()),
            },
            {
                path: '/be-rider',
                element: <PrivateRoutes><Rider /></PrivateRoutes>,
            },
            {
                path: '/send-parcel',
                element: <PrivateRoutes><SendParcel /></PrivateRoutes>,
                loader: () => fetch('/serviceCenters.json').then((res) => res.json()),
            },
        ],
    },
    {
        path: '/auth',
        Component: Authentication,
        children: [
            { path: '/auth/login', Component: Login },
            { path: '/auth/signup', Component: SignUp },
        ],
    },
    {
        path: '/dashboard',
        element: <PrivateRoutes><DashBoard /></PrivateRoutes>,
        children: [
            { path: '/dashboard/my-parcels', Component: Myparcels },
            { path: '/dashboard/payment/:parcelId', Component: PaymentPage },
            { path: '/dashboard/payment-success', Component: PaymentSuccessPage },
            { path: '/dashboard/payment-history', Component: PaymentHistory },
        ],
    },
]);
