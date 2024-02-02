import { Grid } from "@mui/material";
import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./components/navBar";
import { getUsers } from "./api/user-api";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import UserManagementTable from "./components/UserManagementTable";



const ManagementPage = () => {
    const [isLoggedIn] = React.useState(!!localStorage.getItem('token'));    
   

    return (
        <Grid container justifyContent="center">
            {!isLoggedIn && <Navigate to="/login"/>}
            <Grid item xs={12}>
                <NavBar/>
            </Grid>
            <Grid item xs={12}>
            <UserManagementTable/>
            </Grid>
        </Grid>
    )
}

export default ManagementPage;
