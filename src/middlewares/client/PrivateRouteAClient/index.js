import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouteClient = () => {
    const isAuthenticated = useSelector((state) => state.authClientReducer.isAuthenticated);
    if (!isAuthenticated) {
        return <Navigate to="/users/login" replace />;
    }

    return <Outlet />;
};

export default PrivateRouteClient;
