import { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Navigate } from "react-router-dom";
import NavBar from "../components/navBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getSavedMaterials } from "../api/materials-api";
import SavedMaterialsToolbar from "../components/DataGridComponents/SavedMaterialsToolbar";

const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date ordered', width: 160, editable: false },
    {
      field: 'text',
      headerName: 'Material',
      type: 'string',
      minWidth: 150,
      flex: 4,
      align: 'left',
      headerAlign: 'left',
      editable: false,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      minWidth: 80,
      flex: 1,
      editable: false,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: false,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      minWidth: 80,
      editable: false,
      type: 'string',
    },
    {
      field: 'comment',
      headerName: 'Invoice / Note',
      minWidth: 80,
      flex: 2,
      editable: false,
      type: 'string',
    },
    {
      field: 'orderedBy',
      headerName: 'Ordered by',
      minWidth: 80,
      flex: 2,
      editable: false,
      type: 'string',
    },
    {
        field: 'listParentName',
        headerName: 'Project',
        minWidth: 80,
        flex: 2,
        editable: false,
        type: 'string',
        valueGetter: (params) => params.row.listParent.name,
      },
]

export default function SavedMaterialsPage() {
    const [isLoggedIn] = useState(!!localStorage.getItem('token'));
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        getSavedMaterials().then((savedMaterials) => {
            setMaterials(savedMaterials);
        })
    },[])

    console.log(materials)

    return (
        <Grid container>
            {!isLoggedIn && <Navigate to="/login"/>}

                <Grid item xs={12} sx={{marginBottom: '15px'}}>
                    <NavBar/>
                </Grid>
                {
                    materials.length && <DataGrid
                    rows={materials}
                    columns={columns}
                    checkboxSelection
                    slots={{
                      toolbar: SavedMaterialsToolbar,
                    }}
                />
                }
                </Grid>
    )
}