'use client';

import { useState } from 'react';
import { Play, X, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  thumbnail?: string;
}

export default function VideoPlayer({ videoId, title, thumbnail }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const thumbnailUrl = thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  if (isPlaying) {
    return (
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 mb-4">
        <button
          onClick={() => setIsPlaying(false)}
          className="absolute top-3 right-3 z-10 p-2 bg-gray-900/80 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title || 'Video'}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900 mb-4 cursor-pointer group"
      onClick={() => setIsPlaying(true)}
    >
      <img
        src={thumbnailUrl}
        alt={title || 'Video thumbnail'}
        className="w-full h-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        }}
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play className="w-8 h-8 text-white ml-1" fill="white" />
        </div>
      </div>
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-white font-medium">{title}</p>
        </div>
      )}
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 p-2 bg-gray-900/80 rounded-lg hover:bg-gray-800 transition-colors opacity-0 group-hover:opacity-100"
      >
        <ExternalLink className="w-4 h-4 text-white" />
      </a>
    </div>
  );
}
