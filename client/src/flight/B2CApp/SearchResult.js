import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "../Search";
import Models from "../Models.js";
import "./SearchResult.css";
import { useLocation, useNavigate } from "react-router-dom";

function SearchResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = location.state;

  const [openModel, setOpenModel] = useState(false);

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fatchData = async () => {
      const response = await axios.post(
        "http://localhost:8001/flight/search_results",
        searchParams
      );
      setSearchResults(response.data);
    };
    fatchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataItt = new FormData(e.target);
    const formData = {};
    for (const field of formDataItt.entries()) {
      formData[field[0]] = field[1];
    }
    navigate("/flight/booking", { state: formData });
  };

  return (
    <div className="m-2 mt-10 relative top-20 pb-5">
      <div className="md:flex md:justify-between md:mx-4  bg-gray-600 py-3 shadow-xl rounded-xl">
        <div className="md:basis-10/12 search-params flex justify-around md:items-center font-semibold text-white text-xs md:text-lg text-center">
          <div className="text-center md:text-start">
            <div className="mb-2 font-extrabold">One Way Trip</div>
            <div className="md:grid md:grid-flow-col md:gap-1">
              <div>Delhi (DEL)</div>
              <div>to</div>
              <div>Bangalore (BLR)</div>
            </div>
          </div>
          <div className="text-center">
            <div>Departure</div>
            <div>Dec 9, 2023</div>
          </div>
          <div className="text-center">
            <div>Return</div>
            <div>Dec 9, 2023</div>
          </div>
          <div className="text-center">
            <div>Adults</div>
            <div>1</div>
          </div>
          <div className="text-center">
            <div>Children</div>
            <div>0</div>
          </div>
          <div className="text-center">
            <div>Infants</div>
            <div>0</div>
          </div>
        </div>
        <div className="flex justify-end p-1 w-full md:w-auto h-0 md:h-auto pr-12">
          <button
            className="modal hidden box-shadow w-max h-fit -mt-8 md:m-auto md:w-auto md:block bg-white text-domaincolor text-xs md:text-lg font-semibold p-2 md:px-4 rounded-lg"
            onClick={() => setOpenModel(true)}
          >
            Modify Search
          </button>
          <Models open={openModel} />
        </div>
      </div>
      <div className="px-4 pt-4">
        <div className="pb-5">
          <div className="flex justify-around box-shadow-header  rounded-xl bg-gray-600 text-xl font-medium px-4 py-4 text-white">
            <div>Airline</div>
            <div>Departure</div>
            <div>Duration</div>
            <div>Arrival</div>
            <div>Price</div>
          </div>
        </div>
        {searchResults.map((searchResult, index) => {
          // fot origin time
          const originTime = `${searchResult.itineraries[0].summary.originTime}`;
          const originDate = new Date(originTime);
          const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
          };
          const originLocalDate = originDate.toLocaleDateString(
            "en-US",
            options
          );
          const originLocalTime = originDate.toLocaleTimeString();

          // for destination time
          const destinationTime = `${searchResult.itineraries[0].summary.destinationTime}`;
          const destinationDate = new Date(destinationTime);
          const destinationLocalDate = destinationDate.toLocaleDateString(
            "en-US",
            options
          );
          const destinationLocalTime = destinationDate.toLocaleTimeString();

          // currency format
          const totalFare = searchResult.itineraries[0].price.totalFare;
          const INR = new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
          });

          return (
            <div className="searchResult  mb-5 rounded-xl" key={index}>
              <div className="py-2 rounded-xl box-shadow-inner text-center">
                <div className="flex justify-around py-6 items-center ">
                  <div className=" w-[18%] pl-5">
                    <div>Hello</div>
                    <div className="text-base">Vistara</div>
                    <div className="text-base">{`(${searchResult.itineraries[0].summary.operatorCode}-${searchResult.itineraries[0].summary.flightNumber})`}</div>
                  </div>
                  <div className="w-[22%]">
                    {/* <div className="text-base">DEL, New Delhi, India</div> */}
                    <div className="text-base font-bold">{`${searchResult.itineraries[0].summary.originCode}, New Delhi, India`}</div>
                    <div className="font-bold">{originLocalTime}</div>
                    <div className="text-base">{originLocalDate}</div>
                  </div>
                  <div className="w-[17%]">
                    <div className="text-base font-bold">
                      {searchResult.itineraries[0].summary.duration}
                    </div>
                    <div className="m-auto w-6">
                      <svg
                        viewBox="0 0 24.00 24.00"
                        fill="none"
                        className="stroke-gray-700"
                      >
                        <g
                          strokeLinejoin="round"
                          stroke="#CCCCCC"
                          strokeWidth="4.8"
                        >
                          <path
                            d="M2 12.0701H22"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M16 5L21.16 10C21.4324 10.2571 21.6494 10.567 21.7977 10.9109C21.946 11.2548 22.0226 11.6255 22.0226 12C22.0226 12.3745 21.946 12.7452 21.7977 13.0891C21.6494 13.433 21.4324 13.7429 21.16 14L16 19"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                          ></path>
                        </g>
                        <g>
                          <path
                            d="M2 12.0701H22"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M16 5L21.16 10C21.4324 10.2571 21.6494 10.567 21.7977 10.9109C21.946 11.2548 22.0226 11.6255 22.0226 12C22.0226 12.3745 21.946 12.7452 21.7977 13.0891C21.6494 13.433 21.4324 13.7429 21.16 14L16 19"
                            strokeWidth="2.4"
                            strokeLinejoin="round"
                          ></path>
                        </g>
                      </svg>
                    </div>
                    <div>Stops:{searchResult.itineraries[0].summary.stops}</div>
                  </div>
                  <div className="w-[22%] pr-6">
                    {/* <div className="font-bold">BLR, Banglore, India</div> */}
                    <div className="font-bold">{`${searchResult.itineraries[0].summary.destinationCode}, Banglore, India`}</div>
                    <div className=" font-bold">{destinationLocalTime}</div>
                    <div>{destinationLocalDate}</div>
                  </div>
                  <div className="w-[15%]  pr-14">
                    <div className="font-bold text-base">
                      {INR.format(totalFare).replace(/\.\d{2}$/, "")}
                    </div>
                    <div className="pt-2">
                      <form onSubmit={handleSubmit}>
                        <input
                          type="hidden"
                          name="resultToken"
                          value={searchResult.itineraries[0].resultToken}
                        />
                        <button
                          type="submit"
                          className="box-shadow px-4 py-2 rounded-lg bg-slate-600 text-white font-bold outline-0"
                        >
                          Book Now
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="overlay hidden">{Search}</div>
    </div>
  );
}
export default SearchResult;
