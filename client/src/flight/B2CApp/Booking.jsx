import React, { useEffect, useState } from "react";
import { redirect, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSuitcaseRolling, faUser} from "@fortawesome/free-solid-svg-icons"



const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state;
  const searchData = JSON.parse(params.resultToken);


  const [travelerPricings, setTravelerPricings] = useState([]);
  const [segments, setSegments] = useState([]);
  const [prices, setPrices] = useState([]);
  const [result, setResult] = useState([]);

  useEffect(()=>{
    const fatchData = async () =>{
      const response = await axios.post(
        "http://localhost:8001/flight/booking", searchData
      );
      setSegments(response.data.itineraries[0].segments);
      setPrices(response.data.price)
      setTravelerPricings(response.data.travelerPricings);
      setResult(response.data)
    };
    fatchData();
  }, []);

  const INR = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const offerPriceData = result.resultData;
    const formDataItt = new FormData(e.target);
    const formData = {};
    for (const field of formDataItt.entries()) {
      if(field[0].endsWith('[]'))
      {
        if( field[0] in formData){
          if(Array.isArray(formData[field[0]])){
            formData[field[0]].push(field[1]);
          } else {
            formData[field[0]] = [field[1]];
          }
        } else {
          formData[field[0]] = [field[1]];
        }
      }  else {
        formData[field[0]] = field[1];
      }
    }

    navigate("/flight/payment", { state: {formData, offerPriceData} });
  };
 
  return (
    <div>
      <div className=" w-[80%] m-auto px-3  ">
        <div className=" font-bold text-2xl py-4">Review your booking</div>
      </div>
        <div className="flex gap-6 px-3 w-[80%] m-auto ">
          <div className=" relative flex-1 pt-2 px-5 pb-5 rounded-lg border border-slate-500 border-solid shadow-lg">
            <div className=" absolute left-0 top-2 bg-slate-600 w-2 h-7 flex"></div>
            <div>
              <div className=" font-bold text-xl">New Delhi - Bengaluru</div>
              <div className=" text-slate-600 pb-5"> Stop {segments.length}| All Departure/arrival timers are in local time</div>
            </div>
              {
                segments.map((segment)=>{

                  function formatDate(dateString) {
                    const date = new Date(dateString);
                    const options = {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      weekday: 'short',
                    };
                  
                    return new Intl.DateTimeFormat('en-US', options).format(date);
                  }

                  const timeFormat = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: false,
                  });

                  // fot origin time

                  const originTime = `${segment.originTime}`;
                  const originDate = new Date(originTime);
                  const originLocalTime = timeFormat.format(originDate);

                  // for destination time
                  const destinationTime = `${segment.destinationTime}`;
                  const destinationDate = new Date(destinationTime);

                  const destinationLocalTime = timeFormat.format(destinationDate);

                  return (
                    <div className=" border rounded-lg border-solid border-slate-400 px-5 pb-3  mb-3" key={segment.id}>
                      <div className=" flex  justify-between py-2 font-medium text-slate-600">
                        <div>Indigo | {segment.operatorCode} {segment.flightNumber}</div>
                        <div>{segment.class}</div>
                      </div>
                      <div className=" flex justify-between pb-3">
                        <div className=" bg-slate-300 rounded-sm px-1">Start on - <span className=" font-semibold">{formatDate(originTime)}</span></div>
                        <div className=" bg-slate-300 rounded-sm px-1">Arrival on - <span className=" font-semibold">{formatDate(destinationTime)}</span></div>
                      </div>
                      <div className=" relative  ">
                        <div className=" flex">
                          {/* <div className=" absolute  bottom-1.5 left-20 font-extrabold ">.</div> */}
                          <div className=" absolute  bottom-4 left-20 border-b border-dashed border-slate-500 w-[34%] "></div>
                          <div className=" absolute  bottom-4 right-20 border-b border-dashed border-slate-500 w-[34%] "></div>
                          <div className=" absolute   top-0.5 right-16 font-bold">{">"}</div>
                        </div>
                        <div className=" flex justify-between">
                          <div className=" font-bold text-2xl  pr-2">{originLocalTime}</div>
                          <div className=" font-semibold">{segment.duration}</div>
                          <div className=" font-bold text-2xl  pl-2">{destinationLocalTime}</div>
                        </div>
          
                      </div>
                      <div className=" flex justify-between pt-1.5">
                        <div className=" font-semibold text-lg">{segment.originCode}</div>
                        <div className=" text-slate-500">Duration</div>
                        <div className=" font-semibold text-lg">{segment.destinationCode}</div>
                      </div>
                      <div className=" flex justify-between font-semibold">
                        <div>New Delhi</div>
                        <div>Bengaluru</div>
                      </div>
                      <div className=" flex justify-between text-slate-500">
                        <div>Indira Gandhi International Airport, India</div>
                        <div>Kempegowda International Airport, India</div>
                      </div>
                      <div className=" flex justify-between text-cyan-500 font-semibold border-b border-solid border-slate-400 pb-5">
                        <div>Terminal {segment.originTerminal}</div>
                        <div>Terminal {segment.destinationTerminal}</div>
                      </div>
                      <div className=" pb-2 flex justify-between">
                        <div className="flex gap-4">
                          <div className=" pt-3"><span className=" text-slate-500">Baggage -</span> <FontAwesomeIcon icon={faSuitcaseRolling} /> 7 Kgs (1 piece only) <span className=" text-slate-500">Cabin</span></div>
                          <div className=" relative pt-3 flex">
                            <div className=" absolute top-4">
                              <svg width="1.6rem" height="1.6rem" fill="none" xmlns="http://www.w3.org/2000/svg" className="Cabin__CabinIcon-sc-1da560d-0 hsAnyH marginL16"><path fillRule="evenodd" clipRule="evenodd" d="M6.388 5.625a.28.28 0 01-.174-.062c-.31-.246-3.034-2.455-3.034-4C3.18 0 5.837 0 6.97 0c1.135 0 3.792 0 3.792 1.563 0 1.544-2.724 3.754-3.035 4a.28.28 0 01-.173.062H6.388zm5.622.28a.276.276 0 00-.313.04.327.327 0 00-.098.32c.144.593.214 1.2.214 1.861l.002.563c.007 1.177.015 3.267-.25 4.544a.323.323 0 00.125.329.276.276 0 00.33-.007c.645-.496.96-.944.96-1.368V7.814c0-.929-.327-1.57-.97-1.907zM2.127 8.689l.003-.563c0-.66.07-1.268.213-1.86a.325.325 0 00-.098-.32.278.278 0 00-.313-.04c-.642.338-.97.98-.97 1.907v4.375c0 .424.315.872.96 1.368a.276.276 0 00.33.007c.102-.071.151-.202.125-.329-.265-1.277-.257-3.367-.25-4.545zm.745-3.954c.226-.539.376-.929.41-1.417a.33.33 0 00-.044-.19L3.19 3.05l-.013-.021c-.016-.027-.032-.053-.046-.08a.29.29 0 00-.28-.155.296.296 0 00-.248.207 9.344 9.344 0 00-.413 1.87.312.312 0 00.212.34.277.277 0 00.078.012c.113 0 .22-.071.267-.187l.124-.302zm8.465-1.732c.197.589.335 1.216.412 1.864a.314.314 0 01-.211.34.284.284 0 01-.079.012.292.292 0 01-.267-.186l-.122-.297c-.226-.54-.376-.93-.41-1.418a.328.328 0 01.043-.19l.107-.177a.293.293 0 01.279-.154c.114.012.21.092.248.207zm.01 5.123c0-1.478-.368-2.359-.692-3.135l-.001-.002c-.081-.193-.16-.38-.23-.572a.298.298 0 00-.215-.193.281.281 0 00-.268.092 15.365 15.365 0 01-1.866 1.75.867.867 0 01-.228.127v1.365c.338.13.338.442-.001.57 0 0-.131.058-.292.058H6.386c-.16 0-.292-.057-.292-.057-.337-.13-.337-.442.002-.571V6.192a.874.874 0 01-.23-.126c-.4-.319-1.173-.968-1.865-1.751a.285.285 0 00-.268-.092.3.3 0 00-.216.193c-.066.182-.14.36-.216.542l-.012.03-.001.002c-.324.776-.692 1.657-.692 3.135l-.002.568c-.012 1.994-.026 4.475 1.063 5.648.406.437.932.659 1.564.659h3.5c.633 0 1.159-.222 1.565-.659 1.089-1.173 1.074-3.654 1.063-5.648l-.003-.568zM7.263 6.25H6.68V7.5h.584V6.25z" fill="#222"></path></svg>
                            </div>
                          <div className=" pl-4">15 Kgs (1 piece only) <span className=" text-slate-500">Check-In</span></div>
                          </div>
                        </div>
                        <div>
                          <div className=" pt-3"><button className=" text-blue-600">View Baggage Details</button></div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
          </div>
          <div className=" w-[30%]  h-fit  rounded-lg border border-solid border-slate-500" >
            <div className=" px-5 pt-2 pb-3 border-b border-solid border-slate-400">
              <div className=" font-bold text-lg">FARE SUMMARY</div>
              <div className=" text-slate-500 text-xs">{travelerPricings.length} ADULTS</div>
            </div>
            <div className=" px-5 ">
              <div className=" flex justify-between pt-2 pb-1">
                <div>Base fare</div>
                <div className=" font-bold">{INR.format(prices.base).replace(/\.\d{2}$/, "")}</div>
              </div>
              <div className=" flex justify-between pl-2 pb-2 border-b border-solid border-slate-400 text-slate-500 text-xs ">
                <div className=" ">Adult ({travelerPricings.length} x {INR.format((prices.base)/travelerPricings.length).replace(/\.\d{2}$/, "")})</div>
                <div className=" font-semibold">{INR.format((prices.base)).replace(/\.\d{2}$/, "")}</div>
              </div>
            </div>
            <div className=" flex justify-between pl-5 pr-5 py-3">
              <div>Taxes and Surcharges</div>
              <div className=" font-bold">{INR.format(prices.grandTotal-prices.base).replace(/\.\d{2}$/, "")}</div>
            </div>
            <div className=" border-t border-solid border-slate-400 flex justify-between px-5 py-3 text-blue-600 ">
              <div className=" text-base font-bold">Grand Total</div>
              <div className=" text-xl font-bold">{INR.format(prices.total).replace(/\.\d{2}$/, "")}</div>
              
            </div>
          </div>
        </div>
      <div className=" w-[80%] flex m-auto px-3 gap-6 mt-5" >
        <div className=" rounded-lg border flex-1 border-slate-500 border-solid shadow-lg">
          <div className=" px-5  border-b border-slate-500 border-solid py-2 font-bold text-lg">TRAVELLER DETAILS</div>
          <div className=" ">
            <div className=" py-3 px-5"><span className=" font-semibold">Note </span>: Please make sure you enter the Name as per your govt. photo id.</div>
            <form onSubmit={handleSubmit}>
              {
                travelerPricings.map((travelerPricing, index)=>{
                  return (
                    <div className="  mx-5 rounded-lg  border border-slate-500 border-solid py-2 mb-3" key={index}>
                      <div className=" px-5 font-semibold"><FontAwesomeIcon icon={faUser}  className=" h-6 pr-4"/><span className=" align-top">{travelerPricing.travelerType} {travelerPricing.travelerId}</span></div>
                      <div className=" flex justify-around pt-1 pb-3 gap-3">
                        {/* <div className=" py-2 "></div> */}
                        <div><span className=" pr-2 font-semibold">Name : </span><input  name="firstName[]" id="firstName" placeholder="First & Middle Name" type="text" className=" px-3 py-2 outline-blue-600 rounded-md bg-slate-50" /></div>
                        <div><input placeholder="Last Name" type="text" name="lastName[]" id="lastName" className=" px-3 py-2 outline-blue-600 rounded-md bg-slate-50" /></div>
                        <div>
                          <select name="gender[]" id="gender" className="mb-2 px-3 py-2 outline-blue-600 rounded-md bg-slate-50">
                            <option defaultValue={"Gender"}>Gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                          </select>
                          <div><input placeholder="Date of Birth" name="dateOfBirth[]" id="dateOfBirth" type="date" className=" px-3 py-2 outline-blue-600 rounded-md bg-slate-50" /></div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
              <div className=" px-5 pb-2">
                <div className=" mb-3"><span className=" font-semibold pr-5">Email Address </span><input type="email" name="email" id="emailAddress" placeholder="Email" className=" px-3 py-2 outline-blue-600 rounded-md bg-slate-50" /><span className=" pl-4">Your ticket will be sent to this email address</span></div>
                <div className=" mb-3"><span className=" font-semibold pr-2">Mobile Number </span><input type="mobile" name="mobile" id="phoneNumber" placeholder="Phone" className=" px-3 py-2 outline-blue-600 rounded-md bg-slate-50" /></div>
                {/* <div><span className=" font-semibold pr-16 align-top">Address </span><textarea type="phone" name="phone" id="phone" placeholder="Address" cols={22} className=" px-3 py-2 outline-blue-600 rounded-md bg-slate-50"/></div> */}
              </div>
              <div>
                <input type="hidden" name="resultData" value={setResult.resultData} />
                <div className="border-t border-slate-500 border-solid">
                  <button type="submit" className=" float-right px-10 rounded  text-white font-semibold py-1 bg-blue-600 mr-5 mb-2 mt-2">Proceed</button>
                </div>
              </div>
            </form>

          </div>
        </div>
        <div className=" w-[30%]"></div>
      </div>
    </div>
  );
};

export default Booking;
