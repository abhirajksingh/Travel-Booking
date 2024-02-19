import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchResults from "./flight/B2CApp/SearchResults";
import B2CApp from "./flight/B2CApp/B2CApp";
import Booking from "./flight/B2CApp/Booking";
import Payment from "./flight/B2CApp/Payment";
import ProcessBooking from "./flight/B2CApp/ProcessBooking";
// import Temp from "./Temp";
import BookingStatus from "./flight/B2CApp/BookingStatus";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<B2CApp />} />
          <Route path="/flight/search_results/" element={<SearchResults />} />
          <Route path="/flight/booking/" element={<Booking />} />
          <Route path="/flight/payment/" element={<Payment />} />
          <Route path="/flight/processbooking/" element={<ProcessBooking />} />
          {/* <Route path="/flight/temp" element={<Temp />} /> */}
          <Route path="/flight/bookingstatus" element={<BookingStatus />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
