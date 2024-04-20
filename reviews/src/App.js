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
          <Route path="/predict" element={<Prediction />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
