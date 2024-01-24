import { FC, useState, memo } from "react";
import { removeBalance } from "../api/balance-api";
import { Dialog, DialogContent,DialogActions, Button, IconButton } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const BalanceHistoryDialog = ({open, onClose, debits, update}) =>{
    
    const handleRemoveDebitClick = async (debit) => {
        try {
            debits.filter(debitc => debitc !== debit)
          removeBalance(debit).then((res) => {
            console.log(res);
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
                    padding: '5px', 
                    margin: '5px', 
                    background: '#00000020', 
                    borderRadius: '5px',
                    alignItems: 'center'
                }}
                    >
                <span style={{color: 'green'}}>
                    {debit.amount} AED - 
                </span>
                <span>
                    - {debit.date} -
                </span>
                <span>
                    - {debit.check}
                </span>
                <IconButton
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