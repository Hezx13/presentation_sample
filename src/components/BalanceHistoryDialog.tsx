import { FC, useState, memo } from "react";
import { removeBalance } from "../api/balance-api";
import { Dialog, DialogContent,DialogActions, Button, IconButton } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const BalanceHistoryDialog = ({open, onClose, debits, update}) =>{
    
    const handleRemoveDebitClick = async (debit) => {
        try {
            debits.filter(debitc => debitc !== debit)
          removeBalance(debit).then((res) => {
            update()
          });
        } catch (error) {
          console.error("Error in removeDebit:", error);
        }
      };

    return (
    <>
        <Dialog open={open}>
        <DialogContent>
            {debits.map(debit => (
                <div style={{
                    display: 'flex', 
                    padding: '5px 10px', 
                    margin: '5px', 
                    background: '#00000020', 
                    borderRadius: '5px',
                    alignItems: 'center',
                    width: 'clamp(300px, 400px, 500px)',
                }}
                    >
                <span style={{color: 'green', flex: 1}}>
                    {debit.amount} AED
                </span>
                <span style={{flex: 1}}>
                    {debit.date}
                </span>
                <span style={{width: '100px'}}>
                    {debit.check}
                </span>
                <IconButton
                sx={{marginLeft: 'auto'}}
                onClick={()=>handleRemoveDebitClick(debit)}>
                <DeleteForeverIcon fontSize="small" htmlColor='Crimson'/>
                </IconButton>
                </div>
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Close
          </Button>
        </DialogActions>
        </Dialog>
    </>
    )
}

export default BalanceHistoryDialog;