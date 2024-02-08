import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {useAppState} from "./state/AppStateContext";
import TableComponent from "./components/tableComponent";
import NavBar from "./components/navBar";
import {addList} from "./state/actions";
import {AddNewItem} from "./components/AddNewItem";
import {StyledTab} from "./styles/styles";
import useMediaQuery from '@mui/material/useMediaQuery';
import FullFeaturedCrudGrid from './components/DataGridComponent';


interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 1, width: '100%' }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function VerticalTabs() {
    const {lists, getTasksByListId, getTasksByArchiveId, dispatch } = useAppState()
    const matches = useMediaQuery('(max-width:1280px)');

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
            {matches && 
            <Box
            sx={{bgcolor: 'background.paper', height: 'auto', borderRadius: '12px'}}
        >
            <Tabs
                orientation="horizontal"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                sx={{ borderRight: 1, borderColor: 'divider'}}
            >
                {lists.map((list, index)=>(
                    list.tasks.some((task)=>(task.status==="Pending" || task.status==='' || !task.status)) ?
                    <StyledTab label={list.text} {...a11yProps(index)} /> :
                        <Tab label={list.text} {...a11yProps(index)} />
                    )
                )}
                <AddNewItem
                    toggleButtonText="+ Add another project"
                    onAdd={(text) => dispatch(addList(text))}
                    list
                />
            </Tabs>
            <Box
                sx={{bgcolor: 'background.paper'}}
            >
            {lists.map((list, index)=>(
                <TabPanel key={index} value={value} index={index}>
                    <FullFeaturedCrudGrid tableId={list.id}/>
                </TabPanel>
            ))}
        </Box>
        </Box>
            }

        {!matches && <Box
                sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 'auto', borderRadius: '12px', width: '100%'}}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider',maxWidth: '200px'  }}
                >
                    {lists.map((list, index)=>(
                        list.tasks.some((task)=>(task.status==="Pending" || task.status==='' || !task.status)) ?
                        <StyledTab key={index} label={list.text} {...a11yProps(index)} /> :
                            <Tab key={index} label={list.text} {...a11yProps(index)} />
                        )
                    )}
                    
                    <AddNewItem
                        toggleButtonText="+ Add another project"
                        onAdd={(text) => dispatch(addList(text))}
                        list
                    />
                </Tabs>
                <Box
                    sx={{ flexGrow: 1, bgcolor: 'background.paper'}}
                >
                {lists.map((list, index)=>(
                    <TabPanel key={index} value={value} index={index}>
                        <FullFeaturedCrudGrid tableId={list.id}/>
                    </TabPanel>
                ))}
            </Box>
            </Box>}
        </Box>
    );
}