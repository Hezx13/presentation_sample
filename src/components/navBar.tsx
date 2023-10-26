import {useState} from 'react';
import { Link, useLocation  } from 'react-router-dom';
import {StyledNavBar, StyledNavBarItem, StyledLink} from '../styles'
import {Menu, MenuItem, IconButton, Drawer } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import PersonIcon from '@mui/icons-material/Person';
import { logout } from '../api/user-api';
import useMediaQuery from '@mui/material/useMediaQuery';
import MenuIcon from '@mui/icons-material/Menu';

export const NavBar = () =>{
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const isMobile = useMediaQuery('(max-width:600px)');

    const openMenu = (event) => {
        setMenuAnchor(event.currentTarget)
    }
    
    const closeMenu = () => {
        setMenuAnchor(null)
    }

    const handleLogOut = async () => {
        await logout();
        setIsLoggedIn(!!localStorage.getItem('token'));
        closeMenu()
    }

    const validateLogin = (event) => {
        setIsLoggedIn(!!localStorage.getItem('token'));
        if (!isLoggedIn) event?.preventDefault()
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
          return;
        }
        setDrawerOpen(open);
      };

    return (
        <StyledNavBar>
            <span >
                {
                    isMobile 
                    &&
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon htmlColor='orange'/>
                    </IconButton>
                }
            </span>
            <Drawer open={drawerOpen} anchor='top' onClose={toggleDrawer(false)}
            sx={{textAlign: 'center'}}
            >
        <StyledNavBarItem>
          <StyledLink to='/dashboard' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/dashboard'}>
            Dashboard
          </StyledLink>
        </StyledNavBarItem>
        <StyledNavBarItem>
          <StyledLink to='/' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/'}>
            Projects
          </StyledLink>
        </StyledNavBarItem>
        <StyledNavBarItem>
          <StyledLink to='/reports' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/reports'}>
            Reports
          </StyledLink>
        </StyledNavBarItem>
        <StyledNavBarItem>
          <StyledLink to='/archive' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/archive'}>
            Archive
          </StyledLink>
        </StyledNavBarItem>
      </Drawer>
        {!isMobile && <span style={{display: 'flex',flexDirection: 'row'}}>
        <StyledNavBarItem>
            <StyledLink to='/dashboard' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/dashboard'}>
                Dashboard
            </StyledLink>
        </StyledNavBarItem>
        <StyledNavBarItem>
            <StyledLink to='/' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/'} >
                Projects
            </StyledLink>
        </StyledNavBarItem>
        <StyledNavBarItem>
            <StyledLink to='/reports' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/reports'} >
                Reports
            </StyledLink>
        </StyledNavBarItem>
        <StyledNavBarItem>
            <StyledLink to='/archive' onClick={validateLogin} color={!isLoggedIn ? 'grey': '#ffffff'} isActive={location.pathname === '/archive'}>
                Archive
            </StyledLink>
        </StyledNavBarItem>
        </span>}
            
            <span >
            <StyledNavBarItem>
                <IconButton aria-label="account" onClick={openMenu}>
                {isLoggedIn ? < PersonIcon/> : <PermIdentityIcon />  } 
                </IconButton>
                <Menu
          anchorEl={menuAnchor}
          keepMounted
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
        >
          {
            isLoggedIn ? 
            (<div>
            <MenuItem onClick={handleLogOut}>Log Out</MenuItem>
            </div>)
            : ( 
                <div>
                <StyledLink to='/login' color="#e3f2fd">
                <MenuItem>
                
                Log in
                </MenuItem>
                </StyledLink>
                <StyledLink to='/register'color="#e3f2fd" >
                <MenuItem>
                Register
                </MenuItem>
                </StyledLink>
                </div>
            )

          }
        </Menu>
            </StyledNavBarItem>
                
            </span>
        </StyledNavBar>
    )
}

export default NavBar