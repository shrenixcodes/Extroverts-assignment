import { MeshCanvas, type MeshBlob } from './MeshCanvas'

const AMBIENT_BLOBS: MeshBlob[] = [
  { color: 'rgba(124,58,237,0.22)', x: 0.85, y: 0.08, radiusFrac: 0.4, ampX: 0.04, ampY: 0.05, freq: 0.1, phase: 0, parallax: 0 },
  { color: 'rgba(217,70,239,0.16)', x: 0.1, y: 0.92, radiusFrac: 0.4, ampX: 0.05, ampY: 0.04, freq: 0.08, phase: 2.6, parallax: 0 },
]

export function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <MeshCanvas blobs={AMBIENT_BLOBS} className="blur-[100px]" />
    </div>
  )
}
