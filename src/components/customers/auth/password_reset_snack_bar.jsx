/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

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

// export default function PasswordResetSnackBar({barOpen, error,message}) {
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function PasswordResetSnackBar({barOpen, error , message}) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className={classes.root}>
      {/* <Button variant="outlined" onClick={handleClick}>
        Open success snackbar
      </Button> */}
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
