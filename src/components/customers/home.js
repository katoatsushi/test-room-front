import React, { useEffect, useState, Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import axios from 'axios'
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
    useHistory,
    useLocation,
  } from 'react-router-dom';
import List from '@material-ui/core/List';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import Box from '@material-ui/core/Box';
import MoreIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DeleteIcon from '@material-ui/icons/Delete';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

const useListStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    // backgroundColor: '#A7F1FF',
    transform: 'translateZ(0)',
    borderRadius: 3,
    height: 215,
    // height: '40%',
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
    width: '98%',
    // backgroundColor: '#C2EEFF',
  },
  title: {
    color: theme.palette.primary.light,
    backgroundColor: 'grey',
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
}));


function ShowApo({apo, apos, setApos}) {
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  async function handleCancelClose(e) {
      const url = `/appointment/${e.id}`
      try {
          await axios.delete(url);
          const newApos = apos.filter((apo, index) => {
              return apo !== e;
          });
          setApos(newApos)
          setOpen(false);
      } catch (err) {
          console.log("error:", err.response.data.errors)
      }
  }
  const handleClickOpen = (apo) => {
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
          { apo.finish[0] + ':' + apo.finish[1] }
        </div>
        { apo.menu }のご予約{ apo.id }
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
              {apo.id}:
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
    const [customer, setCustomer] = useState();
    const [records, setRecords] = useState([]);
    const [apos, setApos] = useState([]);
    const classes = useStyles();
    const listClasses = useListStyles();
    const history = useHistory();

    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            setCustomer(res.data.customer);
            setRecords(res.data.customer_records);
            setApos(res.data.appointments);
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])

    const useCardStyles = makeStyles({
        root: {
            minWidth: 275,display: 'flex',flexWrap: 'wrap',overflow: 'hidden',
        },
        bullet: {
            display: 'flex',margin: '0 2px',transform: 'scale(0.5)',flexWrap: 'nowrap',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
    });
    

  function SliceApos(){
    if(apos){
      if(apos.length > 2){
        const aposOnComing = apos.slice(0, 2)
        const nextApos = apos.slice(2)
        return(
          <>
          {aposOnComing.map((apo, index) => <ShowApo apo={apo} apos={apos} setApos={setApos}/>)}
          <Accordion style={{width: '95%', marginLeft: 'auto', marginRight: 'auto'}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography className={classes.heading}>もっと見る</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                { nextApos.map((apo, index) => <ShowApo apo={apo} apos={apos} setApos={setApos}/>) }
              </Typography>
            </AccordionDetails>
          </Accordion>
          </>
        )
      }else{
        return(
          <>
            {apos.map((apo, index) => <ShowApo apo={apo} apos={apos} setApos={setApos}/>)}
          </>
        );
      }
    }
  }
  return (
      <>
        { SliceApos() }
      </>
  );
}

