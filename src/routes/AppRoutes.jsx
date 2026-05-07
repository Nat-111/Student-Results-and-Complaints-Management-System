
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import { useAuth } from '../context/AuthContext';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentResults from '../pages/student/Results';
import StudentComplaints from '../pages/student/Complaints';
import StudentTrackComplaint from '../pages/student/TrackComplaint';

// Staff Pages
import StaffDashboard from '../pages/staff/Dashboard';
import StaffManageResults from '../pages/staff/ManageResults';
import StaffHandleComplaints from '../pages/staff/HandleComplaints';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import ManageUsers from '../pages/admin/ManageUsers';
import SystemReports from '../pages/admin/SystemReports';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Student Routes */}
      <Route path="/student" element={
        <ProtectedRoute allowedRoles={['student']}>
          <Outlet />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="complaints" element={<StudentComplaints />} />
        <Route path="track-complaint" element={<StudentTrackComplaint />} />
      </Route>

      {/* Staff Routes */}
      <Route path="/staff" element={
        <ProtectedRoute allowedRoles={['staff']}>
          <Outlet />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<StaffDashboard />} />
        <Route path="manage-results" element={<StaffManageResults />} />
        <Route path="handle-complaints" element={<StaffHandleComplaints />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Outlet />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reports" element={<SystemReports />} />
      </Route>

      {/* Catch-all and Redirects */}
      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

const RootRedirect = () => {
  const { isAuthenticated, role, loading } = useAuth();
  
  if (loading) return null;
  
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  const dashboardMap = {
    student: '/student/dashboard',
    staff: '/staff/dashboard',
    admin: '/admin/dashboard',
  };
  
  return <Navigate to={dashboardMap[role] || '/login'} replace />;
};

export default AppRoutes;
