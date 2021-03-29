import React, { useEffect, useState, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Link from '@material-ui/core/Link';
import { useSelector, useDispatch } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import Button from '@material-ui/core/Button';
import axios from 'axios'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove, } from '../../slices/customer';
import { selectCurrentTrainer, selectTrainerHeaders, trainerRemove, } from '../../slices/trainer';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, } from '../../slices/admin';
import { selectCurrentMasterAdmin, selectMasterAdminHeaders, masterAdminRemove, } from '../../slices/master_admin';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import FaceIcon from '@material-ui/icons/Face';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    // height: 140, 
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Header(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [headrModel, setHeaderModel] = useState()
  const [serverError, setServerError] = useState('');
  const history = useHistory();
  const dispatch = useDispatch();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customer_headers = useSelector(selectCustomerHeaders);

  const currentAdmin = useSelector(selectCurrentAdmin);
  const admin_headers = useSelector(selectAdminHeaders);

  const currentTrainer = useSelector(selectCurrentTrainer);
  const trainer_headers = useSelector(selectTrainerHeaders);

  const currentMasterAdmin = useSelector(selectCurrentMasterAdmin);
  const master_admin_headers = useSelector(selectMasterAdminHeaders);

  const handleLogOut = async() => {
    setAnchorEl(null);
  }
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCustomerSignOut = () => {
    if (!customer_headers) return;
    axios
      .delete('/v1/customer_auth/sign_out', customer_headers)
      .then(() => {
        dispatch(customerRemove());
        handleClose()
        console.log("成功する")
        history.push('/');
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        dispatch(customerRemove());
        console.log({err})
      });
  }
  const handleAdminSignOut = () => {
    if (!admin_headers) return;
    axios
      .delete('/v1/admin_auth/sign_out', admin_headers)
      .then(() => {
        dispatch(adminRemove());
         handleClose()
         history.push('/');
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        dispatch(adminRemove());
        console.log({err})
      });
  }
  const handleTrainerSignOut = () => {
    if (!trainer_headers) return;
    axios
      .delete('/v1/trainer_auth/sign_out', trainer_headers)
      .then(() => {
        dispatch(trainerRemove());
        handleClose()
        history.push('/');
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        dispatch(trainerRemove());
        console.log({err})
      });
  }
  const handleMasterAdminSignOut = () => {
    if (!master_admin_headers) return;
    axios
      .delete('/v1/master_admin_auth/sign_out', master_admin_headers)
      .then(() => {
        dispatch(masterAdminRemove());
        handleClose()
        history.push('/');
      })
      .catch((err: AxiosError<IErrorResponse>) => {
        dispatch(masterAdminRemove());
        console.log({err})
      });
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: '#4DA7F0'}}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            <Link color="inherit" href="/">Room</Link>
          </Typography>
          {currentCustomer?.id ? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle style={{fontSize: '1.3em'}}/>
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>マイページへ</MenuItem><hr/>
                <MenuItem onClick={handleClose}>プロフィールを編集する</MenuItem><hr/>
                <MenuItem onClick={handleCustomerSignOut}>ログアウトする</MenuItem>
              </Menu>
            </div>
            ) : currentTrainer?.id ? (
              <>
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <AssignmentIndIcon style={{fontSize: '1.3em'}}/>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>マイページへ</MenuItem><hr/>
                    <MenuItem onClick={handleClose}>プロフィールを編集する</MenuItem><hr/>
                    <MenuItem onClick={handleTrainerSignOut}>ログアウトする</MenuItem><hr/>
                    <MenuItem onClick = {() => history.push(`/trainer/edit/me`)}>プロフィールの編集</MenuItem>
                    
                  </Menu>
                </div>
              </>
            ): currentAdmin?.id ?(
              <>
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <span style={{fontSize: '0.7em'}}>管理者としてログイン中</span>
                    <FaceIcon style={{fontSize: '1.3em'}}/>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>マイページへ</MenuItem><hr/>
                    <MenuItem onClick={handleClose}>プロフィールを編集する</MenuItem><hr/>
                    <MenuItem onClick={handleAdminSignOut}>ログアウトする</MenuItem>
                  </Menu>
                </div>
              </>
            ): currentMasterAdmin?.id ? (
              <>
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <DashboardIcon style={{fontSize: '1.3em'}}/>
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={handleClose}>マイページへ</MenuItem><hr/>
                    <MenuItem onClick={handleClose}>プロフィールを編集する</MenuItem><hr/>
                    <MenuItem onClick={handleMasterAdminSignOut}>ログアウトする</MenuItem>
                  </Menu>
                </div>
              </>
            ):(
              <>
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                  >
                    <MenuItem><Link color="inherit" href="/admin/log_in">管理者としてログイン</Link></MenuItem><hr/>
                    <MenuItem><Link color="inherit" href="/trainer/log_in">トレーナーとしてログイン</Link></MenuItem><hr/>
                    <MenuItem><Link color="inherit" href="/master_admin/log_in">マスタ管理者としてログイン</Link></MenuItem><hr/>
                    <MenuItem><Link color="inherit" href="/customer/log_in">お客様としてログイン</Link></MenuItem><hr/>
                    <MenuItem><Link color="inherit" href="/customer/sign_up">お客様新規登録</Link></MenuItem>
                  </Menu>
                </div>
              </>
            )}
      
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Header