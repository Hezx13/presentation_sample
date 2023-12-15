// AppRouter.js
import React from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ListsPage from './listsPage';
import TablesPage from './components/tablesPage'
import ArchivePage from "./archivePage";
import DashboardPage from "./dashboardPage";
import VerticalTabs from "./projectsPage";
import ReportsPage from "./ReportsPage";
import ReportDetailedTable from "./components/ReportDetailedTable";
import Login from "./loginPage";
import Register from "./registerPage";
import FullFeaturedCrudGrid from "./components/DataGridComponent";
const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListsPage/>}/>
                <Route path="/table" element={<TablesPage/>}/>
                <Route path="/archive" element={<ArchivePage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
                <Route path="/projects" element={<VerticalTabs/>}/>
                <Route path="/reports" element={<ReportsPage/>}/>
                <Route path="/report" element={<ReportDetailedTable/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/test" element={<FullFeaturedCrudGrid/>}/>
                <Route path="*" element={<Navigate to="/"/>} />
            </Routes>
        </Router>
        );
};

export default AppRouter;