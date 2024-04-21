import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/File.css';

function File() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [precision, setPrecision] = useState(null); // Initialize as null
    const [recall, setRecall] = useState(null); // Initialize as null
    const [f1, setF1] = useState(null); // Initialize as null
    const [predictionReady, setPredictionReady] = useState(false); // New state variable
    const navigate = useNavigate();

    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsUploaded(true);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsClicked(true);
      
      const formData = new FormData();
      formData.append('file', selectedFile);
    
      try {
        const response = await axios.post("http://localhost:8000/upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        const ps = (Number(response.data.ps) * 100).toFixed(2);
        const rs = (Number(response.data.rs) * 100).toFixed(2);
        const f1 = (Number(response.data.f1) * 100).toFixed(2);

        setPrecision(ps);
        setRecall(rs);
        setF1(f1);
        setPredictionReady(true);

        console.log('Precision:', ps, '%');
        console.log('Recall:', rs, '%');
        console.log('F1:', f1, '%');
        

      } catch (error) {
        console.error('Error occurred:', error);
      }
    };

    const handleClick = () => {
      navigate('/prediction', { state: { precision, recall, f1}});
    };
   
    return (
        <div className="Pagina">
          <h1 id="unTitulo">Modelo de Clasificación</h1>
          <p>Este es un modelo de clasificación basado en regresión logística. Este modelo permite que para una reseña se pueda predecir una calificación de 1 a 5. Lo anterior es posible gracias al entrenamiento previo del modelo. Primero es necesario subir un archivo CSV con :</p>

          <form className="formulario" onSubmit={handleSubmit}>
              <input type="file" id="file" name="file" accept=".csv" onChange={handleFileChange}></input>
              <button disabled={!isUploaded} type='submit'>Agregar</button>
          </form>
          {/* Conditionally render the Link only when predictionReady is true */}
          {predictionReady && <button onClick={handleClick} className='prediccion'>Clasificar</button>}         
          <br></br>
          <p className='advertencia'>Es necesario subir un archivo antes de proceder</p>
        </div>
    );
}

export default File;
