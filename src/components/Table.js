import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import moment from 'moment';

const useRowStyles = makeStyles({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  lightBulb: {
    verticalAlign: 'middle',
  },
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
    width: '100%',
    overflowX: 'auto',
    
  },
  table: {
    width: '100%',
  },
  tablecell: {
    fontSize: '40pt',
}

});

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();

  return (
    <React.Fragment>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.block_name}
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.from}</TableCell>
        <TableCell align="right">{row.to}</TableCell>
        <TableCell  align="center">
        <span
                  style={ {backgroundColor : row.fee_type === 'Free' ? '#9fcf9f':'#f68f8f',padding: "2.5% 10%"
                  } }
                >
                  {row.fee_type}
                </span>
                </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Slots
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead >
                  <TableRow>
                    <TableCell >Date</TableCell>
                    <TableCell align="right">Min Age Limit</TableCell>
                    <TableCell align="right">Dose 1</TableCell>
                    <TableCell align="right">Dose 2</TableCell>
                    <TableCell align="right">Capacity</TableCell>
                    <TableCell align="right">Vaccine</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.sessions.map((sessionsRow) => (
                    !!sessionsRow.available_capacity && <TableRow key={sessionsRow.date}>
                      <TableCell component="th" scope="row">
                        {sessionsRow.date}
                      </TableCell>
                      <TableCell align="right">{sessionsRow.min_age_limit}</TableCell>
                      <TableCell align="right">{sessionsRow.available_capacity_dose1}</TableCell>
                      <TableCell align="right">{sessionsRow.available_capacity_dose2}</TableCell>
                      <TableCell align="right">{sessionsRow.available_capacity}</TableCell>
                      <TableCell align="right">{sessionsRow.vaccine}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    block_name: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    fee_type: PropTypes.string.isRequired,
    total_capacity: PropTypes.number.isRequired,
    sessions: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        min_age_limit: PropTypes.string.isRequired,
        available_capacity_dose1: PropTypes.number.isRequired,
        available_capacity_dose2: PropTypes.number.isRequired,
        available_capacity: PropTypes.number.isRequired,
        vaccine: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default function CollapsibleTable(props) {
  const classes = useRowStyles();
  const [centerList,setCenterList]= React.useState([]);
  const [errText, setErrText]=React.useState('');
  const {district} = props;
  
  const [isAvailable, setIsAvailable]=React.useState('');
  useEffect( () =>{
    getTable();
    async function getTable(){
      try{
        let filteredData= [];
        setErrText("Please wait...");
        const date = moment().utc().utcOffset("+05:30").format('DD-MM-YYYY');
        const urlCenter = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${district}&date=${date}`;
        const response = await fetch(urlCenter,{
          headers: {
          "Content-Type": "application/json",
      }});
       const resJSON = await response.json();
       const centers = resJSON.centers;
        centers.map(
          function(item){
            var isCapacity = true;
              item.sessions.map((sess)=>{
                if(sess.available_capacity!=0){
                  isCapacity=false;
                }
              })
             if(!isCapacity){
                filteredData.push(item)
                isCapacity=true;
             }
          }
      ) 
      setErrText("Last updated : "+date+ " " + moment().utc().utcOffset("+05:30").format("h:mm:ss a"));
      if(filteredData.length === 0){
        setIsAvailable("No data available.");
        setCenterList([]);
      }else{
      setCenterList(filteredData);
      setIsAvailable("");
    }
    
      } catch(e) {
        setErrText("ERROR : Try again after sometime");
    }
  }
  const intervalID = setInterval(getTable,10000);
  return () => clearInterval(intervalID);
},[district]);


  return (
    <>
  <Typography className={classes.root} color="textSecondary">
      <h5>{errText} <br/> Auto refresh every 10 seconds </h5>
    </Typography>
    
    <TableContainer>
<Paper style={{ overflowX: "auto" }}>
      <Table >
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Block Name</TableCell>
            <TableCell>Center Name</TableCell>
            <TableCell align="right">From</TableCell>
            <TableCell align="right">To</TableCell>
            <TableCell align="center">Fee Type</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {centerList.map((row) => (
                <Row key={row.name} row={row} />
           ))}
        </TableBody>
        <caption>{isAvailable}</caption>
      </Table>
      </Paper>
    </TableContainer>
            </>
  );
}


