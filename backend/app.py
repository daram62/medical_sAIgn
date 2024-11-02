import os
import cv2
import numpy as np
from fastapi import FastAPI, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, GlobalAveragePooling2D
import logging

# FastAPI 앱 생성
app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 루트 엔드포인트
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI server! The /predict endpoint is ready for use."}

# 로깅 설정
logging.basicConfig(level=logging.INFO)

# 사전 훈련된 ResNet50 모델 불러오기 및 커스텀 레이어 추가
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(512, activation='relu'),
    Dropout(0.5),
    Dense(3, activation='softmax')  # 클래스 수를 적절히 수정하세요
])

# 모델 컴파일
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=1e-5),
              loss='categorical_crossentropy', metrics=['accuracy'])

# 예측 함수
def predict_image(image):
    img = cv2.resize(image, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    predictions = model.predict(img)
    predicted_class_index = np.argmax(predictions)
    class_labels = [
        "-ㅂ니까",
        "-ㅂ니다",
        "가래",
        "가만있다",
        "가지다",
        "간호",
        "간호사",
        "갈비뼈",
        "감기",
        "감염",
        "갑갑하다",
        "거북하다",
        "건강",
        "건강보험"
    ]  # 클래스 이름 수정
    return class_labels[predicted_class_index]

# 프레임을 받아서 예측하는 API
@app.post("/predict")
async def predict(file: UploadFile):
    try:
        # 로그 출력
        logging.info("번역 요청을 받았습니다.")
        
        contents = await file.read()
        np_array = np.frombuffer(contents, np.uint8)
        image = cv2.imdecode(np_array, cv2.IMREAD_COLOR)
        prediction = predict_image(image)
        return JSONResponse(content={"prediction": prediction})
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)