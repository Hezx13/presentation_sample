import { Link, useLocation  } from 'react-router-dom';
import {StyledNavBar, StyledNavBarItem, StyledLink} from '../styles'
export const NavBar = () =>{
    const location = useLocation();

    return (
        <StyledNavBar>
            <StyledNavBarItem>
                <StyledLink to='/dashboard' isActive={location.pathname === '/dashboard'}>
                    Dashboard
                </StyledLink>
            </StyledNavBarItem>
            <StyledNavBarItem>
                <StyledLink to='/' isActive={location.pathname === '/'} >
                    Projects
                </StyledLink>
            </StyledNavBarItem>
            <StyledNavBarItem>
                <StyledLink to='/archive' isActive={location.pathname === '/archive'}>
                    Archive
                </StyledLink>
            </StyledNavBarItem>
        </StyledNavBar>
    )
}

export default NavBar