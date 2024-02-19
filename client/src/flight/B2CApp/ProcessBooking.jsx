import React, {useEffect, useState} from 'react'
import {  useLocation, useNavigate } from "react-router-dom";
import axios from "axios"


function ProcessBooking() {
  const location = useLocation();
  const nevigate = useNavigate();
  const urlParams = new URLSearchParams(location.search);
  const transactionId = urlParams.get('transactionId');

  const [apiCalled, setApiCalled] = useState(false);
  useEffect(()=>{
    if(apiCalled === false){
      setApiCalled(true);
      const fatchData = async () =>{
        const response = await axios.post(
          "http://localhost:8001/flight/processbooking", ({transactionId})
        );
        console.log(response)
        
        nevigate("/flight/bookingstatus", ({state : transactionId}))
      };
      fatchData();
    }
  }, []);

  return (
    <div>
      ProcessBooking
    </div>

  )
}

export default ProcessBooking;