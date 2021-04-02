/* eslint-disable react/prop-types */
import React, {useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import {selectCurrentTrainer, selectTrainerHeaders, setCurrentTrainerInfo, selectCurrentTrainerInfos} from '../../slices/trainer'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import axios from 'axios';
import InputFile from '../inputFile'
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

export default function TrainerMyPage(props) {
  const classes = useStyles();
  const currentTrainer = useSelector(selectCurrentTrainer);
  const trainerHeaders = useSelector(selectTrainerHeaders);
  const currentTrainerInfo = useSelector(selectCurrentTrainerInfos);

  const dispatch = useDispatch();
  // const [thisTrainer, setThisTrainer] = useState({});
  // const [avatarURL, setAvatarURL] = useState("");
  // const [open, setOpen] = React.useState(false);
  const [avatarOpen, setAvatarOpen] = React.useState(false);
  const handleClickAvatarOpen = () => {
    setAvatarOpen(true);
  };
  const handleAvatarClose = () => {
    setAvatarOpen(false);
  };
  // const handleClickOpen = () => {
  //   setOpen(true);
  // };
  // const handleClose = () => {
  //   setOpen(false);
  // };

//   useEffect(()=>{
//     const url = `/return_customer_all_info/${props.match.params.id}`
//     fetch(url)
//       .then( res => res.json() )
//       .then( res => {
//           console.log({res})
//           // setThisCustomer(res.customer);
//     })
//   },[])

  console.log({currentTrainerInfo})

  const [preview, setPreview] = useState('');
  const [avatarData, setAvatarData] = useState({});
  function handleAvatarSubmit(){
      const formData = new FormData();
      const url = `/trainer/update_avatar`
      console.log({trainerHeaders})
      formData.append("avatar", avatarData);
      axios.put(url, formData, trainerHeaders)
      .then(res => {
          console.log({res})
          setAvatarOpen(false);
          dispatch(setCurrentTrainerInfo(res.data.data));
      })
      .catch(error => {
          console.log({error})
      });

  }
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
              if (currentTrainer) {
                if (currentTrainer.id == props.match.params.id){
                  return(
                    <> 
                    {currentTrainerInfo?.avatar_url ? (
                      <Avatar style={{width: '3.0em',height: '3.0em', marginLeft: 'auto', marginRight: 'auto'}} alt="Remy Sharp" src={currentTrainerInfo.avatar_url || ""} />
                    ) : (
                      <AccountCircleIcon style={{fontSize: '3.2em', color: 'grey'}} onClick={handleClickAvatarOpen}/>
                    )
                    }
                    {/* <AccountCircleIcon style={{fontSize: '3.2em', color: 'grey'}} onClick={handleClickAvatarOpen}/> */}
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
            {/* { thisCustomer.first_name }{ thisCustomer.last_name } */}
          </div>
          <div style={{fontSize: '1.0em', color: '#959393', fontWeight: 600}}>

          男性/20歳<br/>
          2020年２月13日 入会<br/>
          </div>
        </Grid>
      </Grid>
    </Paper>
    </div>

    </>
  );
}

