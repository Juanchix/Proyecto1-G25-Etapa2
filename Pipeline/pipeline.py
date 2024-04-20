import pandas as pd
import numpy as np
import re, string, unicodedata
from num2words import num2words
import spacy
import nltk
from nltk.corpus import stopwords
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report
import joblib

# Descargar recursos de NLTK
print("Descargando recursos de NLTK...")
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
nltk.download('averaged_perceptron_tagger')

# Cargar el modelo de lenguaje en español
print("Cargando modelo de lenguaje en español...")
nlp = spacy.load("es_core_news_lg")

# Definir transformadores personalizados para cada función de preprocesamiento
class EliminarDuplicados(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X.drop_duplicates().reset_index(drop=True)

class ConvertirMinusculas(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X.apply(lambda x: x.lower())

class ConvertirEnterosATexto(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        def reemplazar(match):
            numero = int(match.group(0))
            return num2words(numero, lang='es')
        return X.apply(lambda x: re.sub(r'\b\d+\b', reemplazar, x))

class RemoveNonASCII(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X.apply(lambda x: unicodedata.normalize('NFKD', x).encode('ascii', 'ignore').decode('utf-8', 'ignore'))

class EliminarCaracteresEspeciales(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X.apply(lambda x: re.sub(r'[\r\n\t]', ' ', x))

class LemmatizeSpanishTextBatch(BaseEstimator, TransformerMixin):
    def __init__(self, column_name="Review", batch_size=500):
        self.column_name = column_name
        self.batch_size = batch_size
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        def lemmatize_spanish_text(text):
            doc = nlp(text)
            lemmatized_text = " ".join([token.lemma_ for token in doc])
            return lemmatized_text

        num_batches = (len(X) - 1) // self.batch_size + 1
        X_copy = X.copy()

        for i in range(num_batches):
            start_idx = i * self.batch_size
            end_idx = min((i + 1) * self.batch_size, len(X))
            X_copy.loc[start_idx:end_idx] = X_copy.loc[start_idx:end_idx].apply(lambda row: lemmatize_spanish_text(row[self.column_name]), axis=1)
            print(f"Lemmatización: Procesado batch {i+1}/{num_batches}")

        return X_copy

class EliminarTildesYPuntuacion(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        return X.apply(lambda x: unicodedata.normalize('NFKD', x).encode('ascii', 'ignore').decode('utf-8', 'ignore').translate(str.maketrans('', '', string.punctuation)))

class RemoveStopwords(BaseEstimator, TransformerMixin):
    def __init__(self):
        pass
    
    def fit(self, X, y=None):
        return self
    
    def transform(self, X):
        stop_words = set(stopwords.words('spanish'))
        more_stopwords = ['ser', 'estar', 'tener', 'haber']
        stop_words = stop_words.union(more_stopwords)
        return X.apply(lambda x: ' '.join([word for word in nltk.word_tokenize(x) if word.lower() not in stop_words]))

# Cargar los datos de entrenamiento y prueba
print("Cargando datos de entrenamiento y prueba...")
data_train = pd.read_csv('tipo1_entrenamiento_estudiantes.csv', sep=',', encoding='utf-8')
data_test = pd.read_csv("particion_prueba_estudiantes.csv", sep=",", encoding="utf-8")

# Definir el pipeline
print("Creando pipeline...")
pipeline = Pipeline([
    ('duplicados', EliminarDuplicados()),
    ('minusculas', ConvertirMinusculas()),
    ('numeros_enteros', ConvertirEnterosATexto()),
    ('ascii', RemoveNonASCII()),
    ('caracteres_especiales', EliminarCaracteresEspeciales()),
    ('lematizacion', LemmatizeSpanishTextBatch()),
    ('puntuacion', EliminarTildesYPuntuacion()),
    ('stopwords', RemoveStopwords()),
    ('tfidf', TfidfVectorizer(max_features=3500)),
    ('clf', LogisticRegression())
])

# Entrenar el pipeline
print("Entrenando el pipeline...")
X_train = data_train['Review']
y_train = data_train['Class']
pipeline.fit(X_train, y_train)

# Guardar el pipeline
print("Guardando el pipeline...")
joblib.dump(pipeline, 'pipeline_con_log_reg.joblib')

# Cargar el pipeline
print("Cargando el pipeline guardado...")
loaded_pipeline = joblib.load('pipeline_con_log_reg.joblib')

# Predecir las etiquetas para los datos de prueba
print("Realizando predicciones sobre los datos de prueba...")
X_test = data_test['Review']
y_pred = loaded_pipeline.predict(X_test)

# Informe de clasificación
print("Reporte de la Clasificación:\n")
print(classification_report(data_test['Class'], y_pred))
