import { BrowserRouter, Routes, Route } from "react-router"
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Header from './components/Header';

function App() {
  <BrowserRouter>
    <Header/>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="about" element={<About />} />
    </Routes>
  </BrowserRouter>
}

export default App
