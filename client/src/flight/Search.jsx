import React, {useState} from "react";
import { useNavigate } from "react-router-dom";


function Search() {
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("oneway");

  const handleTripTypeChange = (e) => {
    const selectedTripType = e.target.value;
    setTripType(selectedTripType);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataItt = new FormData(e.target);
    const formData = {};
    const travaler = [];
    for (const field of formDataItt.entries()) {
      const [name, value] = field;
      if (name === "adult" || name === "child" || name === "infant") {
        travaler.push({
          name: name,
          value: value,
        });
      } else{
        formData[field[0]] = field[1];
      }
      formData.travalers = travaler
    }
    navigate("/flight/search_results", { state: formData });
  };


  return (
    <div className=" pl-4">
      <div className="box-shadow  mt-9 items-center pt-4  bg-gray-600 width-height  p-10 ml-60 mr-60   border-gray-600 rounded-3xl absolute top-24">
        {/* <h2 className=" pb-4 text-center text-3xl font-bold text-teal-300">
          Domestic and International Flights
        </h2> */}
        <form onSubmit={handleSubmit}>
          <div className="pl-2 pt-8 pr-4 pb-4 flex space-x-4">
            <div className="form-group flex justify-evenly md:justify-start mb-6">
              <div className="flex items-center pl-4 px-6 ">
                <input
                  type="radio"
                  id="triptype-oneway"
                  value="oneway"
                  name="triptype"
                  className="hidden peer"
                  defaultChecked
                  onClick={handleTripTypeChange}
                />
                <label
                  htmlFor="triptype-oneway"
                  className="box-shadow button-color color-change w-full p-2 px-4 text-lg md:text-xl font-medium rounded-lg md:rounded-md text-domaincolor bg-slate-100 peer-checked:bg-domaincolor peer-checked:text-white cursor-pointer"
                >
                  One-way
                </label>
              </div>
              <div className="flex items-center pl-4 px-6 ">
                <input
                  type="radio"
                  id="triptype-round"
                  value="round"
                  name="triptype"
                  className="hidden peer"
                  onClick={handleTripTypeChange}
                />
                <label
                  htmlFor="triptype-round"
                  className="box-shadow w-full p-2 px-4 text-lg md:text-xl font-medium rounded-lg md:rounded-md text-domaincolor bg-slate-100 peer-checked:bg-domaincolor peer-checked:text-white cursor-pointer"
                >
                  Round-trip
                </label>
              </div>
              <div className=" items-center pl-4 px-6 hidden md:flex">
                <input
                  type="radio"
                  id="triptype-multi"
                  value="multi"
                  name="triptype"
                  className="hidden peer"
                  onClick={handleTripTypeChange}
                />
                <label
                  htmlFor="triptype-multi"
                  className="box-shadow w-full p-2 px-4 text-lg md:text-xl font-medium rounded-lg md:rounded-md text-domaincolor bg-slate-100 peer-checked:bg-domaincolor peer-checked:text-white cursor-pointer"
                >
                  Multi-city
                </label>
              </div>
            </div>
          </div>
          <div className="container-grid model-search relative ">
            <div>
              <input
                required
                className=" w-56 p-4    rounded-md outline-blue-600"
                type="text"
                name="originLocationCode"
                id="01"
                placeholder="Source City"
              />
            </div>
            <div>
              <input
                required
                className=" w-56 p-4    rounded-md outline-blue-600"
                type="text"
                name="destinationLocationCode"
                id="02"
                placeholder="Destination City"
              />
            </div>
            <div>
              <input
                required 
                type="date"
                name="date"
                id="03"
                placeholder="Departure Date"
                className=" w-56 p-4    rounded-md outline-blue-600"
              />
            </div>

            <div>
              <input
                required
                disabled={tripType === "round" ? "" : "disabled"}
                type="date"
                name="Return-Date"
                id="04"
                placeholder="Return Date"
                className=" w-56 p-4    rounded-md outline-blue-600"
              />
            </div>
            <div>
              <input  placeholder="Adult" type="number" name="adult" className=" w-full p-4  outline-blue-600  rounded-md"/>
            </div>
            <div>
              <input  placeholder="Child" type="number" name="child" className=" w-full p-4  outline-blue-600  rounded-md"/>
            </div>
            <div>
              <input  placeholder="Infant" type="number" name="infant" className=" w-full p-4  outline-blue-600  rounded-md"/>
            </div>
            <div className=" absolute top-44 left-96">
              <button
                type="submit"
                className=" rounded-full box-shadow  px-5 py-3 bg-orange-300 outline-blue-600"
              >
                SEARCH FLIGHTS
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Search;
