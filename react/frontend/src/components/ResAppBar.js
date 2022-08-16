import React, {useContext} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Link} from "react-router-dom"
import AuthContext from '../context/AuthContext'

const pages = ['Home'];
const settings = ['Profile' , 'Logout'];

const ResAppBar = () => {
 

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  let {user} = useContext(AuthContext)
  let {logoutUser} = useContext(AuthContext)

  return (
    <AppBar position="static" style={{ background: '#6a5acd' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '12',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MyForum
          </Typography>
       
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">
                    <Link 
                    style={{textDecoration:"none", color:'black', textTransform: 'capitalize'}} 
                    to={`/${page}`}>
                    {page}
                    </Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '12',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MyForum
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                <Link style={{textDecoration:"none", color:'white'}} to={`/${page}`}>
                    {page}
                    </Link>
              </Button>
            ))}
            
          </Box>
       
          <Box sx={{ flexGrow: 0 }}>

            {user && (
               <div className='d-flex justify-content-end'>
                <Typography
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              p: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 500,
              letterSpacing: '12',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {user.username}
          </Typography>
          
               <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="" />
                </IconButton>
              </Tooltip>
              
              <Menu sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >

              <MenuItem key='profile' onClick={handleCloseUserMenu}>
                <Typography textAlign="center">Profile</Typography>

              </MenuItem>
              <MenuItem key='logout' onClick={logoutUser}>
                <Typography textAlign="center">Logout</Typography>

              </MenuItem>
                </Menu>
                </div>
        
            )}
            {!user && ( 
              <div className='d-flex justify-content-end'>
                <Typography
            noWrap
            component="a"
            href="/signup"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 500,
              letterSpacing: '12',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Sign Up
          </Typography>
            
          <Typography
            noWrap
            component="a"
            href="/login"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 500,
              letterSpacing: '12',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Sign in 
          </Typography>

          
              </div>
              
            )}
            
          </Box>
        
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResAppBar;