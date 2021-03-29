import React, {useEffect, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {selectCurrentCustomer, selectCurrentCustomerInfos, selectCurrentCustomerInterests, selectCustomerHeaders} from '../../slices/customer'
import {selectCurrentTrainer, selectTrainerHeaders} from '../../slices/trainer'
import {selectCurrentAdmin, selectAdminHeaders} from '../../slices/admin'
import Chip from '@material-ui/core/Chip';
import EditIcon from '@material-ui/icons/Edit';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';
import CustomerHome from './home'
import  LineGraph  from "./my_page_weight_line_graph";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios, { AxiosError } from 'axios';
import InputFile from '../inputFile'
import Avatar from '@material-ui/core/Avatar';
import { setCurrentCustomer,setCurrentCustomerInfo, setCurrentCustomerStatus, setCurrentCustomerInterests, setHeaders, customerRemove} from '../../slices/customer';
import InterestChips from './my_page_interests_chips'
import CustomerInterests from './customer_individual_info/customer_interests'
import EvaluationData from './customer_evaluation_data'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function CustomerMyPage(props) {
  const classes = useStyles();
  const currentCustomer = useSelector(selectCurrentCustomer);
  const customerHeaders = useSelector(selectCustomerHeaders);
  const currentTrainer = useSelector(selectCurrentTrainer);
  const trainerHeaders = useSelector(selectTrainerHeaders);
  const currentAdmin = useSelector(selectCurrentAdmin);
  const adminHeaders = useSelector(selectAdminHeaders);
  const currentCustomerInfos = useSelector(selectCurrentCustomerInfos);
  var currentCustomerInterests = useSelector(selectCurrentCustomerInterests);
  const history = useHistory();
  const dispatch = useDispatch();
  const [thisCustomer, setThisCustomer] = useState({});
  const [avatarURL, setAvatarURL] = useState("");
  const [allInterests, setallInterests] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [thisCustomerInterests, setThisCustomerInterests] = useState();
  const [updateInterestsIDs, setUpdateInterestsIDs] = useState();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  function handleInterestsUpdate(){
    const submit_url = `/customer_update_interests`
    setOpen(false);
    axios.put(submit_url, {ids: updateInterestsIDs} , customerHeaders)
    .then(res => {
      dispatch(setCurrentCustomerInterests(res.data.interests));
      history.push(`/customer/my_page/${currentCustomer.id}`);
      console.log({res})
    })
    .catch(error => {
        console.log({error})
    });
  }
  useEffect(()=>{
    const url = `/return_customer_all_info/${props.match.params.id}`
      axios.get(url)
      .then(function(res) {
        setThisCustomer(res.data.customer);
      })
      .catch(function(error) {
        console.log({error})
      });
  },[])

  // console.log({updateInterestsIDs})

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
      const url = `/customer/update_avatar/${props.match.params.id}`
      formData.append("avatar", avatarData);
      axios.put(url, formData, customerHeaders)
      .then(res => {
          setAvatarOpen(false);
          console.log({res})
          dispatch(setCurrentCustomerInfo(res.data.data));
      })
      .catch(error => {
          console.log({error})
      });

  }
  function UpdateAvatar({setPreview, setAvatarData}) {
    const handleChangeFile = (e) => {
      const { files } = e.target;
      setPreview((prev) => (prev, window.URL.createObjectURL(files[0])));
      setAvatarData((prev)　=> (prev, e.target.files[0]));
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
                if (currentCustomer.id == props.match.params.id){
                  return(
                    <> 
                    {currentCustomerInfos?.avatar_url ? (
                      <Avatar style={{width: '3.0em',height: '3.0em', marginLeft: 'auto', marginRight: 'auto'}} alt="Remy Sharp" src={currentCustomerInfos.avatar_url || ""} />
                    ) : (
                      <AccountCircleIcon style={{fontSize: '3.2em', color: 'grey'}} onClick={handleClickAvatarOpen}/>
                    )
                    }
                    <div style={{fontSize: '0.5em'}} onClick={handleClickAvatarOpen}>プロフィールを変更</div>
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
                <Button onClick={handleAvatarClose} color="primary">
                  キャンセル
                </Button>
                <Button onClick={handleAvatarSubmit} color="primary">
                  保存
                </Button>
              </DialogActions>
            </Dialog>
        </Grid>
        <Grid item xs={1}/>
        <Grid item xs={7} style={{paddingTop: 10}}>
          <div style={{fontSize: '1.3em', fontWeight: '700'}}>
            {/* {currentCustomer.first_name}{currentCustomer.last_name} */}
            { thisCustomer.first_name }{ thisCustomer.last_name }
          </div>
          <div style={{fontSize: '1.0em', color: '#959393', fontWeight: 600}}>

          男性/20歳<br/>
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
          <Grid item xs={4}　style={{textAlign: 'center'}}>
              <span className="customer_my_page_tag">過去のカルテ数</span><br/>
              <span style={{fontSize: '2em'}}>20</span><br/>
            {
                (() => {
                    if (currentCustomer && currentCustomer.id == props.match.params.id) {
                        return(
                          <Chip
                            size="small"
                            label="全て"
                            clickable
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
              <span className="customer_my_page_tag">予約残り</span><br/>
              <span style={{fontSize: '2em'}}>3</span>
              <span style={{fontSize: '1.2em'}}>/4</span><br/>
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
            
                <span className="customer_my_page_tag2">興味・関心</span>
                {currentCustomer?
                  <div style={{textAlign: 'right'}}><EditIcon style={{fontSize: '1.2em'}} onClick={handleClickOpen}/></div>
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
                                      <CustomerInterests interests={currentCustomerInterests} setUpdateInterestsIDs={setUpdateInterestsIDs}/>
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
                <span className="customer_my_page_tag2">体重変化</span>
                {
                  (() => {
                    if (currentCustomer) {
                      if (currentCustomer.id == props.match.params.id){
                        return(
                        <div style={{textAlign: 'right'}}>
                          <EditIcon onClick={() => history.push(`/customer/weight/new`)} style={{fontSize: '1.2em'}}/>
                        </div>
                        );
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

export default CustomerMyPage;

