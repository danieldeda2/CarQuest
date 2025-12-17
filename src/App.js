import './App.css';
import Home from './Components/Home';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Login from './Components/Login';
import ForgotUserPass from './Components/ForgotUserPass';
import CreateAccount from './Components/CreateAccount';
import MainPage from './Components/MainPage';
import Capture from './Components/Capture';
import Garage from './Components/Garage';
import Leaderboard from './Components/Leaderboard';
import About from './Components/About';
import Settings from './Components/Settings';
import Quests from './Components/Quests';
import Support from './Components/Support';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/retrieveLogin' element={<ForgotUserPass/>}/>
      <Route path='/createAccount' element={<CreateAccount/>}/>
      <Route path='/mainPage' element={<MainPage/>}/>
      <Route path='/capture' element={<Capture/>}/>
      <Route path='/myGarage' element={<Garage/>}/>
      <Route path="/leaderboard" element={<Leaderboard/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/settings" element={<Settings/>}/>
      <Route path="/quests" element={<Quests/>}/>
      <Route path="/support" element={<Support/>}/>
      </Routes>
      </BrowserRouter>

      
    </div>
  );
}

export default App;
