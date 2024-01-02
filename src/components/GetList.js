import React, { useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { InputLabel, MenuItem, FormControl, Select } from "@material-ui/core";
import PropTypes from "prop-types";
import CollapsibleTable from './Table';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));



GetState.PropTypes = {
  stateList: PropTypes.array,
};
GetState.defaultProps = {
  stateList: [],
};

GetDistrict.PropTypes = {
  distList: PropTypes.array,
  id: PropTypes.number,
};
GetDistrict.defaultProps = {
  distList: [],
  id: '',
};

export default function GetState(props) {
  const classes = useStyles();
  const [state, setState] = React.useState("");
  const { stateList } = props;
  const handleChangeState = (event) => {
    setState(event.target.value);
  };

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">State</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={state}
          onChange={handleChangeState}
          label="state"
        >{
            stateList.map(item => (
              <MenuItem value={item.state_id}>{item.state_name}</MenuItem>

            ))}
        </Select>
      </FormControl>
      {state && <GetDistrict state={state} />}
    </>
  );
}


function GetDistrict(props) {
  const classes = useStyles();
  const [district, setDistrict] = React.useState();
  const [distList, setDistList] = React.useState([]);
  const { state } = props;
  useEffect(() => {
    async function fetchDistList() {
      try {
        const urlDist = `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${state}`;
        const response = await fetch(urlDist, {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET"
        });
        const resJSON = await response.json();
        const districts = resJSON.districts;
        setDistList(districts)
      } catch (e) {
        setDistList([{ district_id: 392, district_name: "Thane" }])
        console.log(e);
      }


    }
    fetchDistList();
  }, [state]);

  const handleChangeDistrict = (event) => {
    setDistrict(event.target.value);
  };

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel id="demo-simple-select-outlined-label">District</InputLabel>
        <Select
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={district}
          onChange={handleChangeDistrict}
          label="District"
        >
          {
            distList.map(item => (
              <MenuItem value={item.district_id}>{item.district_name}</MenuItem>
            ))}
        </Select>
      </FormControl>
      {district && <CollapsibleTable district={district} />}

    </>
  );
}
