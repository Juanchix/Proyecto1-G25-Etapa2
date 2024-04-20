import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/File.css';
import axios from 'axios';

function Train() {
    // Estado para almacenar el archivo seleccionado
    const [selectedFile, setSelectedFile] = useState(null);
    const [isClicked, setIsClicked] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [prec, setPrec] = useState(0);
    const [recall, setRecall] = useState(0);
    const [f1, setF1] = useState(0);

  
    // Controlador de eventos para manejar la selección de archivos
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
      setIsUploaded(true);
    };
  
    // Función para manejar el envío del formulario

    const handleSubmit = async (event) => {
      event.preventDefault();
      setIsClicked(true);
      console.log(selectedFile)
      const formData = new FormData();
      formData.append('file', selectedFile);
    
      try {
        const { data } = await axios.post("http://localhost:8000/upload", formData, {
          headers: {
            Accept: "multipart/form-data",
            "Content-Type": "multipart/form-data",
          },
        });
        //console.log(data) 
        setPrec((Number(data.ps)*100).toFixed(2));
        setRecall((Number(data.rs)*100).toFixed(2));
        setF1((Number(data.f1)*100).toFixed(2));
      } catch (error) {
        // Handle any errors that might occur during the request
        console.error('Error occurred:', error);
      }
    };
   
    return (
        <div className="Pagina">
          <h1 id="unTitulo">Modelo de Clasificación</h1>
          <p>Este es un modelo de clasificación basado en regresión logística. Este modelo permite que para una reseña se pueda predecir una calificación de 1 a 5. Lo anterior es posible gracias al entrenamiento previo del modelo. Primero sube un archivo CSV con :</p>

          <form className="formulario" onSubmit={handleSubmit}>
              <input type="file" id="file" name="file" accept=".csv" onChange={handleFileChange}></input>
              <button disabled={!isUploaded} type='submit'>Agegar</button>
          </form>
          <Link to={'/prediccion'} state = {{precision:prec,recall:recall,f1:f1}}> <button disabled={!isClicked} className='prediccion'>Predicción</button></Link>
          <p className='advertencia'>Es necesario subir un archivo antes de proceder</p>
        </div>
    );

}

export default Train;