// AppRouter.js
import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ListsPage from './listsPage';
import TablesPage from './components/tablesPage'
import ArchivePage from "./archivePage";
import DashboardPage from "./dashboardPage";
import VerticalTabs from "./projectsPage";
import ReportsPage from "./ReportsPage";
import ReportDetailedTable from "./components/ReportDetailedTable";
import Login from "./loginPage";
import Register from "./registerPage";
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
            </Routes>
        </Router>
        );
};

export default AppRouter;