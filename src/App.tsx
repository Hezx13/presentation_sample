import { Column } from "./components/Column"
import { AppContainer } from "./styles"
import { useAppState } from "./state/AppStateContext"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import AppRouter from "./AppRouter"
const App = () => {
  const { lists, dispatch } = useAppState()

  return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
    <AppContainer>
      <AppRouter/>
    </AppContainer>
      </LocalizationProvider>
  )
}

export default App
