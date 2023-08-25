// AppRouter.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListsPage from './listsPage';
import TablesPage from './components/tablesPage'
import ArchivePage from "./archivePage";
import DashboardPage from "./dashboardPage";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ListsPage/>}/>
                <Route path="/table" element={<TablesPage/>}/>
                <Route path="/archive" element={<ArchivePage/>}/>
                <Route path="/dashboard" element={<DashboardPage/>}/>
            </Routes>
        </Router>
        );
};

export default AppRouter;