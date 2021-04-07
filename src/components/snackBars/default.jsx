/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import { selectSnackBar , setSnackBar, snackBarRemove } from '../../slices/snack_bar'
import { useDispatch,useSelector } from 'react-redux';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function DefaultBar({ error , message }) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const getSnackBar = useSelector(selectSnackBar);
  const dispatch = useDispatch();

  function remove_snack_bar(){
      dispatch(snackBarRemove())
  }
  useEffect(()=>{
    setTimeout(remove_snack_bar, 5000);
  },[])

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(snackBarRemove())
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        {error? (
          <Alert onClose={handleClose} severity="error">
            {message}
          </Alert>
        ):(
          <Alert onClose={handleClose} severity="success">
            {message}
          </Alert>
        )}
      </Snackbar>

    </div>
  );
}
