import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({
  url,
  initialTime = 0,
  onTimeUpdate,
}) {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);

  /* ---------------- RESUME PLAYBACK ---------------- */
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      if (initialTime > 0 && initialTime < video.duration) {
        video.currentTime = initialTime;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, [initialTime, url]);

  /* ---------------- HLS ATTACHMENT ---------------- */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !url) return;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      return;
    }

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error("HLS fatal error:", data);
        }
      });
    } else {
      video.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url]);

  /* ---------------- TRACK PROGRESS ---------------- */
  const handleTimeUpdate = () => {
    if (!videoRef.current || !onTimeUpdate) return;

    const video = videoRef.current;
    onTimeUpdate(video.currentTime, video.duration);
  };

  if (!url) {
    console.log(url)
    return <div className="text-gray-400">Loading video...</div>;
  }

  return (
    <video
      ref={videoRef}
      controls
      onTimeUpdate={handleTimeUpdate}
      className="w-full rounded-xl border border-white/10 bg-black"
    />
  );
}
