import { useState, useEffect } from 'react';
import { groupPhotos } from '../imageAssets';

export function PhotoSlider({ height = '340px' }: { height?: string }) {
  const [shuffled] = useState<string[]>(() => {
    const arr = [...groupPhotos];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (shuffled.length < 2) return;
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % shuffled.length);
        setFading(false);
      }, 400);
    }, 4000);
    return () => clearInterval(timer);
  }, [shuffled]);

  if (!shuffled.length) return null;

  return (
    <div style={{ width: '100%', maxWidth: '460px', position: 'relative' }}>
      <div style={{
        borderRadius: '24px', overflow: 'hidden',
        boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        border: '1px solid rgba(200,150,62,0.15)',
      }}>
        <img
          src={shuffled[current]}
          alt={`봉봉단 단체 사진 ${current + 1}`}
          style={{
            width: '100%', height, objectFit: 'cover', display: 'block',
            opacity: fading ? 0 : 1,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '14px' }}>
        {shuffled.map((_, i) => (
          <button
            key={i}
            onClick={() => { setFading(true); setTimeout(() => { setCurrent(i); setFading(false); }, 400); }}
            style={{
              width: i === current ? '20px' : '7px',
              height: '7px',
              borderRadius: '50px',
              background: i === current ? '#C8963E' : 'rgba(200,150,62,0.25)',
              border: 'none', cursor: 'pointer', padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
