import { Column } from "./components/Column"
import { useAppState } from "./state/AppStateContext"
import { AddNewItem } from "./components/AddNewItem"
import { CustomDragLayer } from "./components/CustomDragLayer"
import { addList } from "./state/actions"
import {Grid} from '@mui/material'
import NavBar from "./components/navBar";
import VerticalTabs from "./projectsPage";
const ListsPage = () => {
    const { lists, dispatch } = useAppState()

    return (
        <>
            <Grid container>
                <Grid item xs={12}>
                    <NavBar/>
                </Grid>
                <Grid item xs={12}>
                    <VerticalTabs/>

                </Grid>
            </Grid>

        </>
        )
}

export default ListsPage
