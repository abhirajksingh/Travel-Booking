import React from 'react'

const response = {
  general: {
    pnr: "TGXDU7",
    bookDate: "2024-01-26T17:07:00.000",
    queuingOfficeId: "NCE4D31SB"
  },
  itineraries: [
    {
      stops: 1,
      operatorName: "",
      originCode: "BLR",
      originName: "",
      originTerminal: "2",
      originTime: "2024-02-20T15:00:00",
      destinationCode: "DEL",
      destinationName: "",
      destinationTerminal: "3",
      destinationTime: "2024-02-20T17:55:00",
      class: "ECONOMY",
      aircraftCode : "32Q",
      flightNumber : "218"
    }
  ],
  price: {
    currency: "INR",
    total: "7648.00",
    base: "6383.00",
    grandTotal: "7648.00"
  },
  travelers: [
    {
      id: "1",
      dateOfBirth: "2000-02-20",
      fName: "Abhiraj",
      lName: "kumar"
    },
    {
      id: "2",
      dateOfBirth: "2000-02-20",
      fName: "Abhiraj",
      lName: "kumar"
    }
  ]
}

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
  hour12: true,
});


const Temp = () => {
  return (
    <div>
      <div className=' w-[70%] m-auto pt-3'>
        <div className=' pb-3 border-b-2 border-solid border-gray-950'>
          <p>Payment Booking ID : <span className=' text-green-600'>{response.general.queuingOfficeId}</span></p>
          <p>Booked on : <span>{formatDate(new Date(response.general.bookDate))}, {timeFormat.format(new Date(response.general.bookDate))}</span></p>
        </div>
          <div className=' pt-3 flex justify-between text-xs'>
            <p>Onward Flight Details</p>
            <p>PNR</p>
          </div>

          {
            response.itineraries.map((itinerary, index)=>{

              // for origin time
              const originTime = `${itinerary.originTime}`;
              const originDate = new Date(originTime);
              const originLocalTime = timeFormat.format(originDate);

              // for destination time
              const destinationTime = `${itinerary.destinationTime}`
              const destinationDate = new Date(destinationTime);
              const destinationLocalTime = timeFormat.format(destinationDate);
              
              return(
                <div  key={index}>
                  <div className=' flex justify-between pb-3 font-medium'>
                    <p><span>{itinerary.originCode}</span> to <span>{itinerary.destinationCode}</span> | {formatDate(originDate)}</p>
                    <p>{response.general.pnr}</p>
                  </div>
                  <div className=' pr-4 flex  border-x rounded-lg border-t pb-3 pt-3 border-solid border-gray-700'>
                    <div className=' w-[18%] text-center border-r border-solid border-gray-400 font-medium text-sm'>
                      {/* <p>Jet Airways</p> */}
                      <p>{itinerary.aircraftCode}-{itinerary.flightNumber}</p>
                    </div>
                    <div className=' flex flex-1 justify-between pl-7'>
                      <div className=' w-[20%]  text-xs'>
                        <p className=' font-medium text-base'>{itinerary.originCode} <span >{originLocalTime}</span></p>
                        <p>{formatDate(originDate)}</p>
                        {/* <p>Kolkata, Netaji Subash Chandra Bose Airport</p> */}
                      </div>
                      <div className=' flex-1  text-center font-medium'>
                        <p>Stop-{itinerary.stops}</p>
                        <p>{itinerary.class}</p>
                      </div>
                      <div className=' w-[15%] text-xs'>
                        <p className=' float-right font-medium text-base' >{itinerary.destinationCode} <span>{destinationLocalTime}</span></p>
                        <p className=' float-right'>{formatDate(destinationDate)}</p>
                        {/* <p className=' float-right'>Aizawal, Lengpui Airport</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          }
          <div className=' flex w-full border-b rounded-lg border-solid border-gray-700 border-x pb-3 pt-3 pr-4'>
            <div className=' w-[22%] border-r border-solid border-gray-400 font-medium  text-center text-sm pt-4'>
              <p></p>
            </div>
            <div className=' w-full pl-7'>
              <div className=' flex justify-between font-medium'>
                <p>Traveller</p>
                <p>Ticket</p>
              </div>
              {
                response.travelers.map((traveler, index)=>{
                  return(
                    <div className='flex-1 justify-between' key={index}>
                      <p className=' pt-3 border-b border-solid border-gray-400 text-sm font-medium'>{traveler.fName.toUpperCase() + " "+ traveler.lName.toUpperCase()} <span className=' float-right'>{response.general.pnr}</span></p>
                    </div>
                  )
                })
              }
            </div>
          </div>

        <div className=' pt-8'>
          <p className=' font-semibold pb-2'>Important:</p>
          <ol className=' list-outside list-disc pl-10 pr-5 text-sm font-medium'>
            <li className=' pb-2'>Please carry your Government ID proof for all passengers to show during security check and check-in. Name on Government ID proof should same as your ticket</li>
            <li className=' pb-2'>We recommended you to reach airport 2 hrs before departure time. Airline check-in counters typically close 1 hr prior to departure time</li>
          </ol>
        </div>

        <div className=' pt-8'>
          <p className=' font-semibold pb-2'>Baggage Policy:</p>
          <div className=' flex text-sm  px-10 border-y border-t-2 border-solid border-gray-400'>
            <p className=' w-[35%] pt-3 pb-3  font-semibold border-r-2 border-solid border-gray-400'>Check-In Baggage(Adult & Child)</p>
            <p className=' pt-3 pb-3 pl-3'>15 KG/person</p>
          </div>
          <div className=' flex text-sm  px-10 border-y border-solid border-gray-400'>
            <p className=' w-[35%] pt-3 pb-3 font-semibold border-r-2 border-solid border-gray-400'>Cabin(Adult & Child)</p>
            <p className=' pt-3 pb-3 pl-3'>7 KG/person</p>
          </div>
          <div className=' flex text-sm  px-10 border-y border-b-2 border-solid border-gray-400'>
            <p className=' w-[35%] pt-3 pb-3 font-semibold border-r-2 border-solid border-gray-400'>Terms & Conditions</p>
            <div className=' flex-1 pl-3 pr-10 pt-3 pb-3'>
              <ul>
                <li className=' pb-3'>Please check with the airline on the dimensions of the baggage.</li>
                <li className=' pb-3'>The baggage policy is only indicative and can change any time. You are advised to check with the airline before travel to know latest baggage policy .</li>
                <li className=' pb-3'>You are advised to check with the airline for extra baggage charges.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className=' pt-8 pb-10'>
          <p className=' font-semibold pb-2'>Cancellation Policy:</p>
          <div className=' flex text-sm  px-10 border-y border-t-2 border-solid border-gray-400'>
            <p className=' w-[35%] pt-3 pb-3  font-semibold border-r-2 border-solid border-gray-400'>Airline Cancellation Charges</p>
            <p className=' pt-3 pb-3 pl-3'>As per airline policy Paytm doesn't charge any additional cancellation processing fee.</p>
          </div>
          <div className=' flex text-sm  px-10 border-y border-solid border-gray-400'>
            <p className=' w-[35%] pt-3 pb-3 font-semibold border-r-2 border-solid border-gray-400'>Direct cancellation with airline</p>
            <p className=' pt-3 pb-3 pl-3'>Post cancellation with airline, please contact Paytm customer care for refund</p>
          </div>
          <div className=' flex text-sm  px-10 border-y border-solid border-gray-400'>
            <p className=' w-[35%] pt-3 pb-3 font-semibold border-r-2 border-solid border-gray-400'>Booking modifications</p>
            <div className=' flex-1 pl-3 pt-3 pb-3'>
              <ul>
                <li>Date/Flight change is allowed upto 24 Hrs before departure as per airline policy.</li>
                <li>Contact our Paytm flights customer care-7053111905 for modifications. </li>
                <li>Most airlines don't allow name amendments.</li>
              </ul>
            </div>
          </div>
          <div className=' flex text-sm  px-10 border-y border-b-2 border-solid border-gray-400'>
            <p className=' w-[35%] pt-3 pb-3 font-semibold border-r-2 border-solid border-gray-400'>Terms & Conditions</p>
            <div className=' flex-1 pl-3 pt-3 pb-3'>
              <ul>
                <li className=' pb-3'>We accept cancellations, only before 24 Hrs from departure time.</li>
                <li className=' pb-3'>For cancellations, within 24 hours before departure you need to contact the airline. Post cancellation by airline, you can contact Paytm for refund, if any.</li>
                <li className=' pb-3'>Convenience fee is non-refundable. Any cashback availed will be adjusted in final refund amount.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Temp;
