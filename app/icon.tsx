import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: 32, height: 32 }}>
        <div style={{ width: 11, height: 32, background: '#009246' }} />
        <div style={{ width: 10, height: 32, background: '#ffffff' }} />
        <div style={{ width: 11, height: 32, background: '#ce2b37' }} />
      </div>
    ),
    { ...size }
  )
}