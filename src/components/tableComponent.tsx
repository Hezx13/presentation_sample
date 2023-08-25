import React, {useState, useEffect} from 'react'
import {useAppState, } from "../state/AppStateContext";
import {findItemIndexById} from "../utils/arrayUtils";
import { Table, TableBody, TableHead, Grid, TextField, IconButton, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import {editTask} from "../state/actions";
import { Task } from '../state/appStateReducer'
import {StyledTableContainer, StyledTableRow, StyledTableCell, Status} from "../styles";
import {CardQuantityText, CardPriceText} from "../textStyles";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";

type ColProps = {
    tableId: string
}

const TableComponent = ({tableId}: ColProps) =>{
    const [tasks, setTasks] = useState<Task[]>([])
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
    const [editedTask, setEditedTask] = useState<any>(null);
    const [editing, setEditing] = useState<string | null>(null);
    const { lists, archive, dispatch } = useAppState()
    const [searchTerm, setSearchTerm] = useState('');
    useEffect(() => {
        const id_a = findItemIndexById(archive, tableId)
        const id_l =  findItemIndexById(lists, tableId)
        if (id_a > -1){
            setTasks(archive[id_a].tasks)
        }
        else if (id_l > -1) {
            setTasks(lists[id_l].tasks)
        }
    }, [tableId, editing]);

    useEffect(() => {
        setFilteredTasks (tasks.filter(task => {
            return task.text.toLowerCase().includes(searchTerm.toLowerCase());
        }))
    }, [tasks, searchTerm]);

    const handleEditClick = (task: any) => {
        setEditing(task.id);
        setEditedTask(task);
    };

    const handleSaveClick = (listId: string) => {
        dispatch(editTask(
            editedTask.id,
            listId,
            editedTask.text,
            editedTask.price,
            editedTask.quantity,
            editedTask.date,
            editedTask.unit,
            editedTask.comment,
            editedTask.deliveryDate,
            editedTask.orderedBy,
            editedTask.status,
            editedTask.payment
            ));
        setEditing(null);
    };

    const handleInputChange = (field: string, value: any) => {
        setEditedTask({ ...editedTask, [field]: value });
    };

    return(
        <>
                    <StyledTableContainer>
                        <Table>
                            <TableHead>
                                <StyledTableRow>
                                    <StyledTableCell>Date ordered</StyledTableCell>
                                    <StyledTableCell>Material</StyledTableCell>
                                    <StyledTableCell>Quantity</StyledTableCell>
                                    <StyledTableCell>Price</StyledTableCell>
                                    <StyledTableCell>Unit</StyledTableCell>
                                    <StyledTableCell>Comment</StyledTableCell>
                                    <StyledTableCell>Delivery Date</StyledTableCell>
                                    <StyledTableCell>Ordered By</StyledTableCell>
                                    <StyledTableCell>Status</StyledTableCell>
                                    <StyledTableCell>Payment</StyledTableCell>
                                    <StyledTableCell><TextField
                                        label="Search by Name"
                                        variant="standard"
                                        value={searchTerm}
                                        color="primary"
                                        InputProps={{
                                            style: {
                                                color: '#000',
                                                backgroundColor: '#ffffff50',
                                                padding: '5px'
                                            }
                                        }}
                                        InputLabelProps={{
                                            style: {
                                                zIndex: '10',
                                                color: 'orange',
                                                fontSize: '1rem',
                                                padding: '5px'
                                            }
                                        }}
                                        style={{}}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    /></StyledTableCell>
                                </StyledTableRow>
                            </TableHead>
                            <TableBody>
                                {filteredTasks.map((task) => (
                                    <StyledTableRow key={task.id}>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <TextField value={editedTask.date} onChange={(e) => handleInputChange('date', e.target.value)} />
                                            ) : (
                                                task.date
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <TextField value={editedTask.text} onChange={(e) => handleInputChange('text', e.target.value)} />
                                            ) : (
                                                task.text
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <TextField value={editedTask.quantity} onChange={(e) => handleInputChange('quantity', e.target.value)} />
                                            ) : (
                                                <CardQuantityText>
                                                    {task.quantity}
                                                </CardQuantityText>

                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <TextField value={editedTask.price} onChange={(e) => handleInputChange('price', e.target.value)} />
                                            ) : (
                                                <CardPriceText>
                                                    {task.price}
                                                </CardPriceText>
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <TextField value={editedTask.unit} onChange={(e) => handleInputChange('unit', e.target.value)} />
                                            ) : (
                                                task.unit
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <TextField value={editedTask.comment} onChange={(e) => handleInputChange('comment', e.target.value)} />
                                            ) : (
                                                task.comment
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <DatePicker value={dayjs(editedTask.deliveryDate)} onChange={(newValue) => handleInputChange('deliveryDate', newValue?.toString())} />
                                            ) : (
                                                task.deliveryDate
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <TextField value={editedTask.orderedBy} onChange={(e) => handleInputChange('orderedBy', e.target.value)} />
                                            ) : (
                                                task.orderedBy
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <Select
                                                    value={editedTask.status}
                                                    onChange={(e) => handleInputChange('status', e.target.value)}
                                                >
                                                    <MenuItem value="Pending">Pending</MenuItem>
                                                    <MenuItem value="Waiting for approval">Waiting for approval</MenuItem>
                                                    <MenuItem value="In process">In process</MenuItem>
                                                    <MenuItem value="Waiting for payment">Waiting for payment</MenuItem>
                                                    <MenuItem value="Done">Done</MenuItem>
                                                </Select>
                                            ) : (
                                                <>
                                                    <Status
                                                        color={task.status === 'Done' ? 'green'
                                                            :  task.status === 'Waiting for approval' ? 'blue'
                                                                :  task.status === 'In process' ? 'orange'
                                                                    :  task.status === 'Waiting for payment' ? 'red'
                                                                        :  'grey'
                                                        }
                                                    >
                                                    </Status>
                                                    {task.status}
                                                </>

                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <Select
                                                    value={editedTask.payment}
                                                    onChange={(e) => handleInputChange('payment', e.target.value)}
                                                >
                                                    <MenuItem value="cash">Cash</MenuItem>
                                                    <MenuItem value="card">Card</MenuItem>
                                                    <MenuItem value="bank transfer">Bank Transfer</MenuItem>
                                                    <MenuItem value="">Not paid</MenuItem>
                                                </Select>
                                            ) : (
                                                task.payment
                                            )}
                                        </StyledTableCell>

                                        {/* Similar for other fields */}
                                        <StyledTableCell>
                                            {editing === task.id ? (
                                                <IconButton onClick={() => handleSaveClick(tableId)}>
                                                    <SaveIcon />
                                                </IconButton>
                                            ) : (
                                                <IconButton onClick={() => handleEditClick(task)}>
                                                    <EditIcon />
                                                </IconButton>
                                            )}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </StyledTableContainer>
        </>
    )
}

export default TableComponent