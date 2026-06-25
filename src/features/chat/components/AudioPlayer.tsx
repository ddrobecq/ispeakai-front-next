'use client';

interface AudioPlayerProps {
  audioUrl: string;
  isPlaying?: boolean;
}

export function AudioPlayer({ audioUrl, isPlaying = false }: AudioPlayerProps) {
  if (!audioUrl) return null;

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded">
      <audio
        key={audioUrl}
        src={audioUrl}
        controls
        autoPlay={isPlaying}
        className="w-full"
      />
    </div>
  );
}
