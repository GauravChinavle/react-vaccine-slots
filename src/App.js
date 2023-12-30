import React, { useState, useEffect } from 'react';
import { Container, Box, Link } from '@material-ui/core';
import { BrowserRouter as Router } from "react-router-dom";
import GetState from './components/GetList';
import Copyright from "./components/Copyright";
import './App.scss'


export default function App() {
  const [stateList, setStateList] = useState([]);
  useEffect(() => {
    async function fetchStateList() {
      try {
        const urlState = 'https://cdn-api.co-vin.in/api/v2/admin/location/states';
        const response = await fetch(urlState, {
          headers: {
            "Content-Type": "application/json",
          }
        });
        const resJSON = await response.json();
        const states = resJSON.states;
        setStateList(states);
      } catch {

      }
    }
    fetchStateList();
  }, []);

  return (
    <Router>
      <Container maxWidth="'lg'
                  | 'md'
                  | 'sm'
                  | 'xl'
                  | 'xs'">
        APIs have ceased to function following the activation of CORS @{
          <Link color="inherit" href="http://www.gauravchinavle.dev">
              api.setu
            </Link>
            }
              <Box my={4}>
          <GetState stateList={stateList} />
          <Copyright />
        </Box>
      </Container>
    </Router>
  );
}
