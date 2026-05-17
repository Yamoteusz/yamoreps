import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'YamoREPS — Najlepszy spreadsheet w Polsce';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background:
            'radial-gradient(ellipse 80% 60% at 20% 0%, #581c87 0%, transparent 60%), radial-gradient(ellipse 70% 50% at 80% 100%, #155e75 0%, transparent 60%), #08080c',
          color: 'white',
          fontFamily: 'sans-serif',
          padding: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: 'linear-gradient(135deg, #a855f7, #22d3ee)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 56,
            }}
          >
            ✨
          </div>
          <div
            style={{
              fontSize: 88,
              fontWeight: 800,
              letterSpacing: -2,
              display: 'flex',
            }}
          >
            <span>Yamo</span>
            <span
              style={{
                background:
                  'linear-gradient(120deg, #a855f7, #22d3ee, #ec4899)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              REPS
            </span>
          </div>
        </div>

        <div
          style={{
            fontSize: 44,
            fontWeight: 600,
            textAlign: 'center',
            letterSpacing: -1,
            lineHeight: 1.2,
            maxWidth: 1000,
          }}
        >
          Wszystko, czego potrzebujesz
          <br />
          <span style={{ color: '#a78bfa' }}>w jednym miejscu.</span>
        </div>

        <div
          style={{
            marginTop: 60,
            display: 'flex',
            gap: 24,
            fontSize: 22,
            color: '#9b9bab',
          }}
        >
          <span>3000+ produktów</span>
          <span>·</span>
          <span>QC galleries</span>
          <span>·</span>
          <span>Konwerter linków</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
