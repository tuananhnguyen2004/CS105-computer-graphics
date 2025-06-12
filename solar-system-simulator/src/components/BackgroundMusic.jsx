import { useEffect, useRef, useState } from "react";
import music from "../assets/music.mp3";
import { Volume2, VolumeOff  } from 'lucide-react';

export default function BackgroundMusic() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // useEffect(() => {
  //   const audio = audioRef.current;

  //   if (audio) {
  //     audio.volume = 0.5;

  //     const autoPlay = () => {
  //       if (!isPlaying) {
  //         audio.play.then(() => setIsPlaying(true)).catch(console.warn);
  //       }
  //       window.removeEventListener("click", autoPlay);
  //     };
  //     window.addEventListener("click", autoPlay);
  //   }
  // }, [isPlaying]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) audio.pause();
    else audio.play().catch(console.warn);
    setIsPlaying(!isPlaying);
  };
  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 10,
        padding: "10px 15px",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
      }}
    >
      <button className={`button`} onClick={toggleMusic} style={{padding:'10px 20px'}}>
        {isPlaying?<Volume2/>:<VolumeOff/>}
      </button>
   
      <audio ref={audioRef} volume={0.5} src={music} loop />
    </div>
  );
}
