import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRouteAdmin = () => {
  const isAuthenticated = useSelector((state) => state.authAdminReducer.isAuthenticated);
  if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouteAdmin;
