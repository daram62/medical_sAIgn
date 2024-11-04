# medical_sAIgn

## 청각 장애인-의사 진료 상황의 원활한 의사소통을 도와주는 의료 전문 수어 통역 AI

본 프로젝트는 2024 의료인공지능 아이디어 경진대회의 작품으로서 청각 장애인과 의사 간의 진료 상황에서 원활한 의사소통을 지원하기 위한 의료 전문 수어 통역 AI를 개발하는 것을 목표로 합니다.

<img width="780" alt="image" src="https://github.com/user-attachments/assets/1dd731cc-2f49-43bd-81db-7ebf737bc74b">

### 소개

의료 현장에서 청각 장애인 환자와 의사 간의 소통은 매우 중요하지만, 전문 수어 통역사가 항상 함께할 수는 없습니다. 이 문제를 해결하기 위해 본 프로젝트는 의학 용어에 특화된 한국어 수어 인식 AI를 개발하였습니다.

### 시연 영상 

https://youtu.be/k-SpLoo-NLc

### 기술 스택

- 프론트엔드: Next.js
- 백엔드: FastAPI
- 데이터 처리 및 모델링: Python, TensorFlow, OpenCV

### 특징

- 한국어 의학 수어 데이터셋 활용: 기존 연구들이 주로 영어 데이터셋과 일반적인 상황의 수어를 다룬 반면, 본 프로젝트는 한국어 의학 용어 수어 데이터셋을 활용하였습니다.
- 데이터 전처리 및 정확도 향상: 동영상 100개의 화면을 녹화하고, 자막과 기호를 제거하여 영상의 정확도를 높였습니다.
- 키포인트 추출을 통한 특징 추출: 영상 데이터에서 키포인트를 추출하여 효율적인 피처 데이터를 생성하였습니다.
- ResNet50 모델 사용: 사전 학습된 ResNet50 모델을 활용하여 높은 정확도의 수어 인식을 구현하였습니다.
- 데이터 증강 기법 적용: 다양한 이미지 변환 기법을 사용하여 데이터 증강을 수행하였습니다.

### 데이터셋 및 전처리

한국수어사전 전문용어 수어
- 데이터 수집: 한국수어사전의 의학 전문용어 수어 데이터를 수집하였습니다.
- 영상 전처리
  - 동영상 100개의 화면을 녹화하고, 자막과 기호를 제거하여 순수한 수어 영상만을 남겼습니다.
  - OpenCV를 활용하여 영상의 키포인트를 추출하고, 이를 피처 데이터로 사용하였습니다.

### 모델 구조

ResNet50 모델
- 구성: 50개의 레이어로 구성된 심층 신경망으로, 이미지 분류에 널리 사용됩니다.
- 장점:
  - Skip Connection을 통해 기울기 소실 문제를 완화하고 네트워크의 깊이를 증가시킵니다.
  - 전이 학습: ImageNet 데이터셋에서 사전 학습된 가중치를 사용하여 학습 시간을 단축하고 성능을 향상시켰습니다.
  - Global Average Pooling 레이어를 사용하여 파라미터 수를 줄이고 과적합을 방지하였습니다.
  - 출력층에서 Softmax 활성화 함수를 사용하여 가장 높은 확률을 가진 클래스를 예측합니다.

데이터 증강
ImageDataGenerator를 활용한 데이터 증강
- 프레임 추출:
  - 모든 동영상 파일에서 일정한 간격으로 30개의 프레임을 추출하였습니다.
- 데이터 증강 기법:
  - 픽셀 값 변형
  - 전단 변형
  - 배율 변형
  - 회전 변형
  - 상하좌우 이동

### 설치 방법

프론트엔드 설치
```
  # 리포지토리 클론
  git clone https://github.com/your-username/your-repo.git
  cd your-repo/frontend
  
  # 의존성 설치
  yarn install
  
  # 개발 서버 실행
  yarn dev
```

백엔드 설치
```
  # 백엔드 디렉토리로 이동
  cd ../backend

  # 가상환경 생성 및 활성화 (선택 사항)
  python -m venv venv
  source venv/bin/activate  # Windows에서는 venv\Scripts\activate

  # 의존성 설치
  pip install -r requirements.txt
  
  # 서버 실행
  uvicorn app:app --reload
```

### 사용 방법

1. 백엔드 실행: 위의 명령어로 FastAPI 서버를 실행합니다 (http://localhost:8000).
2. 프론트엔드 실행: 다른 터미널에서 프론트엔드 개발 서버를 실행합니다 (http://localhost:3000).
3. 웹 애플리케이션 접속: 브라우저에서 http://localhost:3000으로 접속합니다.
4. 비디오 업로드 또는 선택:
  - 직접 수어 영상을 업로드하거나,
  - 제공된 의학 수어 비디오 중 하나를 선택합니다.
5. 번역하기 버튼 클릭: 업로드 또는 선택한 영상을 서버로 전송하여 수어 인식을 수행합니다.
6. 결과 확인: 예측된 의학 용어를 화면에서 확인합니다.
