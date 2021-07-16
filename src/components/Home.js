import React, {useEffect, useState} from 'react';
import Grid from '@material-ui/core/Grid';
import Pagination from '@material-ui/lab/Pagination';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import styled from "styled-components";
import './Home.scss';

function Home() {
  const mainHome = styled.div `
    width: 100%;
    margin: 0 !important;
  `;

  const [countryList, setCountryList] = useState([]);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [details, setDetails] = useState([]);
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  useEffect(()=> {
    return fetch('http://universities.hipolabs.com/search?country=United+Kingdom')
      .then((response) => response.json())
      .then((responseJson) => {
        setCountryList(responseJson);
       })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const loadDetails = () => {
    return fetch('https://official-joke-api.appspot.com/random_joke')
      .then((responseDetails) => responseDetails.json())
      .then((responseDetailsJson) => {
        setDetails(responseDetailsJson);
        setLoader(false);
       })
      .catch((error) => {
        console.error(error);
      });
  };

  const getCountryList = () => {
    return (
      <React.Fragment>
        {countryList.map((item, index) => (
          (index > paginationIndex && index < paginationIndex + 29) ? <Grid item xs={12} sm={12} md={6} lg={3} xl={3} >
            <Card variant="outlined" onClick={()=> {setLoader(true); loadDetails(); setOpen(true);}} key={index} className="dataContainer">
              <CardContent>{item.name}</CardContent>
              <CardContent>{item.country}</CardContent>
            </Card>
          </Grid> : ''
        ))}
      </React.Fragment>
    );
  };

  const getDialogContent = () => {
    return (
      <div>
        {loader && <CircularProgress />}
        {details && details.setup && <h2>{details.setup}</h2>}
        {(details && details.punchline) && <h3> {details.punchline}</h3>}
      </div>
    );
  };

  const getDetails = () => {
    return (
      <Dialog
        open={open}
        onClose={()=> {setOpen(false); setDetails([]);}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent className="detailsModal">
          {!loader && <IconButton aria-label="close" onClick={()=> {setOpen(false); setDetails([]);}} className="modalClose"> <CloseIcon /></IconButton>}
          <DialogContentText id="alert-dialog-description">
            {getDialogContent()}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  };

  return(
    <mainHome>
      <div className="mainHeader">
        <div className="header">
          <h1>University Details</h1>
        </div>
      </div>
      <div className="mainContainer">
        <Grid container xs={12} sm={12} md={12} lg={12} xl={12} spacing={3}>
          {getCountryList()}
        </Grid>
        {(countryList && countryList.length > 0) && <Pagination className="paginationContainer" count={Math.ceil(countryList.length/30)} size="small" onChange={(e, val)=> setPaginationIndex((val-1)*30)}/>}
      </div>
      <div className="detailsModal">{getDetails()}</div>
    </mainHome>
  )
}

export default Home;
