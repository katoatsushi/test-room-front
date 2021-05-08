/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import Grid from '@material-ui/core/Grid';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import PermIdentityIcon from '@material-ui/icons/PermIdentity';
import {selectCurrentCustomer, selectCustomerHeaders, customerRemove, selectCurrentCustomerStatus} from '../../slices/customer'
import {selectCurrentAdmin} from '../../slices/admin'
import {selectCurrentTrainer} from '../../slices/trainer'
import {selectCurrentMasterAdmin} from '../../slices/master_admin'
import { useSelector } from 'react-redux';
import PortraitIcon from '@material-ui/icons/Portrait';
import AppsIcon from '@material-ui/icons/Apps';
import DehazeIcon from '@material-ui/icons/Dehaze';
import ListAltIcon from '@material-ui/icons/ListAlt';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    color: 'white', 
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

function Footer() {
  const classes = useStyles();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const currentAdmin = useSelector(selectCurrentAdmin);
  const currentTrainer = useSelector(selectCurrentTrainer);
  const currentMasterAdmin = useSelector(selectCurrentMasterAdmin);
  const customerStatus = useSelector(selectCurrentCustomerStatus);
  const today = new Date

  return (
    <div className={classes.root}>
       {currentCustomer? (
            <>
              <AppBar position="static" style={{backgroundColor: 'white'}}>
                <Toolbar>
                <Grid container spacing={6} style={{textAlign: 'center'}}>
                    <Grid item xs={4} >
                        <Link href={`/appointment/room_plus/show`}>
                            <ListAltIcon  style={{color: 'black', fontSize: '2.3em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.4em'}}>ルームプラス</div>
                        </Link>
                    </Grid>
                    {customerStatus?.paid? (
                        <Grid item xs={4}>
                            <Link href={`/customer/${currentCustomer.id}/calendar_new`} >
                                <CalendarTodayIcon  style={{color: 'black', fontSize: '2.3em'}} >
                                    予約する
                                </CalendarTodayIcon>
                                <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.4em'}}>予約する</div>
                            </Link>
                        </Grid>
                    ):(
                        <Grid item xs={4}>
                            <CalendarTodayIcon  style={{color: 'grey', fontSize: '2.3em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.4em'}}>予約する</div>
                        </Grid>
                    )}
                    <Grid item xs={4} >
                        <Link href={`/customer/my_page/${currentCustomer.id}`}>
                            <PermIdentityIcon  style={{color: 'black', fontSize: '2.3em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.4em'}}>マイページ</div>
                        </Link>
                    </Grid>
                </Grid>
                </Toolbar>
              </AppBar>
            </>
        ) : currentTrainer?.id ? (
            <>
              <AppBar position="static" style={{backgroundColor: 'white'}}>
                <Toolbar>
                <Grid container spacing={6} style={{textAlign: 'center'}}>
                    <Grid item xs={3} style={{paddingLeft: 5, paddingRight: 5}}>
                        <Link href={`/admin/company_id/${currentTrainer.company_id}/year/${today.getFullYear()}/month/${today.getMonth() + 1}/day/${today.getDate()}`}>
                            <HomeIcon style={{color: 'black', fontSize: '1.7em'}}/>
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.4em'}}>本日の予約</div>
                        </Link>
                    </Grid>
                    <Grid item xs={3} style={{paddingLeft: 5, paddingRight: 5}}>
                        <Link href="/trainers/customer_session_records">
                            <DehazeIcon  style={{color: 'black', fontSize: '1.7em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.2em'}}>カルテ一覧</div>
                        </Link>
                    </Grid>
                    <Grid item xs={3} style={{paddingLeft: 5, paddingRight: 5}}>
                        <Link href={`/admin/schedule/check`}>
                            <CalendarTodayIcon  style={{color: 'black', fontSize: '1.7em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.2em'}}>月間予約状況</div>
                        </Link>
                    </Grid>
                    <Grid item xs={3} style={{paddingLeft: 5, paddingRight: 5}}>
                        <Link href="/customer_all">
                            <PortraitIcon  style={{color: 'black', fontSize: '1.7em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.2em'}}>お客様一覧</div>
                        </Link>
                    </Grid>
                    {/* <Grid item xs={3} style={{paddingLeft: 5, paddingRight: 5}}>
                        <Link href={`/trainer_page/${currentTrainer.id}`}>
                            <PermIdentityIcon  style={{color: 'black', fontSize: '1.7em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.2em'}}>マイページ</div>
                        </Link>
                    </Grid> */}
                </Grid>
                </Toolbar>
              </AppBar>
            </>
         ) : currentAdmin?.id ? (
            <>
              <AppBar position="static" style={{backgroundColor: 'white'}}>
                <Toolbar>
                <Grid container spacing={6} style={{textAlign: 'center'}}>
                    <Grid item xs={4}>
                        <Link href="/customer_all">
                            <PortraitIcon  style={{color: 'black', fontSize: '2.5em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.6em'}}>お客様一覧</div>
                        </Link>
                    </Grid>
                    <Grid item xs={4}>
                        <Link href={`/admin/company_id/${currentAdmin.company_id}/year/${today.getFullYear()}/month/${today.getMonth() + 1}/day/${today.getDate()}`}>
                            <HomeIcon style={{color: 'black', fontSize: '2.5em'}}/>
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.4em'}}>本日の予約</div>
                        </Link>
                    </Grid>
                    <Grid item xs={4}>
                        <Link href="/admin_menues">
                            <AppsIcon style={{color: 'black', fontSize: '2.5em'}} />
                            <div style={{marginRight: 'auto', marginLeft: 'auto', fontSize: '0.4em'}}>管理者メニュー</div>
                        </Link>
                    </Grid>
                </Grid>
                </Toolbar>
              </AppBar>
            </>
        ): currentMasterAdmin?.id ? (
            <>
              <AppBar position="static" style={{backgroundColor: 'white'}}>
                <Toolbar>
                <Grid container spacing={6} style={{textAlign: 'center'}}>
                    <Grid item xs={3}>
                        <Link href={`/master_admin`}>
                            <HomeIcon style={{color: 'black', fontSize: '2.5em'}}/>
                        </Link>
                    </Grid>
                    {/* <Grid item xs={3}>
                        <Link href="/customer_all">
                            <PortraitIcon  style={{color: 'black', fontSize: '2.5em'}} />
                        </Link>
                    </Grid>
                    <Grid item xs={3}>
                        <Link href="/admin_menues">
                            <AppsIcon style={{color: 'black', fontSize: '2.5em'}} />
                        </Link>
                    </Grid>
                    <Grid item xs={3} >
                        <Link href="/">
                            <PermIdentityIcon  style={{color: 'black', fontSize: '2.5em'}} />
                        </Link>
                    </Grid> */}
                </Grid>
                </Toolbar>
              </AppBar>
            </>
        ):(
          <></>
        )}
    </div>
  );
}

// // state
// const mapStateToProps = state => ({ auths: state.auths })
// // 関数
// const mapDispachToProps = ({ checkAuth, signOut })
// // reduxのstateと関数を使えるように、propsで使えるようになる
// export default connect(mapStateToProps, mapDispachToProps)(Footer)

export default Footer
