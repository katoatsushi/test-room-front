import React, { useEffect, useState ,useCallback} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
import axios, { AxiosError } from 'axios';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

function Address(props) {
  const [postalCodeA, setPostalCodeA] = React.useState('');
  const [postalCodeB, setPostalCodeB] = React.useState('');
  const [prefecture, setPrefecture] = React.useState('');
  const [city, setCity] = React.useState('');
  const [town, setTown] = React.useState('');
  const [addressDetail, setAddressDetail] = React.useState('');

  async function handleAddressSearch(){
      let url = 'https://apis.postcode-jp.com/api/v4/postcodes/'
      url = url + postalCodeA + postalCodeB
      let result = await axios.get(url, {headers: {apiKey: '8ugJdI2RobrvZIcBIZ9GNNNEwtRc5tbbx5PaLMi'}});
      if(result.data){
        setPrefecture(result.data[0].pref)
        setCity(result.data[0].city)
        setTown(result.data[0].town)
      }
  }
  useEffect(()=>{
    props.setCustomerInfo((prev) => ({...prev, address: {postalCode: postalCodeA + postalCodeB, address: prefecture + city + town + addressDetail}}))
  },[postalCodeA, postalCodeB, prefecture, city, town, addressDetail])

  function PostalFirst(e) {
    setPostalCodeA(e.target.value);
  }
  function PostalLast(e) {
    setPostalCodeB(e.target.value);
  }
  function handleSetPrefecture(e) {
    setPrefecture(e.target.value);
  }
  function handleSetCity(e) {
    setCity(e.target.value);
  }
  function handleSetTown(e) {
    setTown(e.target.value);
  }
  return(
      <>
       <Grid container alignItems="center" justify="center">
        <Grid item xs={8}>
        <div className="customer_info_tag">住所を教えてください</div>
        <div>
          <TextField
            style={{width: '30%', textAlign: 'center',backgroundColor: "white"}}
            id="outlined-size-small"
            value={postalCodeA}
            variant="outlined"
            size="small"
            onChange={PostalFirst}
          />
          _
          <TextField
            style={{width: '40%', textAlign: 'center',backgroundColor: "white"}}
            id="outlined-size-small"
            value={postalCodeB}
            variant="outlined"
            size="small"
            onChange={PostalLast}
          />
        </div>
        <Button variant="contained" onClick={handleAddressSearch} size="small">
          住所を検索する
        </Button>
        <div>
          <br/>
          <TextField
            label="都道府県"
            style={{width: '80%', textAlign: 'center', backgroundColor: "white"}}
            id="outlined-size-small"
            value={ prefecture }
            onChange={ handleSetPrefecture }
            variant="outlined"
            size="small"
          />
          <br/><br/>
          <TextField
            label="市区町村"
            style={{width: '80%', textAlign: 'center', backgroundColor: "white"}}
            id="outlined-size-small"
            value={ city }
            onChange={ handleSetCity }
            variant="outlined"
            size="small"
          />
          <br/><br/>
          <TextField
            label="番地・マンション名"
            style={{width: '100%', textAlign: 'center', backgroundColor: "white"}}
            id="outlined-size-small"
            value={town}
            onChange={ handleSetTown }
            variant="outlined"
            size="small"
          />
        </div>
        </Grid>   
      </Grid>
      </>
  )
}
export default Address;