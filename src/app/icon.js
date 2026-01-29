import { ImageResponse } from 'next/og'
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 20,
          background: '#E60000', // สีพื้นหลัง (ดำด้านตามธีม)
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',        // สีตัวอักษร
          borderRadius: '8px',   // ความมนของขอบ (ปรับได้)
          fontWeight: 1000,       // ตัวหนา
          letterSpacing: -1,
        }}
      >
        RS
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  )
}