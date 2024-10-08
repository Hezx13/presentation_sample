import React from 'react';
import TableComponent from "./tableComponent";
import { useLocation } from 'react-router-dom';
import {Grid} from "@mui/material";
import NavBar from './navBar'
import FullFeaturedCrudGrid from './DataGridComponent';

const TablesPage: React.FC = () => {
    const location = useLocation();
    const receivedData = location.state?.myData || 0;
    return(
        <>
            <Grid container>
                <Grid item xs={12}>
                    <NavBar/>
                </Grid>
                <Grid item xs={12}>
                    <FullFeaturedCrudGrid
                        tableId={receivedData}
                    />
                </Grid>

            </Grid>

        </>
    )
}

export default TablesPage;