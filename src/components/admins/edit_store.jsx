/* eslint-disable react/prop-types */
import React , { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useSnackbar } from 'notistack';
import {selectCurrentAdmin, selectAdminHeaders} from '../../slices/admin'
import { useSelector } from 'react-redux'
import { DataGrid } from '@material-ui/data-grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Icon from '@material-ui/core/Icon';
import AddCircleIcon from '@material-ui/icons/AddCircle';
// import { useSnackbar } from 'notistack';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: 10,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    wordWrap: 'break-word',
  },
  table: {
    minWidth: 700,
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

// eslint-disable-next-line react/prop-types
function StoreCell({store, setReload}){
    const [open, setOpen] = React.useState(false);
    const [newStore, setNewStore] = React.useState();
    const [ check, setCheck] = React.useState(false);
    const [ deleteOpen, setDeleteOpen ] = React.useState(false);
    const [ deleteCheck, setDeleteCheck ] = React.useState("");
    const classes = useStyles()
    const adminHeaders = useSelector(selectAdminHeaders);
    const url = `/stores/${store.id}`
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    
    const handleClickOpen = () => {
        setOpen(true);
        setNewStore(store)
    };
    const handleClose = () => {
        setOpen(false);
    };
    function handleDeleteOpen() {
      setOpen(false);
      setDeleteOpen(true);
    }
    function handleDeleteClose() {
      setOpen(false);
      setDeleteOpen(false)
    }
    function handleNameChange(e){
        setCheck(true)
        setNewStore((prev) => ({id: prev.id, company_id: prev.company_id, number_of_rooms: prev.number_of_rooms,
                                store_address: prev.store_address,store_name: e.target.value, tel: prev.tel }))
    }
    function handleAddressChange(e){
        setCheck(true)
        setNewStore((prev) => ({id: prev.id, company_id: prev.company_id, number_of_rooms: prev.number_of_rooms,
                                store_address: e.target.value,store_name: prev.store_name, tel: prev.tel }))
    }
    function handleRoomNumChange(e){
        setCheck(true)
        setNewStore((prev) => ({id: prev.id, company_id: prev.company_id, number_of_rooms: e.target.value,
                                store_address: prev.store_address,store_name: prev.store_name, tel: prev.tel }))
    }
    function handleTELChange(e){
        setCheck(true)
        setNewStore((prev) => ({id: prev.id, company_id: prev.company_id, number_of_rooms: prev.number_of_rooms,
                                store_address: prev.store_address,store_name: prev.store_name, tel: e.target.value }))
    }
    function handleDeleteCheckChange(e){
      setDeleteCheck(e.target.value)
    }
    function handleSubmit(){
        axios.put(url, newStore, adminHeaders)
        .then(res => {
          setOpen(false);
          setDeleteOpen(false)
          setReload((prev) => (!prev))
          const message = "店舗情報を更新しました！" + "ページをリロードして確認してください"
          enqueueSnackbar(message, { 
              variant: 'success',
          });
        })
        .catch(err => {
          setOpen(false);
          setDeleteOpen(false)
          setReload((prev) => (!prev))
          const message = err.response?.data.errors[0];
          enqueueSnackbar(message, { 
              variant: 'error',
          });
          console.log({err})
        });
    }

    function handleStoreDeactivate(){
      const delete_url = `/admin/store/deactivate/${store.id}`
      axios.put(delete_url,{}, adminHeaders)
      .then(res => {
        setOpen(false);
        setReload(true)
        setDeleteCheck("")
        const message = "店舗を削除しました！" + "ページをリロードして確認してください"
        enqueueSnackbar(message, { 
            variant: 'success',
        });
        setDeleteOpen(false)
        setReload((prev) => (!prev))
      })
      .catch(err => {
        setDeleteCheck("")
        const message = err.response?.data.errors[0];
        enqueueSnackbar(message, { 
            variant: 'error',
        });
        setDeleteOpen(false)
        setReload((prev) => (!prev))
      });
    }

    return(
    <>
      
        {store.deactivate? (<>
          <StyledTableRow style={{backgroundColor: '#FFBEDA'}}>
          <StyledTableCell align="left"></StyledTableCell>
          <StyledTableCell align="left">{store.store_name}</StyledTableCell>
          <StyledTableCell component="th" scope="row" >{store.number_of_rooms}</StyledTableCell>
          <StyledTableCell align="left">{store.store_address}</StyledTableCell>
          <StyledTableCell align="left">{store.tel}</StyledTableCell>
          <StyledTableCell align="left"></StyledTableCell>
          <StyledTableCell align="left">
              <Button disabled variant="contained">
                  削除された店舗です
              </Button>
          </StyledTableCell>
          </StyledTableRow>
        </>):(
          <StyledTableRow >
          <StyledTableCell align="left"></StyledTableCell>
          <StyledTableCell align="left">{store.store_name}</StyledTableCell>
          <StyledTableCell component="th" scope="row" >{store.number_of_rooms}</StyledTableCell>
          <StyledTableCell align="left">{store.store_address}</StyledTableCell>
          <StyledTableCell align="left">{store.tel}</StyledTableCell>
          <StyledTableCell align="left"></StyledTableCell>
          <StyledTableCell align="left">
              <Button onClick={handleClickOpen} variant="contained" color="primary">
                  編集
              </Button>
              <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                  <DialogTitle id="form-dialog-title">{store.store_name}店の詳細情報を編集する</DialogTitle>
                  <DialogContent>
                  <TextField
                      id="outlined-required"
                      label="店舗名"
                      style={{width: '100%',marginBottom: 20}}
                      defaultValue={store.store_name}
                      variant="outlined"
                      onChange={handleNameChange}
                  />
                  <TextField
                      id="outlined-number"
                      label="部屋数"
                      type="number"
                      style={{width: '50%',marginBottom: 20}}
                      defaultValue={store.number_of_rooms}
                      InputLabelProps={{
                          shrink: true,
                      }}
                      variant="outlined"
                      onChange={handleRoomNumChange}
                  />
                  <TextField
                      id="outlined-required"
                      label="住所"
                      style={{width: '100%', marginBottom: 20}}
                      defaultValue={store.store_address}
                      variant="outlined"
                      onChange={handleAddressChange}
                  />
                  <TextField
                      id="outlined-required"
                      label="TEL"
                      style={{width: '100%',marginBottom: 20}}
                      defaultValue={store.tel}
                      variant="outlined"
                      onChange={handleTELChange}
                  />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} variant="contained">
                        キャンセル
                    </Button>
                    <Button onClick={handleDeleteOpen} color="secondary" variant="contained">
                        削除する
                    </Button>
                    {check?(
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            保存する
                        </Button>
                    ):(
                        <Button  disabled  variant="contained" color="primary">
                            保存する
                        </Button>
                    )}
                  </DialogActions>
              </Dialog>
          </StyledTableCell>
          </StyledTableRow>
        )}
      

      <Dialog open={deleteOpen} onClose={handleDeleteClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">{store.store_name}店を削除する</DialogTitle>
          <span style={{color: 'red', marginLeft: 50, marginRight: 50}}>※「削除する」と入力してください</span>
          <DialogContent>
                <TextField
                    id="outlined-required"
                    label="「削除する」と入力してください"
                    style={{width: '100%',marginBottom: 20}}
                    variant="outlined"
                    value={deleteCheck}
                    onChange={handleDeleteCheckChange}
                />
          </DialogContent>
          <DialogActions>
          <Button onClick={handleDeleteClose} variant="contained">
              キャンセル
          </Button>
          {deleteCheck=="削除する"?(
              <Button onClick={handleStoreDeactivate} variant="contained" color="secondary">
                  削除する
              </Button>
          ):(
              <Button  disabled  variant="contained" color="primary">
                  削除する
              </Button>
          )}
          </DialogActions>
      </Dialog>
    </>
  );
}

export default function AdminEditStore() {
//   POST   /stores(.:format)       stores#create
//   PATCH  /stores/:id(.:format)   stores#update
    const classes = useStyles();
    const adminHeaders = useSelector(selectAdminHeaders);
    const currentAdmin = useSelector(selectCurrentAdmin);
    const [stores, setStores] = useState([]);
    const [compay, setCompany] = useState([]);
    const [reload, setReload] = useState();
    const [open, setOpen] = useState(false);
    const [newStore, setNewStore] = React.useState({number_of_rooms: null,store_address: null,store_name: null, tel: null});
    const [ check, setCheck] = React.useState(false);
    const url = `/stores`
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(()=>{
        axios.get(url, adminHeaders)
        .then(function(res) {
            setStores(res.data.stores)
            setCompany(res.data.company)
        })
        .catch(function(error) {
          console.log({error})
        });
    },[reload])

    function hadleStoreCreate(){
      setOpen(true)
    }

    function handleClickOpen() {
      setOpen(true)
    }
    const handleClose = () => {
        setOpen(false);
    };
    function handleNameChange(e){
        setCheck(true)
        setNewStore((prev) => ({number_of_rooms: prev.number_of_rooms,store_address: prev.store_address,store_name: e.target.value, tel: prev.tel }))
    }
    function handleAddressChange(e){
        setCheck(true)
        setNewStore((prev) => ({number_of_rooms: prev.number_of_rooms,store_address: e.target.value,store_name: prev.store_name, tel: prev.tel }))
    }
    function handleRoomNumChange(e){
        setCheck(true)
        setNewStore((prev) => ({number_of_rooms: e.target.value,store_address: prev.store_address,store_name: prev.store_name, tel: prev.tel }))
    }
    function handleTELChange(e){
        setCheck(true)
        setNewStore((prev) => ({number_of_rooms: prev.number_of_rooms,store_address: prev.store_address,store_name: prev.store_name, tel: e.target.value }))
    }
    function handleSubmit(){
        axios.post(url, newStore, adminHeaders)
        .then(res => {
          setOpen(false);
          setReload(true)
          const message = "新規店舗を追加しました！"
          enqueueSnackbar(message, { 
              variant: 'success',
          });
        })
        .catch(err => {
          const message = err.response?.data.errors[0];
          enqueueSnackbar(message, { 
              variant: 'error',
          });
          console.log({err})
        });
    }
    return(<>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                    <StyledTableCell align="left"></StyledTableCell>
                    <StyledTableCell align="left">店舗名</StyledTableCell>
                    <StyledTableCell align="left">部屋数</StyledTableCell>
                    <StyledTableCell align="left">住所</StyledTableCell>
                    <StyledTableCell align="left">TEL</StyledTableCell>
                    <StyledTableCell align="left"></StyledTableCell>
                    <StyledTableCell align="left">
                      <Button
                        variant="contained"
                        color="secondary"
                        className={classes.button}
                        startIcon={<AddCircleIcon />}
                        // onClick={ hadleStoreCreate }
                        onClick={handleClickOpen}
                      >
                        店舗を追加
                      </Button>
                      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                          <DialogTitle id="form-dialog-title">新規の店舗を追加する</DialogTitle>
                          <DialogContent>
                          <TextField
                              id="outlined-required"
                              label="店舗名"
                              style={{width: '100%',marginBottom: 20}}
                              variant="outlined"
                              onChange={handleNameChange}
                          />
                          <TextField
                              id="outlined-number"
                              label="部屋数"
                              type="number"
                              style={{width: '50%',marginBottom: 20}}
                              InputLabelProps={{
                                  shrink: true,
                              }}
                              variant="outlined"
                              onChange={handleRoomNumChange}
                          />
                          <TextField
                              id="outlined-required"
                              label="住所"
                              style={{width: '100%', marginBottom: 20}}
                              variant="outlined"
                              onChange={handleAddressChange}
                          />
                          <TextField
                              id="outlined-required"
                              label="TEL"
                              style={{width: '100%',marginBottom: 20}}
                              variant="outlined"
                              onChange={handleTELChange}
                          />
                          </DialogContent>
                          <DialogActions>
                          <Button onClick={handleClose} variant="contained">
                              キャンセル
                          </Button>
                          {check?(
                              <Button onClick={handleSubmit} variant="contained" color="primary">
                                  保存する
                              </Button>
                          ):(
                              <Button onClick={handleClose} disabled  variant="contained" color="primary">
                                  保存する
                              </Button>
                          )}
                          </DialogActions>
                      </Dialog>
                    </StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                { stores.map((store, index) => <StoreCell key={index} store={store} setReload={setReload}/>) }
              </TableBody>
            </Table>
          </TableContainer>
    </>)
}