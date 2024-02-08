import { Action } from "../../state/actions"
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
    GridRenderEditCellParams,
  } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { AddNewItem } from "../AddNewItem";
import {addTask, editTask, moveFromArchive, removeTask} from "../../state/actions";
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { getCurrentDateAndTime } from "../../utils/timeUtils";
import { AddItemButton } from "../../styles/styles";
import { useRef } from "react";
import { onUploadSingle } from "../../api";


interface EditToolbarProps {
    tableId: string,
    dispatch: React.Dispatch<Action>,
    userData: {username: string} | null,
      setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
  }
  
  function EditToolbar(props: EditToolbarProps) {
    const {dispatch,tableId,userData } = props;
    const fileInput = useRef<HTMLInputElement>(null);

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

    const handleUploadClick = () => {
      fileInput.current!.click();
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      file && onUploadSingle(file, tableId)
  };
    

    return (
      <GridToolbarContainer>
        <AddNewItem
            toggleButtonText="+ Add another material"
            onAdd={
                (text,article, price, quantity, unit, comment, deliveryDate) => {
                    dispatch(moveFromArchive(tableId))
                    dispatch(addTask(text, tableId, article || '',price || '', quantity || 1, getCurrentDateAndTime(), unit || 'pcs', comment || "", deliveryDate || getCurrentDateAndTime(), userData?.username || 'Anonymus', "Pending", ""))
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
        <Button color="primary" startIcon={<SendOutlinedIcon/>} onClick={handleSend}>
          Send selected
        </Button>
      </GridToolbarContainer>
    );
  }

export default EditToolbar;