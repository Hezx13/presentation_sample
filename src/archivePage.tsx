import { Column } from "./components/Column"
import { useAppState } from "./state/AppStateContext"
import { AddNewItem } from "./components/AddNewItem"
import { CustomDragLayer } from "./components/CustomDragLayer"
import { addList } from "./state/actions"
import {Grid} from '@mui/material'
import NavBar from "./components/navBar";
const ArchivePage = () => {
    const { archive, dispatch } = useAppState()

    return (
        <>
            <CustomDragLayer />
            <Grid container>
                <Grid item xs={12}>
                    <NavBar/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="start" sx={{margin: '0 auto'}}>

                        {archive.map((list) => (
                            <Grid item xl={2} lg={3} md={4} sm={6} xs={12} key={list.id}>
                                <Column id={list.id} text={list.text}  isArchive/>
                            </Grid>
                        ))}

                    </Grid>
                </Grid>

            </Grid>
        </>
    )
}

export default ArchivePage
