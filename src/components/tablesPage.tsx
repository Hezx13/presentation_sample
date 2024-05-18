import {FC, useEffect, useState} from 'react';
import TableComponent from "./tableComponent";
import { useLocation } from 'react-router-dom';
import {Grid} from "@mui/material";
import NavBar from './navBar'
import FullFeaturedCrudGrid from './DataGridComponent';
import { getUserData, getUsers } from '../api/user-api';
import { useAppState } from '../state/AppStateContext';

const TablesPage: FC = () => {
    const location = useLocation();
    const [userData,setUserData] = useState< {username: string} | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const {role} = useAppState();
    
    useEffect(()=>{
        try{
            getUserData().then(user => {
              console.log(user)
                const userData = {
                    username: user.username,
  
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
    })
    
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
                        userData={userData}
                        users={users}
                    />
                </Grid>

            </Grid>

        </>
    )
}

export default TablesPage;