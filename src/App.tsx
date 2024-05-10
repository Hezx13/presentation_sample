import { AppContainer } from "./styles/styles"
import { useAppState } from "./state/AppStateContext"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReportProvider } from './state/reportsContext'; 
import darkTheme from "./theme";
import { ThemeProvider } from "@mui/material";
import AppRouter from "./AppRouter"
import { SocketProvider } from "./state/socketContext";

const App = () => {

  return (
    <SocketProvider>
      <ReportProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <AppContainer>
            <ThemeProvider theme={darkTheme}>
              <AppRouter/>
            </ThemeProvider>
          </AppContainer>
        </LocalizationProvider>
      </ReportProvider>
    </SocketProvider>
  )
}

export default App
