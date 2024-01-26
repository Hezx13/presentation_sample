import {useAppState } from "./state/AppStateContext";
import React, {useState, useEffect, useMemo} from 'react'
import {Grid, CircularProgress} from '@mui/material'
import {onUpload} from "./api";
import CardComponent from "./components/cardComponent";
import NavBar from "./components/navBar";
import TableListsComponent from "./components/tableListsComponent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Navigate } from "react-router-dom";
import DebitDialog from "./components/DebitDialog";
import { addBalance, currentBalance, generateCashOrder, loadBalance } from "./api/balance-api";
import AddCardIcon from '@mui/icons-material/AddCard';
import dayjs from "dayjs";
import BalanceHistoryDialog from "./components/BalanceHistoryDialog";

const BalanceCardContent = ({balance, action, historyAction}) => {
    return (
        <span style={{
            display: 'flex',
            justifyContent: 'space-between',
        }}>
        <span style={{color: balance > 0 ? 'green': 'red', cursor: 'pointer'}} onClick={historyAction}>
            {balance ? balance.toFixed(2) + " AED" : <CircularProgress color="primary"/>} 
        </span>
        <IconButton sx={{ padding: '0 5px', }} onClick={action}>
            <AddCardIcon htmlColor="green"/>
            </IconButton>
        </span>
        
    )
}

export const DashboardPage = () => {
    const { lists, archive, dispatch } = useAppState()
    const [balance, setBalance] = useState([]);
    const [current, setCurrent] = useState(0);
    const [roughTotalPrice, setRoughTotalPrice] = useState<number>(0)
    const [totalPrice, setTotalPrice] =useState<number>(0)
    const  [notDoneTasksCount, setNotDoneTasksCount] = useState(0)
    const [isLoggedIn] = useState(!!localStorage.getItem('token'));
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [inputDate, setInputDate] = useState("");
    const [inputCheck, setInputCheck] = useState("");
    const [historyDialogOpen, setHistoryDialogOpen] = useState(false);    

    // const totalAmount = useMemo(() => {
    //     return balance.reduce((sum, current:any) => sum + current.amount, 0);
    //   }, [balance]);

    useEffect(() => {
        setRoughTotalPrice(totals.totalRough);
        setTotalPrice(totals.total);
        fetchBalance();
        fetchCurrentBalance();
    }, [lists,archive]);

    
    useEffect(() => {
        const countNotDoneTasks = lists.reduce((total, list) => {
            return total + list.tasks.filter((task) => task.status !== "Done").length;
        }, 0);
        setNotDoneTasksCount(countNotDoneTasks)
    }, [lists]);
    
    const fetchBalance = async () => {
        const res = await loadBalance();
        setBalance(res);
    }

    const fetchCurrentBalance = async () => {
    const res = await currentBalance();
    setCurrent(res);   
    }

    const calculateTotal = () => {
        console.log("Calculating total");
        let _totalPrice = 0;
        let _totalPriceRough = 0;

        lists.forEach((list) => {
            list.tasks.forEach((task) => {
                if (task.status !== "Done") {
                    const price = parseFloat(task.price?.split(' ')[0] || task.price);
                    const quantity = task.quantity;
                    if (task.payment?.toLowerCase() === "cash") {
                        _totalPrice += !Number.isNaN(price) ? price * quantity : 0;
                    }
                    _totalPriceRough += !Number.isNaN(price) ? price * quantity : 0;
                }
            });
        });
        return {total: parseFloat(_totalPrice.toFixed(2)), totalRough: parseFloat(_totalPriceRough.toFixed(2))}
    }

    const handleClickOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };

    const handleSave = async () => {
        if (inputValue) {
          let data = { amount: Number(inputValue), date: dayjs(inputDate).format('DD-MM-YYYY'), check: inputCheck };
          try {
            addBalance(data)
            setInputCheck("");
            setInputValue("");
            setInputDate("");
            fetchCurrentBalance();
            fetchBalance();
          } catch (err) {
            console.log(err);
          }
        }
        setOpen(false);
      };

      const totals = useMemo(()=>calculateTotal(), [lists])

    return (
        <>
        <DebitDialog
                open={open}
                inputValue={inputValue}
                setInputValue={setInputValue}
                inputDate={inputDate}
                setInputDate={setInputDate}
                inputCheck={inputCheck}
                setInputCheck={setInputCheck}
                handleClose={handleClose}
                handleSave={handleSave}
              ></DebitDialog>
              <BalanceHistoryDialog
                open={historyDialogOpen}
                debits={balance}
                onClose={()=>setHistoryDialogOpen(false)}
                update={fetchCurrentBalance}
                />
            <Grid container>
            {!isLoggedIn && <Navigate to="/login"/>}

                <Grid item xs={12} sx={{marginBottom: '15px'}}>
                    <NavBar/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={8} >
                        <Grid item xl={2}>
                            <CardComponent textColor="green" text="Waiting for payment" 
                            amount={totalPrice.toLocaleString('en-US').replace(/,/g, ' ') + " AED"}
                            button
                            />
                            <CardComponent textColor="red" text="Cash order(Rough)" 
                            amount={roughTotalPrice.toLocaleString('en-US').replace(/,/g, ' ') + " AED"}/>
                        </Grid>
                        <Grid item xl={2}>
                            <CardComponent textColor="orange" text="Projects in work" amount={lists.length}/>
                            <CardComponent textColor="green" text="Current balance"
                             amount={
                             <BalanceCardContent
                                historyAction={() => setHistoryDialogOpen(true)}
                                balance={current}
                                action={handleClickOpen}
                             />
                             }/>
                        </Grid>
                        <Grid item xl={2}>
                            <CardComponent textColor="orange" text="Materials in work" amount={notDoneTasksCount}/>
                        </Grid>
                        
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container >
                        <Grid item xs={12} sx={{margin: '25px auto 10px auto'}}>
                            <Typography textAlign="center" color="#ffffff" variant="h4">
                                Projects in work
                            </Typography>
                        </Grid>
                        <Grid item xs={10} sx={{margin: '10px auto'}}>
                        <TableListsComponent lists={lists} isArchive={false} onUpload={onUpload}/>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container >
                        <Grid item xs={12} sx={{margin: '25px auto 10px auto'}}>
                            <Typography textAlign="center" color="#ffffff" variant="h4">
                                Projects in archive
                            </Typography>
                        </Grid>
                        <Grid item xs={10} sx={{margin: '10px auto'}}>
                            <TableListsComponent lists={archive} isArchive={true} onUpload={onUpload}/>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

        </>
    )

}

export default DashboardPage

