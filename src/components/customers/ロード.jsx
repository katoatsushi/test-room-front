
import CircularProgress from '@material-ui/core/CircularProgress';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
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

function loading(){
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);
    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });
    function onSubmit() {
        if (!loading) {
          setSuccess(false);
          setLoading(true);
        }
        axios.post( url )
        .then(function (response) {
            setSuccess(true);
            setLoading(false);
            history.push(`/`)
        }).catch(function (response) {
            setLoading(false);
        })
    }
    return(<>
        <div className={classes.wrapper}>
        <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={buttonClassname}
            disabled={loading || success}
        >
            新規登録する
        </Button>
        {loading && <CircularProgress size={24} className={classes.buttonProgress} />}
        </div>
    </>)
}