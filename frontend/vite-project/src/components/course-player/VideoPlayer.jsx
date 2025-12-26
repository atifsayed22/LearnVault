import { useEffect, useRef } from "react";

export default function VideoPlayer({
  url,
  initialTime = 0,
  onTimeUpdate,
}) {
  const videoRef = useRef(null);

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

  /* ---------------- TRACK PROGRESS ---------------- */
  const handleTimeUpdate = () => {
    if (!videoRef.current || !onTimeUpdate) return;

    const video = videoRef.current;
    onTimeUpdate(video.currentTime, video.duration);
  };

  if (!url) {
    return <div className="text-gray-400">Loading video...</div>;
  }

  return (
    <video
      ref={videoRef}
      src={url}
      controls
      onTimeUpdate={handleTimeUpdate}
      className="w-full rounded-xl border border-white/10 bg-black"
    />
  );
}
