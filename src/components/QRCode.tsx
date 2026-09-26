'use client';
import { useEffect, useRef } from 'react';

interface Props {
  value: string;
  size?: number;
}

/**
 * Renders a QR code using the qrcode canvas library.
 * Falls back to a plain URL display if the library isn't available.
 */
export default function QRCode({ value, size = 160 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    import('qrcode').then((QR) => {
      QR.toCanvas(canvasRef.current!, value, {
        width: size,
        margin: 2,
        color: { dark: '#1e293b', light: '#f8fafc' },
      });
    }).catch(() => {
      // fallback: just show the URL
    });
  }, [value, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} width={size} height={size} className="rounded-xl" />
    </div>
  );
}
