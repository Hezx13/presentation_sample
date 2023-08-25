import { Column } from "./components/Column"
import { useAppState } from "./state/AppStateContext"
import { AddNewItem } from "./components/AddNewItem"
import { CustomDragLayer } from "./components/CustomDragLayer"
import { addList } from "./state/actions"
import {Grid} from '@mui/material'
import NavBar from "./components/navBar";
const ListsPage = () => {
    const { lists, dispatch } = useAppState()

    return (
        <>
            <CustomDragLayer />
            <Grid container>
                <Grid item xs={12}>
                    <NavBar/>
                </Grid>
                <Grid item xs={12}>
                    <Grid container justifyContent="start" sx={{margin: '0 auto'}}>

                        {lists.map((list) => (
                            <Grid item xl={2} lg={3} md={4} sm={6} xs={12} key={list.id}>
                                <Column id={list.id} text={list.text}  />
                            </Grid>
                        ))}
                        <Grid item xl={2} lg={3} md={4} sm={6} xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                            <AddNewItem
                                toggleButtonText="+ Add another project"
                                onAdd={(text) => dispatch(addList(text))}
                                list
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>

        </>
        )
}

export default ListsPage
