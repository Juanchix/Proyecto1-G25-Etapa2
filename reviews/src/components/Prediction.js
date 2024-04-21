import React from 'react';
import { Card } from "flowbite-react";
import { useLocation } from "react-router-dom";
import '../styles/Prediction.css';

function Prediction(){
    const location = useLocation();

    console.log(location);

    const state = location.state;

    console.log(state);

    const ps = state.precision;
    const re = state.recall;
    const f1score = state.f1

    return (
        <div className='PaginaPrediction'>
            <h1 id="unTitulo">Resultados del Modelo</h1>
            <p>El archivo fue procesado exitósamente</p>
            <Card className='carta'>
                <h2 className="titulo">Resultados</h2>
                <p className="resultados">Estos son las métricas de desempeño asociadas a la predicción realizada por el modelo:</p>
                <p className="metricas">Precision: {ps}%</p>
                <p className="metricas">Recall: {re}%</p>
                <p className="metricas">F1: {f1score}%</p>
            </Card>
            <a href="http://localhost:8000/download"><button className='descarga'>Descargar archivo</button></a>
        </div>
    );
}

export default Prediction;
