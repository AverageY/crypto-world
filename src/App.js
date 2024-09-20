import Sidebar from "./Components/Sidebar/Sidebar";
import LandingPage from "./Components/Landing_Page/Landing_Page";
import GoogleLogin from "./Components/Login/Login";
import KnowMore from "./Components/KnowMore/KnowMore";
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <div className="App">
    <Routes>
    <Route path="/" element ={<LandingPage/>}></Route>
    <Route path="/dashboard" element={<Sidebar/>}></Route> 
    <Route path="/knowmore" element={<KnowMore/>}></Route>
    </Routes>
      
    </div>
    </BrowserRouter>
  );
}

export default App;
