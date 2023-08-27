import {useAppState } from "./state/AppStateContext";
import React, {useState, useEffect} from 'react'
import {Grid} from '@mui/material'
import CardComponent from "./components/cardComponent";
import NavBar from "./components/navBar";
import TableListsComponent from "./components/tableListsComponent";
import Typography from "@mui/material/Typography";


export const DashboardPage = () => {
    const { lists, archive, dispatch } = useAppState()
    const [totalPrice, setTotalPrice] =useState<number>(0)
   const  [notDoneTasksCount, setNotDoneTasksCount] = useState(0)

    useEffect(() => {
        calculateTotal()
    }, []);
    const calculateTotal = () => {
        let _totalPrice = 0;
        lists.forEach((list) => {
            list.tasks.forEach((task) => {
                if (task.status !== "Done" && task.payment === "cash") {
                    const price = parseFloat(task.price.split(' ')[0]);
                    const quantity = task.quantity;

                    _totalPrice += !Number.isNaN(price) ? price * quantity : 0;
                }
            });
        });

        setTotalPrice(parseFloat(_totalPrice.toFixed(2)))
    }
    useEffect(() => {
        const countNotDoneTasks = lists.reduce((total, list) => {
            return total + list.tasks.filter((task) => task.status !== "Done").length;
        }, 0);
        setNotDoneTasksCount(countNotDoneTasks)
    }, []);
    return (
        <>
            <Grid container>
                <Grid item xs={12} sx={{marginBottom: '15px'}}>
                    <NavBar/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="center" spacing={8} >
                        <Grid item xl={2}>
                            <CardComponent textColor="green" text="Cash order" amount={totalPrice.toLocaleString('en-US').replace(/,/g, ' ') + " AED"}/>
                        </Grid>
                        <Grid item xl={2}>
                            <CardComponent textColor="orange" text="Projects in work" amount={lists.length}/>
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
                        <TableListsComponent lists={lists}/>
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
                            <TableListsComponent lists={archive}/>
                        </Grid>
                    </Grid>
                </Grid>

            </Grid>

        </>
    )

}

export default DashboardPage

