import React, {useEffect, useState, useRef} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import {findItemIndexById} from "../utils/arrayUtils";
import { Navigate } from 'react-router-dom';
import { editTask, removeTask } from '../state/actions';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  useGridApiContext,
  GridApi,
} from '@mui/x-data-grid';
import { useAppState } from '../state/AppStateContext';
import { Task } from '../state/appStateReducer';

const roles = ['Market', 'Finance', 'Development'];


interface EditToolbarProps {
  apiRef: any,
  setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  setRowModesModel: (
    newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
  ) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const {setRows, setRowModesModel } = props;

  const handleAdd = () => {
    console.log("add")
  };

  function createMailToLink(email: string, subject: string, body:string) {
    console.log(email, subject ,body);
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const apiRef = useGridApiContext();

  const handleSend = () => {
    const selectedMaterials = apiRef.current.getSelectedRows();
    let message = ''
    selectedMaterials.forEach(entry => {
      message += entry.text + '\n';
  });
  const email = 'example@example.com';
    const subject = 'Order';
  const link = createMailToLink(email,subject,message)
  window.location.href = link;
  }
  
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
        Add record
      </Button>
      <Button color="primary" startIcon={<SendOutlinedIcon/>} onClick={handleSend}>
        Send selected
      </Button>
    </GridToolbarContainer>
  );
}
//g2VTbod_MHHF8VyNpsYt6
export default function FullFeaturedCrudGrid({tableId}) {
  const [rows, setRows] = React.useState<Task[]>([]);
  const [isSaving, setIsSaving] = React.useState(false)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const { lists, archive, dispatch } = useAppState()

  useEffect(() => {
        const id_a = findItemIndexById(archive, tableId)
        const id_l =  findItemIndexById(lists, tableId)
        if (id_a > -1){
            setRows(archive[id_a].tasks)
        }
        else if (id_l > -1) {
            setRows(lists[id_l].tasks)
        }
    }, [tableId,lists]);

    // useEffect(() => {
    //     setFilteredTasks (tasks.filter(task => {
    //         return task.text.toLowerCase().includes(searchTerm.toLowerCase());
    //     }))
    // }, [searchTerm]);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setIsSaving(true);
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId, row: GridRowModel) => () => {
    const shouldRemove = window.confirm("Are you sure you want to remove " + row.text + " ?" );

    if (shouldRemove) {
      dispatch(removeTask(tableId, id as string));
      setRows(rows.filter((row) => row.id !== id));
  }
    
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
    const editedRow = rows.find((row) => row.id === id);
    if (editedRow) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridRowModel) => {
    setIsSaving(true);
    const updatedRow = { ...newRow};
    dispatch(editTask(
      newRow.id,
      tableId,
      newRow.text,
      newRow.article,
      newRow.price,
      newRow.quantity,
      newRow.date,
      newRow.unit,
      newRow.comment,
      newRow.deliveryDate,
      newRow.orderedBy,
      newRow.status,
      newRow.payment
      ))
      let newrows = rows.map((row) => (row.id === newRow.id ? updatedRow : row)) as Task[]
    setRows(newrows);
    setIsSaving(false);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'date', headerName: 'Date ordered', width: 160, editable: false },
    {
      field: 'text',
      headerName: 'Material',
      type: 'string',
      flex: 2,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      width: 80,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'string',
      width: 80,
      editable: true,
    },
    {
      field: 'unit',
      headerName: 'Unit',
      width: 100,
      editable: true,
      type: 'string',
    },
    {
      field: 'comment',
      headerName: 'Comment',
      flex: 1,
      editable: true,
      type: 'string',
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      editable: true,
      type: 'string',
    },
    {
      field: 'payment',
      headerName: 'Payment',
      width: 100,
      editable: true,
      type: 'string',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 120,
       cellClassName: 'actions',
      getActions: ({ id, row }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode)
          return [
            <GridActionsCellItem
              icon={ isSaving ? <HourglassBottomOutlinedIcon/> : <SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
          return [
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />,
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id, row)}
              color="inherit"
            />,
          ];
      },
    },
  ];

  return (
    <Box
      sx={{
        borderRadius: '10px',
        border: '1px solid orange',
        padding: '1px',
        height: 'auto',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        checkboxSelection
        slotProps={{
          toolbar: { setRows, setRowModesModel },
        }}
      />
    </Box>
  );
}