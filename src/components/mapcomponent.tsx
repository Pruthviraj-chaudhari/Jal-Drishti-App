import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/marker-icon-2x.png',
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
});

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapEvents({ onLocationSelect }: MapComponentProps) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      L.marker([lat, lng]).addTo(map);
      onLocationSelect(lat, lng);
    },
  });
  return null;
}

export default function MapComponent({ onLocationSelect }: MapComponentProps) {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.invalidateSize();
    }
  }, []);

  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Center of India
      zoom={5}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents onLocationSelect={onLocationSelect} />
    </MapContainer>
  );
}

