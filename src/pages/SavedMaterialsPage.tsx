import { useEffect, useState, useMemo } from "react";
import { Grid } from "@mui/material";
import { Navigate } from "react-router-dom";
import NavBar from "../components/navBar";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getSavedMaterials } from "../api/materials-api";
import SavedMaterialsToolbar from "../components/DataGridComponents/SavedMaterialsToolbar";



export default function SavedMaterialsPage() {
    const [isLoggedIn] = useState(!!localStorage.getItem('token'));
    const [materials, setMaterials] = useState<Material[]>([]);

    useEffect(() => {
        getSavedMaterials().then((savedMaterials) => {
            setMaterials(savedMaterials);
        })
    },[])

    let columns: GridColDef[] = [
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

    const hasArticle = useMemo(()=>{return materials.some(row => row.article !== '')}, [materials])

    const articleColumn: GridColDef = {
      field: 'article',
      headerName: 'Article №',
      type: 'string',
      minWidth: 150,
      flex: 1,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    }

    if (hasArticle) {
      columns = [
        ...columns.slice(0, 1), // First two columns
        articleColumn,
        ...columns.slice(1),   // Remaining columns
      ];
    }

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