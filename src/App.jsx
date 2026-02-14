import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import "./App.css";
import Home from "./Pages/Home";
import LoginPage from "./Pages/Login";
import RegisterPage from "./Pages/SignIn";
import About from "./Pages/About";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>

          <Route path="/About" element ={<About/>}/> 
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}


export default App;