from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi import File, UploadFile
from sklearn.model_selection import train_test_split

from fastapi.middleware.cors import CORSMiddleware
from joblib import load
import pandas as pd
from sklearn.metrics import  precision_score, recall_score, f1_score
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/upload")
def read_item(file: UploadFile = File(...)):
    try:
       contents = file.file.read()
       with open("file.csv", "wb") as f:
           f.write(contents)
    except Exception:
       return {"message": "Error al subir el archivo"}
    finally:
       file.file.close()
    # procesar todo
    model = load("../Pipeline/pipeline.joblib")
    df = pd.read_csv("file.csv")
    y_test = df["Class"]
    result = model.best_estimator_.predict(df["Review"])
    df['ClassPrediction'] = result
    df.to_csv("file_predicted.csv", index=False)
    ps = precision_score(y_test, result, average="weighted")
    rs = recall_score(y_test, result, average="weighted")
    f1 = f1_score(y_test, result, average="weighted")
    return {"message": f"Archivo subido correctamente {file.filename}", "ps":ps, "rs":rs, "f1":f1}

@app.get("/download")
def download_file():
    return FileResponse(path ="file_predicted.csv", media_type="text/csv")