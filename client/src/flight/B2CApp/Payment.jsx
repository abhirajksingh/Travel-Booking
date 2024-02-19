import React, {useEffect, useState} from 'react'
import { useLocation } from "react-router-dom";
import axios from "axios"


function Payment() {
  const location = useLocation();
  const params = location.state;

  const travelerDetail = params.formData;   // traveler data
  const offerPriceData = params.offerPriceData;   // offerprice data
  const [apiCalled, setApiCalled] = useState(false);
  useEffect(()=>{
    if(apiCalled === false){
      setApiCalled(true);
      const fatchData = async () =>{
        const response = await axios.post(
          "http://localhost:8001/flight/payment", ({offerPriceData, travelerDetail})
        );
        let url = response.data
        window.location.href = url;
      };
      fatchData();
    }
  }, []);
  return (
    <div>
      hello
    </div>
  )
}

export default Payment;
