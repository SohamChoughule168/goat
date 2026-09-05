'use client';

import dynamic from 'next/dynamic';
import ForceDark from '@/components/v6/force-dark';

const SpatialCanvas = dynamic(() => import('@/components/spatial/SpatialCanvas'), {
  ssr: false,
  loading: () => <div className="spatial-loading" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Spatial OS...</div>,
});

export default function HomePage() {
  return (
    <>
      <ForceDark />
      <main id="main" className="relative" data-v3>
        <SpatialCanvas />
      </main>
    </>
  );
}