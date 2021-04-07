/* eslint-disable react/prop-types */
import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {selectCurrentCustomer, selectCurrentCustomerInfos, selectCurrentCustomerInterests, selectCustomerHeaders} from '../../slices/customer'
import {selectCurrentTrainer} from '../../slices/trainer'
import {selectCurrentAdmin} from '../../slices/admin'
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import CustomerHome from './home'
import  LineGraph  from "./my_page_weight_line_graph";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import axios from 'axios';
import InputFile from '../inputFile'
import Avatar from '@material-ui/core/Avatar';
import { setCurrentCustomerInfo, setCurrentCustomerInterests, selectCurrentCustomerStatus} from '../../slices/customer';
import InterestChips from './my_page_interests_chips'
import CustomerInterestsEdit from './customer_interests_edit'
import EvaluationData from './customer_evaluation_data'

const useStyles = makeStyles((theme) => ({
  // root: {
  //   display: 'flex',
  //   alignItems: 'center',
  // },
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: '#4DA7F0',
    '&:hover': {
      backgroundColor: '#4DA7F0',
    },
  },
  buttonProgress: {
    color: '#4DA7F0',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default function CustomerMyPage(props) {
  const classes = useStyles();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerHeaders = useSelector(selectCustomerHeaders);
  const currentTrainer = useSelector(selectCurrentTrainer);
  const currentAdmin = useSelector(selectCurrentAdmin);
  const currentCustomerInfos = useSelector(selectCurrentCustomerInfos);
  var currentCustomerInterests = useSelector(selectCurrentCustomerInterests);
  // 既存の興味のある分野のIDだけそ作成
  let interests_array = []
  if (currentCustomerInterests){
    var index = currentCustomerInterests.map(function( item ) {
      interests_array.push(item.id)            
    });
  }
  const [interestIDs, setInterestIDs] = React.useState(interests_array)
  const history = useHistory();
  const dispatch = useDispatch();
  const [thisCustomer, setThisCustomer] = useState({});
  const [thisCustomerInfo, setThisCustomerInfo] = useState({});
  const [recordNum, setRecordNum] = useState(0);
  const [apoNum, setApoNum] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [updateInterestsIDs, setUpdateInterestsIDs] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const customerStatus = useSelector(selectCurrentCustomerStatus);
  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  function handleInterestsUpdate(){
    const submit_url = `/customer_update_interests`
    setOpen(false);
    axios.put(submit_url, {ids: interestIDs} , customerHeaders)
    .then(res => {
      console.log({res})
      dispatch(setCurrentCustomerInterests(res.data.interests));
      // history.push(`/customer/my_page/${currentCustomer.id}`);
      history.push(`/`);
    })
    .catch(error => {
        console.log({error})
    });
  }

  useEffect(()=>{
    const url = `/return_customer_all_info/${props.match.params.id}`
    console.log({props},"aaaaa")
    console.log({url})
    axios.get(url)
    .then(function(res) {
      console.log({res})
      setRecordNum(res.data.customer_record_len)
      setThisCustomer(res.data.customer);
      setThisCustomerInfo(res.data.customer_info)
      setApoNum(res.data.appo_count)
    })
    .catch(function(error) {
      console.log({error})
    });
  },[])

  const [avatarOpen, setAvatarOpen] = React.useState(false);
  const handleClickAvatarOpen = () => {
    setAvatarOpen(true);
  };
  const handleAvatarClose = () => {
    setAvatarOpen(false);
  };
  const [preview, setPreview] = useState('');
  const [avatarData, setAvatarData] = useState({});

  function handleAvatarSubmit(){
      const formData = new FormData();
      if (!loading) {
        setSuccess(false);
        setLoading(true);
      }
      const url = `/customer/update_avatar/${props.match.params.id}`
      formData.append("avatar", avatarData);
      axios.put(url, formData, customerHeaders)
      .then(res => {
          setAvatarOpen(false);
          console.log({res})
          setSuccess(true);
          setLoading(false);
          dispatch(setCurrentCustomerInfo(res.data.data));
      })
      .catch(error => {
          setLoading(false);
          console.log({error})
      });

  }
  // eslint-disable-next-line react/prop-types
  function UpdateAvatar({setPreview, setAvatarData}) {
    const handleChangeFile = (e) => {
      const { files } = e.target;
      setPreview((prev) => (prev, window.URL.createObjectURL(files[0])));
      setAvatarData((prev) => (prev, e.target.files[0]));
    };
    return (
      <>
        {preview?  <>プロフィール画像を変更しますか？</> :
          <>ライブラリから選択してください</>}
        <img src={preview} width={'100%'}/>
        <InputFile
          type='file'
          accept='image/*'
          {...props}
          onChange={ handleChangeFile }
        />
      </>
    )
  }

  return (
    <>
    <div className={classes.root}>
      <Paper elevation={3} variant="outlined" square>
      <Grid container >
        <Grid item xs={1}/>
        <Grid item xs={3} style={{textAlign: 'center', marginTop: 'auto',marginBottom: 'auto'}}>
          {
            (() => {
              if (currentCustomer) {
                // eslint-disable-next-line react/prop-types
                if (currentCustomer.id == props.match.params.id){
                  return(
                    <> 
                    {currentCustomerInfos?.avatar_url ? (
                      <Avatar style={{width: '3.0em',height: '3.0em', marginLeft: 'auto', marginRight: 'auto'}} alt="Remy Sharp" src={currentCustomerInfos.avatar_url || ""} />
                    ) : (
                      <AccountCircleIcon style={{fontSize: '3.2em', color: 'grey'}} onClick={handleClickAvatarOpen}/>
                    )
                    }
                    {/* <div style={{fontSize: '0.5em'}} onClick={handleClickAvatarOpen}>プロフィールを変更</div> */}
                    </>
                  );
                }
              } else {
                return (<AccountCircleIcon style={{fontSize: '3em', color: 'grey'}}/>);
              }
            })()
          }
            <Dialog
              open={avatarOpen}
              keepMounted
              onClose={handleAvatarClose}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  <UpdateAvatar setPreview={setPreview} setAvatarData={setAvatarData}/>
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <div className={classes.wrapper}>
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    onClick={handleAvatarClose}
                    className={buttonClassname}
                    disabled={loading || success}
                >
                  キャンセル
                </Button>
                </div>
                <div className={classes.wrapper}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleAvatarSubmit}
                    className={buttonClassname}
                    disabled={loading || success}
                >
                  保存
                </Button>
                {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                </div>

              </DialogActions>
            </Dialog>
        </Grid>
        <Grid item xs={1}/>
        <Grid item xs={7} style={{paddingTop: 10}}>
          <div style={{fontSize: '1.2em', fontWeight: '700', color: 'grey'}}>
            { thisCustomer.first_name_kanji}{ thisCustomer.last_name_kanji }
          </div>
          <div style={{fontSize: '1.0em', color: '#959393', fontWeight: 600}}>
          {thisCustomerInfo? (<>
            {thisCustomerInfo.gender? 
              (<>
                {thisCustomerInfo.gender}/
              </>):(<></>)
            }
            {thisCustomerInfo.age? 
              (<>
                {thisCustomerInfo.age}歳
              </>):(<></>)
            }
          </>):<></>}<br/>
          2020年２月13日 入会<br/>
          </div>
        </Grid>
      </Grid>
    </Paper>
    </div>

    <div style={{margin: 20}}/>
    <div className={classes.root}>
      <Paper elevation={3} variant="outlined" square>
      <Grid container style={{marginBottom: 10}}>
        <Grid container  style={{paddingTop: 5}}>
          <Grid item xs={2}/>
          <Grid item xs={4} style={{textAlign: 'center'}}>
              <span className="customer_my_page_tag">過去のカルテ数</span><br/>
              <span style={{fontSize: '2em'}}>{recordNum}</span><br/>
            {
                (() => {
                    // eslint-disable-next-line react/prop-types
                    if (currentCustomer && currentCustomer.id == props.match.params.id) {
                        return(
                          <Chip
                            size="small"
                            label="全て"
                            clickable
                            // eslint-disable-next-line react/prop-types
                            onClick={() => history.push(`/customer_records/${props.match.params.id}`)}
                            style={{backgroundColor: '#4DA7F0', fontWeight: 700, color: 'white', paddingLeft: 20,paddingRight: 20}}
                          />
                        );
                    } else {
                        return (
                          <Chip
                            size="small"
                            label="全て"
                            style={{backgroundColor: '#4DA7F0', fontWeight: 700, color: 'white', paddingLeft: 20,paddingRight: 20}}
                          />
                        );
                    }
                })()
            }
          </Grid>
          <Grid item xs={4} style={{textAlign: 'center'}}>
          {currentCustomer? (<>
              <span className="customer_my_page_tag">予約残り</span><br/>
              <span style={{fontSize: '2em'}}>{apoNum}</span>
              <span style={{fontSize: '1.2em'}}>/
                {customerStatus? (<>
                  { customerStatus.numbers_of_contractnt }
                 </>):<></>}
            </span><br/>
          </>):<></>}
            {
                (() => {
                    if (currentCustomer && currentCustomer.id == props.match.params.id) {
                        return(
                          <Chip
                            size="small"
                            label="予約する"
                            clickable
                            onClick={() => history.push(`/customer/${currentCustomer.id}/calendar_new`)}
                            style={{backgroundColor: '#4DA7F0', fontWeight: 700, color: 'white', paddingLeft: 10,paddingRight: 10}}
                          />
                        );
                    } else {
                        return (
                            <></>
                        );
                    }
                })()
            }
          </Grid>
          <Grid item xs={2}/>
        </Grid>{/* <Grid container> */}
        {/* 予約中のカルテ */}
        <CustomerHome props={props}/>
        </Grid>{/* <Grid container> */}
        </Paper>
        <div style={{margin: 20}}/>
        <Paper elevation={3} variant="outlined" square>
      <Grid container >
        <Grid item xs={12} style={{paddingTop: 10}}>
          <Grid container >
            <Grid item xs={1}/>
            <Grid item xs={10}>

                {currentCustomer? (<>
                  <span className="customer_my_page_tag2">興味・関心</span>
                  <div style={{textAlign: 'right'}}>
                    <EditIcon style={{fontSize: '1.2em'}} onClick={handleClickOpen}/>
                  </div>
                </>)
                  :
                  <></>
                }
                
                <Grid container >
                  <Grid item xs={1}/>
                  <Grid item xs={10}>
                      {
                        (() => {
                          if (currentCustomer) {
                            return(
                              <>
                                {currentCustomerInterests? (
                                  <InterestChips interests={currentCustomerInterests}/>
                                ):(<></>)}
                                <Dialog
                                  open={open}
                                  onClose={handleClose}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogContent>
                                      {/* 興味がある分野の選択 */}
                                      <CustomerInterestsEdit interestIDs={interestIDs} setInterestIDs={setInterestIDs} setUpdateInterestsIDs={setUpdateInterestsIDs}/>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button onClick={handleClose} color="primary">
                                      キャンセル
                                    </Button>
                                    <Button onClick={handleInterestsUpdate} color="primary" autoFocus>
                                      保存
                                    </Button>
                                  </DialogActions>
                                </Dialog>
                              </>
                            )
                          } else {
                            return (<></>);
                          }
                        })()
                      }
                  </Grid>
                  <Grid item xs={1}/>
                </Grid>
            </Grid>
            <Grid item xs={1}/>
          </Grid>
        </Grid>{/* Grid item xs={12} */}
        <Grid item xs={12} style={{paddingTop: 10, paddingBottom: 15}}>
          <Grid container >
            <Grid item xs={1}/>
            <Grid item xs={10}>
                {
                  (() => {
                    if (currentCustomer) {
                      if (currentCustomer.id == props.match.params.id){
                        return(<>
                          <span className="customer_my_page_tag2">体重変化</span>
                          <div style={{textAlign: 'right'}}>
                            <EditIcon onClick={() => history.push(`/customer/weight/new`)} style={{fontSize: '1.2em'}}/>
                          </div>
                        </>);
                      }
                    } else {
                      return (<></>);
                    }
                  })()
                }
            </Grid>
            <Grid item xs={1}/>
          </Grid>{/* container */}
        </Grid>{/* Grid item xs={12} */}
      </Grid>
    {/* 体重変化の折れ線グラフ */}
    {currentCustomer? (
        <LineGraph/>
    ):(<></>)}
    </Paper>
    {currentAdmin? (
      <> <EvaluationData customer_id={props.match.params.id} /></>
    ):currentTrainer?(
      <> <EvaluationData customer_id={props.match.params.id} /></>
    ):(
      <></>
    )}
    </div>
    {/* <AvatarDialogSlide/> */}
    </>
  );
}
