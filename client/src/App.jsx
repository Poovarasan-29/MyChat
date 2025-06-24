import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/home/Home';
import SignUp from './components/signUp/SignUp';
import SignIn from './components/signIn/SignIn';

function App() {
  return <BrowserRouter>
    <Routes>
      <Route path='/' element={<SignUp />} />
      <Route path='/sign-in' element={<SignIn />} />
      <Route path='/mychat' element={<Home />} />
    </Routes>
  </BrowserRouter>

}

export default App;
