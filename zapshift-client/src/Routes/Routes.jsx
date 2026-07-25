import { createBrowserRouter } from 'react-router';
import Root from '../Root/Root';
import Home from '../Pages/Home/Home';
import Coverage from '../Pages/Coverage/Coverage';
import Authentication from '../Pages/Authentication/Authentication';
import Login from '../Pages/Authentication/Login/Login';
import SignUp from '../Pages/Authentication/SignUp/SignUp';
import Rider from '../Pages/Rider/Rider';
import PrivateRoutes from './PrivateRoutes';
import RoleRoute from './RoleRoute';
import SendParcel from '../Pages/SendParcel/SendParcel';
import DashBoard from '../Pages/DashBoard/DashBoard';
import DashboardHome from '../Pages/DashBoard/DashboardHome';
import Myparcels from '../component/MyParcels/Myparcels';
import PaymentPage from '../Pages/PaymentPage/PaymentPage';
import PaymentSuccessPage from '../Pages/PaymentSuccessPage/PaymentSuccessPage';
import PaymentHistory from '../Pages/PaymentHistory/PaymentHistory';

// Rider dashboard pages
import PendingDeliveries from '../Pages/DashBoard/Rider/PendingDeliveries';
import CompletedDeliveries from '../Pages/DashBoard/Rider/CompletedDeliveries';
import MyEarnings from '../Pages/DashBoard/Rider/MyEarnings';

// Admin dashboard pages
import AdminOverview from '../Pages/DashBoard/Admin/AdminOverview';
import AllParcels from '../Pages/DashBoard/Admin/AllParcels';
import ManageRiders from '../Pages/DashBoard/Admin/ManageRiders';
import AssignRider from '../Pages/DashBoard/Admin/AssignRider';
import ManageUsers from '../Pages/DashBoard/Admin/ManageUsers';

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
            // Shared: role-aware landing page (index route for /dashboard)
            { index: true, Component: DashboardHome },

            // ---- User dashboard ----
            {
                path: '/dashboard/my-parcels',
                element: <RoleRoute roles={['user']}><Myparcels /></RoleRoute>,
            },
            {
                path: '/dashboard/payment-history',
                element: <RoleRoute roles={['user']}><PaymentHistory /></RoleRoute>,
            },
            {
                path: '/dashboard/payment/:parcelId',
                element: <RoleRoute roles={['user']}><PaymentPage /></RoleRoute>,
            },
            {
                path: '/dashboard/payment-success',
                element: <RoleRoute roles={['user']}><PaymentSuccessPage /></RoleRoute>,
            },

            // ---- Rider dashboard ----
            {
                path: '/dashboard/rider/pending-deliveries',
                element: <RoleRoute roles={['rider']}><PendingDeliveries /></RoleRoute>,
            },
            {
                path: '/dashboard/rider/completed-deliveries',
                element: <RoleRoute roles={['rider']}><CompletedDeliveries /></RoleRoute>,
            },
            {
                path: '/dashboard/rider/my-earnings',
                element: <RoleRoute roles={['rider']}><MyEarnings /></RoleRoute>,
            },

            // ---- Admin dashboard ----
            {
                path: '/dashboard/admin/overview',
                element: <RoleRoute roles={['admin']}><AdminOverview /></RoleRoute>,
            },
            {
                path: '/dashboard/admin/all-parcels',
                element: <RoleRoute roles={['admin']}><AllParcels /></RoleRoute>,
            },
            {
                path: '/dashboard/admin/manage-riders',
                element: <RoleRoute roles={['admin']}><ManageRiders /></RoleRoute>,
            },
            {
                path: '/dashboard/admin/assign-rider',
                element: <RoleRoute roles={['admin']}><AssignRider /></RoleRoute>,
            },
            {
                path: '/dashboard/admin/manage-users',
                element: <RoleRoute roles={['admin']}><ManageUsers /></RoleRoute>,
            },
        ],
    },
]);
