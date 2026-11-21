import { useState } from 'react';
import { Monitor } from 'lucide-react';

interface MediaFrameProps {
  src: string;
  alt: string;
  aspectClass?: string;
  className?: string;
  imgClassName?: string;
  caption?: string;
  priority?: boolean;
  fit?: 'cover' | 'contain';
}

export function MediaFrame({
  src,
  alt,
  aspectClass = 'aspect-video',
  className = '',
  imgClassName = '',
  caption,
  priority = false,
  fit = 'cover',
}: MediaFrameProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`overflow-hidden rounded-xl border border-white/10 bg-[#12111C] ${className}`}
    >
      <div
        className={`relative w-full ${aspectClass} overflow-hidden ${
          fit === 'contain' ? 'bg-[#090614]' : 'bg-[#0E0D17]'
        }`}
      >
        {!failed && src ? (
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setFailed(true)}
            className={`w-full h-full ${
              fit === 'contain' ? 'object-contain' : 'object-cover'
            } ${imgClassName}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6 text-center bg-gradient-to-br from-[#161326] to-[#0D0C14]">
            <Monitor className="w-8 h-8 text-zinc-500" aria-hidden="true" />
            <p className="text-sm font-medium text-zinc-300 max-w-xs">{alt}</p>
          </div>
        )}
      </div>
      {caption && (
        <figcaption className="px-4 py-3 text-xs text-zinc-400 border-t border-white/8 leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
