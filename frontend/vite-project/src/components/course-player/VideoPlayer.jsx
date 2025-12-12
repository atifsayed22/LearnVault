export default function VideoPlayer({ url }) {
  if (!url) return <div className="text-gray-400">Loading video...</div>;

  return (
    <video
      src={url}
      controls
      className="w-full rounded-xl border border-white/10"
    />
  );
}
