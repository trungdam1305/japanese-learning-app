import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, type Role } from '../shared/auth/authStore';

export default function RequireRole({ role }: { role: Role }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== role) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} replace />;
  }
  return <Outlet />;
}
