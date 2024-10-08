import { useEffect, useState } from "react";
import { approveUser, deleteUser, demoteUser, disapproveUser, getUserData, getUsers, promoteUser, resetUserPassword } from "../api/user-api";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button, CircularProgress, Badge, Chip } from "@mui/material";
import { StyledChip, StyledTableContainer } from "../styles/styles";
import { act } from "@testing-library/react";


type User = {
    _id: string;
    username: string;
    email: string;
    department: string;
    role: string;
    isApproved: boolean;
}

const fetchUsers = async () => {
    const users = await getUsers();
    console.log(users)  
    return users
}

const getActiveUser = async () => {
  const userData = await getUserData();
  return userData
}

const UserManagementTable = ({onAlert}) => {

    const [users, setUsers] = useState<User[]>([]);
    const [activeUser, setActiveUser] = useState<User | null >(null);
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [resetUser, setResetUser] = useState<string | null>(null);

    useEffect(()=>{
        fetchUsers().then(
            (data)=>setUsers(data)
        )
          getUserData().then(
            (data)=>setActiveUser(data)
          );
    },[])
    const handleApproveUser = async (username: string) => {
        if (username === activeUser?.username){
          onAlert("selfEdit")
          return;
        }
        const res = await approveUser(username);
        if (res === 200){
            fetchUsers().then(
                (data)=>setUsers(data)
            )
        }
    }
    const handleDisapproveUser = async (username: string) => {
      if (username === activeUser?.username){
        onAlert("selfEdit")
        return;
      }
        const res = await disapproveUser(username);
        if (res === 200){
            fetchUsers().then(
                (data)=>setUsers(data)
            )
        }
    }

    const handleDeleteUser = async (username: string) => {
      if (username === activeUser?.username){
        onAlert("selfEdit")
        return;
      }
      const res = await deleteUser(username);
      if (res === 200){
        fetchUsers().then(
            (data)=>{
              if (selectedRow && data.length <= selectedRow)
              setSelectedRow(data.length - 1)
              setUsers(data)}
        )
    }
    };

    const handleDemoteUser = async (username: string) =>{
      if (username === activeUser?.username){
        onAlert("selfEdit")
        return;
      }
      const res = await demoteUser(username);
      if (res === 200){
          fetchUsers().then(
              (data)=>setUsers(data)
          )
      }
    }
    const handlePromoteUser = async (username: string) =>{
      if (username === activeUser?.username){
        onAlert("selfEdit")
        return;
      }
      const res = await promoteUser(username);
      if (res === 200){
          fetchUsers().then(
              (data)=>setUsers(data)
          )
      }
    }
    const handleResetUserPassword = async (username: string) =>{
      if (username === activeUser?.username){
        onAlert("selfEdit")
        return;
      }
      const res = await resetUserPassword(username);
      if (res === 200){
          fetchUsers().then(
              (data)=>{
                setUsers(data)
            }
          )
          setResetUser(username)
      }
    }

    return (
      users.length > 0 ?
      //@ts-ignore
        <StyledTableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="user-management-table">
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Department</TableCell>
            <TableCell align="right">Role</TableCell>
            <TableCell align="right">Approved</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row, index) => (
            <TableRow
              onClick={() => setSelectedRow(index)}
              key={row._id}
              sx={{ 
                '&:last-child td, &:last-child th': { border: 0 },
                boxShadow: selectedRow === index ? 'inset -5px 0px 0px 0px orange, inset 5px 0px 0px 0px orange' : '',
                cursor: 'pointer',
                position: 'relative', 
                '&:hover': { background: '#303030' }
              }}
            >
              <TableCell component="th" scope="row">
                {row.username} &nbsp;
                {
                  resetUser === row.username ? <StyledChip label="Reset!" /> : null
                }
              </TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">{row.department}</TableCell>
              <TableCell align="right">{row.role}</TableCell>
              <TableCell align="right">{row.isApproved ? 'Yes' : 'No'}</TableCell>
            
            </TableRow>
          ))}
          {
            selectedRow !== null ? 
            <TableRow>
              <TableCell colSpan={5}>
                <div style={{
                  display:"flex", 
                  flexDirection:"row",
                  gap:10
                }}>
              {
                users[selectedRow].isApproved ?
                <Button variant="outlined" onClick={()=>handleDisapproveUser(users[selectedRow].username)}>Disapprove</Button>
                :
                <Button variant="outlined" onClick={()=>handleApproveUser(users[selectedRow].username)}>Approve</Button>
              }
              {
                users[selectedRow].role === 'Admin' ?
                <Button variant="outlined" onClick={()=>handleDemoteUser(users[selectedRow].username)} >Demote</Button> :
                <Button variant="outlined" onClick={()=>handlePromoteUser(users[selectedRow].username)}>Promote</Button>
              }
                <Button variant="outlined" onClick={()=>handleResetUserPassword(users[selectedRow].username)}>Reset Password</Button>
                <Button variant="outlined" onClick={()=>handleDeleteUser(users[selectedRow].username)}>Delete User</Button>
                </div>
              </TableCell>
            </TableRow>
            : null
          }
        </TableBody>
      </Table>
    </StyledTableContainer>
    : <CircularProgress/>
    ) 
};

export default UserManagementTable;