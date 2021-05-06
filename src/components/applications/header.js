import React , { useEffect, useState } from 'react';
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
import axios from 'axios'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useHistory } from 'react-router-dom';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove, } from '../../slices/customer';
import { selectCurrentTrainer, selectTrainerHeaders, trainerRemove, } from '../../slices/trainer';
import { selectCurrentAdmin, selectAdminHeaders, adminRemove, } from '../../slices/admin';
import { selectCurrentMasterAdmin, selectMasterAdminHeaders, masterAdminRemove, } from '../../slices/master_admin';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import FaceIcon from '@material-ui/icons/Face';
import { useSnackbar } from 'notistack';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

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

function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();
  const dispatch = useDispatch();
  const today = new Date
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const currentCustomer = useSelector(selectCurrentCustomer);
  const customer_headers = useSelector(selectCustomerHeaders);

  const currentAdmin = useSelector(selectCurrentAdmin);
  const admin_headers = useSelector(selectAdminHeaders);

  const currentTrainer = useSelector(selectCurrentTrainer);
  const trainer_headers = useSelector(selectTrainerHeaders);

  const currentMasterAdmin = useSelector(selectCurrentMasterAdmin);
  const master_admin_headers = useSelector(selectMasterAdminHeaders);

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
        const message = "ログアウトしました"
        enqueueSnackbar(message, { 
            variant: 'success',
        });
        setAnchorEl(null);
        history.push('/');
      })
      .catch((err) => {
        const message = 'ログアウトに失敗しました';
        enqueueSnackbar(message, { 
            variant: 'error',
        });
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
        setAnchorEl(null);
        const message = "ログアウトしました"
        enqueueSnackbar(message, { 
            variant: 'success',
        });
        history.push('/');
      })
      .catch((err) => {
        const message = 'ログアウトに失敗しました';
        enqueueSnackbar(message, { 
            variant: 'error',
        });
        dispatch(adminRemove());
      });
  }
  const handleTrainerSignOut = () => {
    if (!trainer_headers) return;
    axios
      .delete('/v1/trainer_auth/sign_out', trainer_headers)
      .then((res) => {
        dispatch(trainerRemove());
        handleClose()
        const message = "ログアウトしました"
        enqueueSnackbar(message, { 
            variant: 'success',
        });
        setAnchorEl(null);
        history.push('/');
      })
      .catch((err) => {
        dispatch(trainerRemove());
        const message = 'ログアウトに失敗しました';
        enqueueSnackbar(message, { 
            variant: 'error',
        });
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
        const message = "ログアウトしました"
        enqueueSnackbar(message, { 
            variant: 'success',
        });
        setAnchorEl(null);
        history.push('/');
      })
      .catch((err) => {
        dispatch(masterAdminRemove());
        const message = 'ログアウトに失敗しました';
        enqueueSnackbar(message, { 
            variant: 'error',
        });
        console.log({err})
      });
  }

  function MoveToMyPage(){
    setAnchorEl(null);
    history.push(`/customer/my_page/${currentCustomer.id}`)
  }
  function MoveToHome(){
    setAnchorEl(null);
    history.push(`/`)
  }

  function MoveToTrainerPage(){
    setAnchorEl(null);
    history.push(`/trainer_page/${currentTrainer.id}`)
    window.location.reload()
  }
  function MoveToCheckTodaySchedule(){
    setAnchorEl(null);
    const today = new Date
    var company_id = null
    if(currentTrainer){
      company_id = currentTrainer.company_id
    }else if(currentAdmin){
      company_id = currentAdmin.company_id
    }
    history.push(`/admin/company_id/${company_id}/year/${today.getFullYear()}/month/${today.getMonth() + 1}/day/${today.getDate()}`)
  }

  function CustomerRegisterURL() {
    const adminHeaders = useSelector(selectAdminHeaders);
    const [open, setOpen] = React.useState(false);
    const [company, setComapny] = React.useState();
    const company_id_url = '/check_company_id_by_admin'
    useEffect(()=>{
        if(adminHeaders){
          axios.get(company_id_url, adminHeaders)
          .then(function(res) {
            setComapny(res.data.company)
          })
          .catch(function(error) {
              console.log({error})
          });
        }
    },[])
    const handleClickOpen = () => {
      setOpen(true);
    };

    const handleClose = () => {
      setOpen(false);
    };

    return (
      <div>
        <Button variant="outlined" color="primary" style={{backgroundColor: '#CCFFFF'}} onClick={handleClickOpen}>
          お客様登録
        </Button>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            お客様に以下のURLより登録して頂くようお願いします。
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {company? (<>
                https://main.d3udfnrfdm3q44.amplifyapp.com/customer/sign_up/company/{company.id}     
                <br/>
                {/* http://localhost:3001/customer/sign_up/company/{company.id} */}
              </>):(<></>)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary" autoFocus>
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <AppBar position="static" style={{backgroundColor: '#4DA7F0'}}>
        <Toolbar>
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
              <span style={{fontSize: '0.6em'}}>

              {currentCustomer.first_name_kanji? (<>
                { currentCustomer.first_name_kanji }様
              </>):(<></>)}

              </span>
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
                <MenuItem onClick={MoveToMyPage}>マイページ</MenuItem><hr/>
                <MenuItem onClick={handleCustomerSignOut}>ログアウトする</MenuItem>
              </Menu>
            </div>
            ) : currentTrainer?.id ? (
              <>
                <Link href={`/`}>
                  <Button variant="contained" color="secondary">
                      シフト提出
                  </Button>
                </Link>
                <div>
                  <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                  >
                  <span style={{fontSize: '0.6em'}}>
                  {currentTrainer.first_name_kanji? (<>
                    { currentTrainer.first_name_kanji }トレーナー
                  </>):(<></>)}
                  </span>
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
                    <MenuItem onClick={MoveToTrainerPage}>
                    {/* <MenuItem onClick={ history.push(`/trainer_page/${currentTrainer.id}`)}> */}
                      マイページへ
                    </MenuItem><hr/>
                    <MenuItem onClick={handleTrainerSignOut}>ログアウトする</MenuItem>
                  </Menu>
                </div>
              </>
            ): currentAdmin?.id ?(
              <>
                <CustomerRegisterURL/>
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
                    {/* <MenuItem onClick={MoveToHome}>ホームへ</MenuItem><hr/> */}
                    {/* <MenuItem onClick={MoveToCheckTodaySchedule}>本日の予約を確認する</MenuItem><hr/> */}
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
                    <span style={{fontSize: '0.7em'}}>マスタ管理者としてログイン中</span>
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
                    {/* <MenuItem><Link color="inherit" href="/admin/log_in">管理者としてログイン</Link></MenuItem><hr/>
                    <MenuItem><Link color="inherit" href="/trainer/log_in">トレーナーとしてログイン</Link></MenuItem><hr/>
                    <MenuItem><Link color="inherit" href="/master_admin/log_in">マスタ管理者としてログイン</Link></MenuItem><hr/>
                    <MenuItem><Link color="inherit" href="/customer/sign_up">お客様新規登録</Link></MenuItem> */}
                    <MenuItem><Link color="inherit" href="/customer/log_in">お客様としてログイン</Link></MenuItem>
                    {/* <hr/> */}
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