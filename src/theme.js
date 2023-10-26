import { createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        text: {
        primary: '#e3f2fd',
       },
       background:{
        paper: '#171717'
       },
       primary: {
        main: '#FFA500',
       }
      },
});

export default darkTheme;