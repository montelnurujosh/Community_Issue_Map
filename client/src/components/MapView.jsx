import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapController({ center, zoom }) {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 13);
    }
  }, [center, zoom, map]);

  return null;
}

function MapView({ issues, focusedIssueId }) {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState([-1.286389, 36.817223]);
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    if (focusedIssueId) {
      const issue = issues.find(i => i._id === focusedIssueId);
      if (issue && issue.location?.coordinates) {
        const [lng, lat] = issue.location.coordinates;
        setMapCenter([lat, lng]);
        setMapZoom(15);
      }
    }
  }, [focusedIssueId, issues]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: '50vh', minHeight: '300px' }}>
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} zoom={mapZoom} />

        {issues.map((issue) => {
          if (!issue.location?.coordinates) return null;
          const [lng, lat] = issue.location.coordinates;

          return (
            <Marker key={issue._id} position={[lat, lng]}>
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-lg mb-2">{issue.title}</h3>
                  <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Category:</strong> {issue.category}</p>
                    <p><strong>County:</strong> {issue.location.county}</p>
                    <p><strong>Status:</strong> <span className={`font-semibold ${
                      issue.status === 'Resolved' ? 'text-green-600' :
                      issue.status === 'In Progress' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>{issue.status}</span></p>
                    <p><strong>Date:</strong> {new Date(issue.createdAt).toLocaleDateString()}</p>
                  </div>
                  {issue.imageUrl && (
                    <img
                      src={issue.imageUrl}
                      alt={issue.title}
                      className="mt-2 w-full h-24 object-cover rounded"
                    />
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
