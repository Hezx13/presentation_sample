import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import {StyledTableCell, SyledListButton} from '../styles';
import {downloadReport} from '../api'
import DownloadIcon from '@mui/icons-material/Download';

const ReportTable = ({ data, updateCall }) => {
  const navigate = useNavigate();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const handleExpandToTable = (month) =>{
        navigate('/report', { state: { reports: data, period: month } });
    }

  const handleDownloadReport = (per) => {
    console.log(per)
    downloadReport(per);
  }
  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>Month</TableCell>
          <TableCell>Debit</TableCell>
          <TableCell>Credit</TableCell>
          <TableCell>Active Projects Count</TableCell>
          <TableCell>Materials Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{
            data.map((data, index)=>(
            <TableRow key={index}>
            
            <StyledTableCell>
                    <SyledListButton
                        onClick={()=>{handleExpandToTable(data.month)}}
                    >
            {months[Number(data.month.start.split("-")[1][1]) -1] + " " + data.month.start.split("-")[0]}
                    </SyledListButton></StyledTableCell>
            
            <TableCell>
            <Typography variant='body2' color="green">
            {data.debit.reduce((a, b) => {
                return (a.amount || a + b.amount || 0) || 0;
              }, 0).toFixed(2)}
            </Typography>
              
              </TableCell>
           
            <TableCell>
              <Typography variant='body2' color="red">{data.credit.toFixed(2)}</Typography>
              </TableCell>
            
            <TableCell>{data.activeProjects.length}</TableCell>
          
            
            <TableCell>{data.materials.length}</TableCell>

            <TableCell>
            <IconButton
                  onClick={()=>handleDownloadReport(data.month.start)}
              >
                  <DownloadIcon htmlColor="#008000"/>
              </IconButton>
            </TableCell>
          </TableRow>
            ))
          
          }
          {/* Add more rows as needed */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReportTable;
