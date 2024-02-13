// AppRouter.js
import React from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ListsPage from './pages/listsPage';
import TablesPage from './components/tablesPage'
import ArchivePage from "./pages/archivePage";
import DashboardPage from "./pages/dashboardPage";
import VerticalTabs from "./pages/projectsPage";
import ReportsPage from "./pages/ReportsPage";
import ReportDetailedTable from "./components/ReportDetailedTable";
import Login from "./pages/loginPage";
import Register from "./pages/registerPage";
import ManagementPage from "./pages/ManagementPage";
import SavedMaterialsPage from "./pages/SavedMaterialsPage";

const PrivateRoute = ({ children, roles }) => {
    const currentUserRole = localStorage.getItem('role');
  
    if (!currentUserRole || !roles.includes(currentUserRole)) {
        // User not authorized, redirecting to login
        return <Navigate to="/" />;
      }

      return children;
  };

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListsPage/>}/>
                <Route path="/table" element={<TablesPage/>}/>
                <Route path="/archive" element={
                    <PrivateRoute roles={['Admin']}>
                        <ArchivePage/>
                    </PrivateRoute>
                }/>
                <Route path="/dashboard" element={
                    <PrivateRoute roles={['Admin']}>
                        <DashboardPage/>
                    </PrivateRoute>
                }/>
                <Route path="/management" element={
                    <PrivateRoute roles={['Admin']}>
                        <ManagementPage/>
                    </PrivateRoute>
                }/>
                <Route path="/saved" element={
                    <PrivateRoute roles={['Admin']}>
                        <SavedMaterialsPage/>
                    </PrivateRoute>
                }/>
=                <Route path="/projects" element={<VerticalTabs/>}/>
                <Route path="/reports" element={
                    <PrivateRoute roles={['Admin']}>
                        <ReportsPage/>
                    </PrivateRoute>
                }/>
                <Route path="/report" element={
                    <PrivateRoute roles={['Admin']}>
                        <ReportDetailedTable/>
                    </PrivateRoute>
                }/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="*" element={<Navigate to="/"/>} />
            </Routes>
        </Router>
        );
};

export default AppRouter;