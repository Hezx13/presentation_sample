import { Column } from "./components/Column"
import { AppContainer } from "./styles"
import { useAppState } from "./state/AppStateContext"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ReportProvider } from './state/reportsContext'; 

import AppRouter from "./AppRouter"
const App = () => {
  const { lists, dispatch } = useAppState()

  return (
      <ReportProvider>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AppContainer>
      <AppRouter/>
    </AppContainer>
      </LocalizationProvider>
      </ReportProvider>
  )
}

export default App
