import React, { useEffect, useState, Component } from 'react';
import axios from 'axios'
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

export default function AdminMenues(){
    const url = `/get/all_customers`
    const serch_url = `/serch/customers`
    const [allCustomers, setAllCustomers] = useState([]);
    const [searchCustomers, setSearchCustomers] = useState([]);
    const classes = useStyles();

    useEffect(()=>{
        axios.get(url)
        .then(function(res) {
            console.log({res}, "確認だよん")
            setAllCustomers(res.data.all_customers);
        })
        .catch(function(error) {
          console.log({error})
        });
    },[])

    return(
        <>
        <div className={classes.root}>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <Link href="/trainer/sign_up"　style={{textAlign: 'center'}}>
                    トレーナーを登録する
                  </Link><br/>
                  新規のトレーナーを発行します
                </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Link href="/trainer/sign_up"　style={{textAlign: 'center'}}>
                      セッションメニューを追加する
                    </Link><br/>
                    セッションメニューを新しく追加できます
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Link href="/trainer/sign_up"　style={{textAlign: 'center'}}>
                      店舗を追加する
                    </Link><br/>
                    既存の店舗の部屋数もこちらから変更できます
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Link href="/admin_schedule"　style={{textAlign: 'center'}}>
                      スケジュールを追加する
                    </Link><br/>
                    スケジュールを追加する
                  </Paper>
                </Grid>


                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <Link href="/admin/trainer_shifts"　style={{textAlign: 'center'}}>
                      トレーナーシフト管理
                    </Link><br/>
                      今月のトレーナーのシフトを管理する
                  </Paper>
                </Grid>
            </Grid>
        </div>
        </>
    );  
}