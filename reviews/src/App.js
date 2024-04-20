import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import File from './components/File';
import Prediction from './components/Prediction';


function App() {

  return (
    <div className="Pagina">
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<File />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
