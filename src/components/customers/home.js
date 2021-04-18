/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'
import { useDispatch } from 'react-redux';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import MoreIcon from '@material-ui/icons/MoreVert';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { selectCurrentCustomer, selectCustomerHeaders, customerRemove, } from '../../slices/customer';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { setCustomerRecords, customerRecordRemove, getCustomerRecords } from '../../slices/customer_record';
import Evaluation from './evaluation'

const useStyles = makeStyles({
  root: {
    minWidth: 275,
    display: 'inline-block',
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
 paper: {
    padding: 5,
    textAlign: 'center',
  },
});

function ShowApo({apo, apos, setApos}) {
  console.log({apos})
  const customerHeader = useSelector(selectCustomerHeaders);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  function handleCancelClose(e) {
      const url = `/appointment/${e.id}`
      axios.delete(url, customerHeader)
      // axios.delete(url)
      .then((res) => {
        const message = "予約をキャンセルしました！"
        enqueueSnackbar(message, { 
            variant: 'success',
        });
        const newApos = apos.filter((apo) => {
            return apo !== e;
        });
        setApos(newApos)
        setOpen(false);
      })
      .catch((err) => {
        dispatch(customerRemove());
        const message = err.response?.data.errors[0]
        enqueueSnackbar(message, { 
            variant: 'error',
        });
        console.log({err})
        console.log("error:", err.response.data.errors)
        setOpen(false);
        // TODO::ログイン画面に戻りたい
        // const history = useHistory();
      });
  }
  const handleClickOpen = () => {
    setOpen(true);
  };
  return(<>
      <Paper className="border_light apos_paper">
      <Grid container spacing={2} style={{height: '80%'}}>
        <Grid item xs={10}>
        <div style={{fontWeight: 700, color: '#555555'}}>
          { apo.date[0] + '/' + apo.date[1] + '/' + apo.date[2] }
          &nbsp;&nbsp;
          { apo.start[0] + ':' + apo.start[1] } 〜 
          {/* { apo.finish[0] + ':' + apo.finish[1] } */}
        </div>
        【{ apo.store_name}店】
        { apo.menu }
          </Grid>
          <Grid item xs={2}>
            <IconButton aria-label="display more actions" edge="end" color="inherit">
              <MoreIcon onClick={handleClickOpen} />
            </IconButton>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              { apo.date[0] + '年' + apo.date[1] + '月' + apo.date[2] + '日' }<br/>
              { apo.start[0] + ':' + apo.start[1] } 〜 { apo.finish[0] + ':' + apo.finish[1] }
              の{ apo.menu }の予約をキャンセルしますか？
            </DialogTitle>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                戻る
              </Button>
              <Button onClick={() => handleCancelClose(apo)} color="secondary" autoFocus>
                キャンセルする
              </Button>
            </DialogActions>
          </Dialog>
      </Grid>
      </Paper>
  </>);
}


export default function CustomerHome(props) {
    const id =  props.props.match.params.id
    const url = `/customer_page/${id}`
    const [apos, setApos] = useState([]);
    const classes = useStyles();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const customerRecords = useSelector(getCustomerRecords);

    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            // setCustomer(res.data.customer);
            // setRecords(res.data.customer_records);
            setApos(res.data.appointments);
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])
    

  function SliceApos(){
    if(apos){
      if(apos.length > 2){
        const aposOnComing = apos.slice(0, 2)
        const nextApos = apos.slice(2)
        return(
          <>
          {aposOnComing.map((apo, index) => <ShowApo key={index} apo={apo} apos={apos} setApos={setApos}/>)}
          <Accordion style={{width: '95%', marginLeft: 'auto', marginRight: 'auto'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>もっと見る</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography >
                { nextApos.map((apo, index) => <ShowApo key={index} apo={apo} apos={apos} setApos={setApos}/>) }
              </Typography>
            </AccordionDetails>
          </Accordion>
          </>
        )
      }else{
        return(
          <>
            {apos.map((apo, index) => <ShowApo key={index} apo={apo} apos={apos} setApos={setApos}/>)}
          </>
        );
      }
    }
  }
  return (
      <>
      {currentCustomer? (
        <>
        {customerRecords? (
          <Evaluation/>
        ):(<></>)}
        </>
      ):(<></>)}
        { SliceApos() }
      </>
  );
}

