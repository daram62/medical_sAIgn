"use client";

import { useRef, useState } from "react";
import axios from "axios";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState<string>("");

  // 미리 준비된 비디오 리스트
  const videoList = [
    { name: "-ㅂ니까", url: "/videos/-ㅂ니까.mp4" },
    { name: "-ㅂ니다", url: "/videos/-ㅂ니다.mp4" },
    { name: "가래", url: "/videos/가래.mp4" },
    { name: "가만있다", url: "/videos/가만있다.mp4" },
    { name: "가지다", url: "/videos/가지다.mp4" },
    { name: "간호", url: "/videos/간호.mp4" },
    { name: "간호사", url: "/videos/간호사.mp4" },
    { name: "갈비뼈", url: "/videos/갈비뼈.mp4" },
    { name: "감기", url: "/videos/감기.mp4" },
    { name: "감염", url: "/videos/감염.mp4" },
    { name: "갑갑하다", url: "/videos/갑갑하다.mp4" },
    { name: "거북하다", url: "/videos/거북하다.mp4" },
    { name: "건강", url: "/videos/건강.mp4" },
    { name: "건강보험", url: "/videos/건강보험.mp4" },
  ];

  // 비디오 선택 처리
  const handleVideoSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const url = event.target.value;
    if (videoRef.current) {
      videoRef.current.src = url;
      videoRef.current.load(); // 새 비디오 로드
      videoRef.current.play(); // 비디오 자동 재생
    }
  };

  // 비디오가 끝날 때 무한 재생
  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // 비디오를 처음으로 되돌림
      videoRef.current.play(); // 비디오 다시 재생
    }
  };

  // 프레임을 캡처하여 서버에 전송
  const sendFrameToServer = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // 캔버스 크기를 동영상 크기에 맞춤
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageBlob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/jpeg")
        );

        if (imageBlob) {
          const formData = new FormData();
          formData.append("file", imageBlob, "frame.jpg");

          try {
            const response = await axios.post(
              "http://localhost:8000/predict",
              formData,
              {
                headers: { "Content-Type": "multipart/form-data" },
              }
            );
            setResult(
              (response.data as { prediction: string }).prediction ??
                "예측 실패"
            );
          } catch (error) {
            console.error("예측 요청 오류:", error);
            setResult("예측 요청 중 오류 발생");
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#A7C7E7] to-[#C1E1C1] p-8 text-gray-800">
      {/* 제목 */}
      <h1 className="text-4xl font-gangwon font-bold mb-4 text-gray-700">
        청각장애인을 위한 진료 상황 수어 번역기
      </h1>

      <h1 className="text-3xl font-semibold mb-4 text-gray-700">sAIgn</h1>
      {/* 비디오 선택 드롭다운 */}
      <div className="w-full max-w-md mb-6">
        <h2 className="text-2xl font-gangwon font-semibold mb-4 text-gray-700 text-center">
          비디오 선택
        </h2>
        <select
          className="w-full p-2 border font-gangwon rounded-lg shadow-sm text-center"
          onChange={handleVideoSelect}
        >
          <option value="">비디오를 선택하세요</option>
          {videoList.map((video, index) => (
            <option key={index} value={video.url}>
              {video.name}
            </option>
          ))}
        </select>
      </div>

      {/* 비디오 플레이어 */}
      <div className="relative w-[640px] h-[400px] bg-gray-200 border-4 border-[#B4E0D9] rounded-lg overflow-hidden shadow-lg mb-6">
        <video
          ref={videoRef}
          controls
          muted // 비디오를 음소거 상태로 설정
          className="w-full h-full object-cover"
          onEnded={handleVideoEnd} // 비디오가 끝날 때 이벤트 핸들러
        />
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>

      {/* 번역 버튼 */}
      <button
        onClick={sendFrameToServer}
        className="bg-[#B4E0D9] text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-[#9FDCC9] transition mb-6 shadow-md text-xl"
      >
        번역하기
      </button>

      {/* 예측 결과 표시 */}
      <div className="w-[400px] p-6 bg-[#E7ECEF] text-center rounded-lg shadow-lg text-gray-700 text-xl">
        <p>{result || "비디오를 선택하고 번역하기를 클릭하세요."}</p>
      </div>
    </div>
  );
}
