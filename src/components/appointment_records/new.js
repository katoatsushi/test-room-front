/* eslint-disable react/prop-types */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles({
  root: {
    // minWidth: 275,
    width: '90%',
    margin: '0 auto',
    // margin: 'auto 0',
    // textAlign: 'center'
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
});

const AppointmentRecordNew = (props) => {
    console.log({props})
    const classes = useStyles();
    const history = useHistory();

    const response = props.location.state.response
    const time = props.location.state.time

    function handleDataCreate() {
      const url = `/customer/${ response.customer_id }/appointment/${ response.id }/create_customer_record`
      axios.post(url)
        .then(function (response) {
            if (response.status==200) {
                history.push(`/customer_record/${response.data.id}/new`)
            } else {
               console.log(response);
            }
      })
    }

    return (
        <div style={{marginTop: 30}}>
          <Card className={classes.root}>
            <CardContent>
              <Typography variant="h5" component="h2" style={{fontSize: '1.0em'}}>
                 {response.first_name + response.last_name}様の
                 { response.fitness_name }のフィードバックを作成しますか？
              </Typography>
              <hr/>
              時間: {time[0][0]}:{time[0][1]} 〜 {time[1][0]}:{time[1][1]}<br/>
              予約時内容: { response.fitness_name }
              <Typography variant="body2" component="p">
              </Typography>
            </CardContent>
            <CardActions>
              <Button 
                  style={{width: '100%', margin: '0 auto',textAlign: 'center',fontSize: '0.9em'}} 
                  variant="contained" 
                  size='large' 
                  color="secondary"
                  onClick={() => handleDataCreate()}>
                ここまま進む
              </Button>
            </CardActions>
          </Card>
        </div>
  );
}

export default AppointmentRecordNew;