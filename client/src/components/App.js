import { useAuth0 } from "@auth0/auth0-react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Header from "./Header";
import HomePage from "./HomePage";
import TripDetails from "./TripDetails";
import GlobalStyle from "./GlobalStyles";

const App = () => {

  const { loginWithPopup, logout, user, isAuthenticated } = useAuth0(); 

  return (
    <BrowserRouter>
      <GlobalStyle />
      <div>
          <Header loginWithPopup={loginWithPopup} logout={logout} isAuthenticated={isAuthenticated} user={user} />
          <Routes>
              <Route path="/" element={<HomePage /> } />
              <Route path="/:tripId" element={<TripDetails /> } /> 
          </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
