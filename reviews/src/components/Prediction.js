import { Card } from "flowbite-react";
import "../styles/Prediction.css"
import { useLocation } from "react-router-dom";

function Prediction(){
    const location = useLocation();
    const { precision, recall, f1 } = location.state;
    return (
        <div className='PaginaPrediction'>
            <h1 id="unTitulo">Resultados del Modelo</h1>
            <p>El archivo fue procesado exitósamente</p>
            <Card className='carta'>
                <h2 className="titulo">Resultados</h2>
                <p className="resultados">Estos son las métricas de desempeño asociadas a la predicción realizada por el modelo:</p>
                <p className="metricas">Precision: {precision}%</p>
                <p className="metricas">Recall: {recall}%</p>
                <p className="metricas">F1: {f1}%</p>
            </Card>
            <a href="http://localhost:8000/download"><button className='descarga'>Descargar archivo</button></a>
        </div>
    );
}

export default Prediction;