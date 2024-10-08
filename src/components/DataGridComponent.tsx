import React, {useEffect, useState, useRef} from 'react';
import Box from '@mui/material/Box';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Action } from '../state/actions';
import EditIcon from '@mui/icons-material/Edit';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import {findItemIndexById} from "../utils/arrayUtils";
import { Status, AddItemButton } from '../styles/styles';
import {addTask, editTask, moveFromArchive, removeTask} from "../state/actions";
import { getCurrentDateAndTime } from "../utils/timeUtils";
import {AddNewItem} from "./AddNewItem";
import { getUserData, getUsers } from '../api/user-api';
import { onUploadSingle } from '../api';

import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridRenderEditCellParams,
} from '@mui/x-data-grid';
import EditToolbar from './DataGridComponents/EditToolBar';
import { useAppState } from '../state/AppStateContext';
import { Task } from '../state/appStateReducer';
import { MenuItem, Select, TextField } from '@mui/material';
import NoDataPlaceholder from './DataGridComponents/NoDataPlaceholder';
import dayjs from 'dayjs';

const statuses = ["Done", "In process", "Waiting for approval", "Waiting for payment", "Pending"]
const payments = ["Cash", "Credit", "Pemo Card", "Bank Transfer", ""]


export default function FullFeaturedCrudGrid({tableId}) {
  const [rows, setRows] = React.useState<Task[]>([]);
  const [isSaving, setIsSaving] = React.useState(false)
  const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
  const { lists, archive,role, dispatch } = useAppState()
  const [userData,setUserData] = useState< {username: string} | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[]>([]);
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

    useEffect(() =>{
      try{
          getUserData().then(user => {
              const userData = {
                  username: user.username
              }
              setUserData(userData);
          })
          if (role === "Admin"){
            getUsers().then(usrs => {
              setUsers(usrs);
            })
          }
      } catch(error) {
          setUserData(null);
      }        
  },[]);

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
  };

  const handleUploadClick = () => {
    fileInput.current!.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    file && onUploadSingle(file, tableId)
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
      new Date(newRow.date),
      newRow.unit,
      newRow.comment,
      new Date(newRow.deliveryDate),
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

  const hasArticle = rows.some(row => row.article !== '');

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

  let columns: GridColDef[] = [
    { 
    field: 'date', 
    headerName: 'Date ordered', 
    width: 160, 
    editable: false,
    valueGetter: (params) => {
      // Convert the date from the ISO format to DD-MM-YY
      const valueFormatted = params.value ? dayjs(params.value).format('DD-MM-YYYY HH:MM') : '';
      return valueFormatted;
    },
  },
    {
      field: 'text',
      headerName: 'Material',
      type: 'string',
      minWidth: 150,
      flex: 4,
      align: 'left',
      headerAlign: 'left',
      editable: true,
    },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      align: 'left',
      headerAlign: 'left',
      minWidth: 80,
      flex: 1,
      editable: true,
    },
    {
      field: 'price',
      headerName: 'Price',
      type: 'string',
      minWidth: 80,
      flex: 1,
      editable: true,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      type: 'number',
      minWidth: 80,
      flex: 1,
      valueGetter: (params) => {
        const value1 = params?.row.quantity || 1;
        const value2 = params?.row?.price?.split(' ')[0] || params.row.price || 0;
        return Number(value1) * Number(value2);
      },
    },
    {
      field: 'unit',
      headerName: 'Unit',
      flex: 1,
      minWidth: 80,
      editable: true,
      type: 'string',
    },
    {
      field: 'comment',
      headerName: 'Invoice / Note',
      minWidth: 80,
      flex: 2,
      editable: true,
      type: 'string',
    },
    {
      field: 'deliveryDate',
      headerName: 'Delivered',
      minWidth: 80,
      flex: 2,
      editable: true,
      renderEditCell: (params) => {
        console.log(dayjs("29-03-2024"))
        console.log(params.value)
        return (
            <DatePicker
              value={dayjs(new Date(params.value))}
              onChange={(newValue) => {
                console.log(newValue);
                const formattedValue = newValue ? dayjs(newValue) : newValue;

                params.api.setEditCellValue({ id: params.id, field: params.field, value: formattedValue });
              }}
            />
        );
      },
      renderCell: (params) => {
        const valueFormatted = params.value ? dayjs(params.value).format('DD-MM-YYYY') : null;
        return valueFormatted;
      },
      type: 'string'
    },
    {
      field: 'orderedBy',
      headerName: 'Ordered by',
      minWidth: 80,
      flex: 2,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Select
          value={params.value || ''}
          onChange={(event) => {
            params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value }, event);
          }}
          fullWidth
        >
          {users.map((usr) => (
            <MenuItem key={usr.email} value={usr.username}>
              {usr.username}
            </MenuItem>
          ))}
        </Select>
      ),
      type: 'string',
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 80,
      flex: 2,
      editable: true,
      renderCell: (params) => {
        const color = params.value === 'Done' ? 'green'
                      : params.value === 'Waiting for approval' ? 'blue'
                      : params.value === 'In process' ? 'orange'
                      : params.value === 'Waiting for payment' ? 'red'
                      : 'grey';
        return   <div style={{ display: 'flex', alignItems: 'center' }}>

        <Status color={color}></Status>
        <div>{params.value}</div>
        </div>
      },
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Select
          value={params.value || ''}
          onChange={(event) => {
            params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value }, event);
          }}
          fullWidth
        >
          {statuses.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ),
      type: 'singleSelect',
    },
    {
      field: 'payment',
      headerName: 'Payment',
      width: 100,
      editable: true,
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Select
          value={params.value || ''}
          onChange={(event) => {
            params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value }, event);
          }}
          fullWidth
        >
          {payments.map((option) => (
            <MenuItem key={option} value={option}>
              {option === "" ? 'Not paid' : option}
            </MenuItem>
          ))}
        </Select>
      ),
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

  let userColumns: GridColDef[] = [
    { field: 'date', 
    headerName: 'Date ordered', 
    width: 160, 
    editable: false,
    valueGetter: (params) => {
      let date = dayjs(params.value).format('DD-MM-YYYY HH:MM');
      return date === 'Invalid Date'? '' : date;
    },
   },
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
      field: 'comment',
      headerName: 'Comment',
      type: 'string',
      minWidth: 80,
      flex: 1,
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
      field: 'deliveryDate',
      headerName: 'Delivered',
      minWidth: 80,
      flex: 2,
      editable: false,
      type: 'string',
      valueGetter: (params) => {
        let date = dayjs(params.value).format('DD-MM-YYYY');
        return date === 'Invalid Date'? '' : date;
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      minWidth: 80,
      flex: 2,
      editable: false,
      renderCell: (params) => {
        const color = params.value === 'Done' ? 'green'
                      : params.value === 'Waiting for approval' ? 'blue'
                      : params.value === 'In process' ? 'orange'
                      : params.value === 'Waiting for payment' ? 'red'
                      : 'grey';
        return   <div style={{ display: 'flex', alignItems: 'center' }}>

        <Status color={color}></Status>
        <div>{params.value}</div>
        </div>
      },
      renderEditCell: (params: GridRenderEditCellParams) => (
        <Select
          value={params.value || ''}
          onChange={(event) => {
            params.api.setEditCellValue({ id: params.id, field: params.field, value: event.target.value }, event);
          }}
          fullWidth
        >
          {statuses.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ),
      type: 'singleSelect',
    }
  ];

  if (hasArticle) {
    columns = [
      ...columns.slice(0, 1), // First two columns
      articleColumn,
      ...columns.slice(1),   // Remaining columns
    ];

    userColumns = [
      ...userColumns.slice(0, 1), // First two columns
      articleColumn,
      ...userColumns.slice(1),   // Remaining columns
    ]
  }

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
      {
        rows.length > 0 ? (
          <DataGrid
        rows={rows || []}
        columns={role === 'Admin'? columns : userColumns}
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
          toolbar: { dispatch, tableId, userData, setRowModesModel, },
        }}
      />
        ) : (
          <NoDataPlaceholder>
            <AddNewItem
            toggleButtonText="+ Add another material"
            onAdd={
              (text,article, price, quantity, unit, comment, deliveryDate, orderedBy) => {
                  dispatch(moveFromArchive(tableId))
                  dispatch(addTask(text, 
                    tableId, 
                    article || '',
                    price || '0', 
                    quantity || 1, 
                    getCurrentDateAndTime(), 
                    unit || 'pcs', 
                    comment || "",
                    deliveryDate ? new Date(deliveryDate) : getCurrentDateAndTime(), 
                    userData?.username || 'Anonymus', "Pending", ""))
              }
          }
          />
          <AddItemButton onClick={handleUploadClick} dark excel>
              Excel import
          </AddItemButton>
          <input
              type="file"
              ref={fileInput}
              style={{ display: 'none' }}
              onChange={handleFileChange}
          />
          </NoDataPlaceholder>
        )
      }
      
    </Box>
  );
}

