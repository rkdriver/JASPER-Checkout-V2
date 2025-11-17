'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'

interface TrackingMapProps {
  currentPosition?: { lat: number; lng: number }
  destinationPosition?: { lat: number; lng: number }
  status?: string
}

const TrackingMap: React.FC<TrackingMapProps> = ({ 
  currentPosition = { lat: -6.2088, lng: 106.8456 }, // Default: Jakarta
  destinationPosition = { lat: -6.2297, lng: 106.8295 }, // Default: Jakarta Selatan
  status = 'shipped'
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    const map = L.map(mapRef.current).setView(currentPosition, 12)

    // Add tile layer (using OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Create custom icons
    const currentLocationIcon = L.divIcon({
      html: `
        <div style="
          background-color: #242a2e;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })

    const destinationIcon = L.divIcon({
      html: `
        <div style="
          background-color: #10b981;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l-5.5 9h11z"/>
            <circle cx="12" cy="17.5" r="4.5"/>
          </svg>
        </div>
      `,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    })

    // Add markers
    if (status === 'shipped' || status === 'delivered') {
      L.marker([currentPosition.lat, currentPosition.lng], { icon: currentLocationIcon })
        .addTo(map)
        .bindPopup('<b>Lokasi Saat Ini</b><br>Paket sedang dalam perjalanan')
    }

    L.marker([destinationPosition.lat, destinationPosition.lng], { icon: destinationIcon })
      .addTo(map)
      .bindPopup('<b>Alamat Tujuan</b><br>Lokasi pengiriman')

    // Draw route line if shipped
    if (status === 'shipped') {
      const routeCoordinates = [
        [currentPosition.lat, currentPosition.lng],
        [destinationPosition.lat, destinationPosition.lng]
      ]
      
      L.polyline(routeCoordinates, {
        color: '#242a2e',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(map)
    }

    // Fit bounds to show both markers
    const group = new L.FeatureGroup([
      L.marker([currentPosition.lat, currentPosition.lng]),
      L.marker([destinationPosition.lat, destinationPosition.lng])
    ])
    map.fitBounds(group.getBounds().pad(0.1))

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [currentPosition, destinationPosition, status])

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '400px', 
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden'
      }} 
    />
  )
}

export default TrackingMap