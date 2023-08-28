import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    Box,
} from "@mui/material";
import {StyledTableContainer, SyledListButton, StyledTableCell} from "../styles";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import {CardPriceText} from "../textStyles";
import DownloadIcon from '@mui/icons-material/Download';
import {downloadExcel} from '../api'
const ListRow = ({ list, index }) => {
    const navigate = useNavigate();
    const calculateTotal = () => {
        let _totalPrice = 0;
        list.tasks.forEach((task) => {
                const price = parseFloat(task.price.split(' ')[0]);
                const quantity = task.quantity;
                _totalPrice += !Number.isNaN(price) ? price * quantity : 0;
        });
        return _totalPrice.toFixed(2)
    }
    const calculateDone = () => {
        let _totalPrice = 0;
        list.tasks.forEach((task) => {
            if (task.status === "Done") {
                const price = parseFloat(task.price.split(' ')[0]);
                const quantity = task.quantity;
                _totalPrice += !Number.isNaN(price) ? price * quantity : 0;
            }
        });
        return _totalPrice.toFixed(2)
    }
    const calculateNotDone = () => {
        let _totalPrice = 0;
        list.tasks.forEach((task) => {
            if (task.status !== "Done") {
                const price = parseFloat(task.price.split(' ')[0]);
                const quantity = task.quantity;
                _totalPrice += !Number.isNaN(price) ? price * quantity : 0;
            }
        });
        return _totalPrice.toFixed(2)
    }
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [totalPrice, setTotalPrice] =useState(calculateTotal())
    const [totalPriceDone, setTotalPriceDone] =useState(calculateDone())
    const [totalPriceNotDone, setTotalPriceNotDone] =useState(calculateNotDone())

    const handleExpandToTable = (id) =>{
        navigate('/table', { state: { myData: id } });
    }

    return (
        <>
            <TableRow sx={{backgroundColor: index % 2 === 0 ? '#00000005' : '#ffffff'}}>
                <StyledTableCell>
                    <IconButton size="small" onClick={() => setIsCollapsed(!isCollapsed)}>
                        {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell>
                    <SyledListButton
                        onClick={()=>{handleExpandToTable(list.id)}}
                    >
                        {list.text}
                    </SyledListButton></StyledTableCell>
                <StyledTableCell>{totalPriceDone} AED</StyledTableCell>
                <StyledTableCell>
                    <CardPriceText>{totalPriceNotDone} AED</CardPriceText>
                </StyledTableCell>
                <StyledTableCell>{totalPrice} AED</StyledTableCell>
                {/* Other list fields here */}
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Table size="small">
                                <TableHead>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Total</TableCell>
                                </TableHead>
                                <TableBody>
                                    {list.tasks.map((task, index) => (
                                        <TableRow key={index} sx={{backgroundColor: index % 2 === 0 ? '#00000005' : '#ffffff'}}>
                                            <TableCell>{task.text}</TableCell>
                                            <TableCell>{task.quantity}</TableCell>
                                            <TableCell>
                                                {
                                                    task.status === "Done" ?
                                                        task.price :
                                                        <CardPriceText>{task.price}</CardPriceText>
                                                }
                                            </TableCell>
                                            <TableCell>{task.quantity * parseFloat(task.price.split(' ')[0])} AED</TableCell>
                                            {/* Other task fields here */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const TableListsComponent = ({ lists }) => {
    return (
        <StyledTableContainer>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>
                        <IconButton
                            onClick={downloadExcel}
                        >
                            <DownloadIcon htmlColor="#008000"/>
                        </IconButton>
                    </TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Total Paid</TableCell>
                    <TableCell>Total Pending</TableCell>
                    <TableCell>Total Expenses</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {lists.map((list, index) => (
                    <ListRow key={index} list={list} index={index} />
                ))}
            </TableBody>
        </Table>
        </StyledTableContainer>
    );
};

export default TableListsComponent;
