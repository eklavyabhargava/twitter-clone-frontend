import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import AuthRoutes from './routes/authRoute';

function App() {

  // api url
  const API_URL = "https://electric-blue-pelican-suit.cyclic.app";

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login API_URL={API_URL}  />} />
        <Route path='/register' element={<Register API_URL={API_URL} />} />
        <Route path='/*' element={<AuthRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
