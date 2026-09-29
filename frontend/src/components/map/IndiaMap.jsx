import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, useMap } from 'react-leaflet'
import { REGIME_COLORS } from '../../data/mockRegimes.js'

// ─── Force re-center whenever center/zoom props change ────────────────────────
function SetViewOnChange({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.setView(center, zoom, { animate: true })
  }, [center, zoom, map])
  return null
}

// ─── Simplified India state GeoJSON ──────────────────────────────────────────
const INDIA_GEOJSON = {
  type: 'FeatureCollection',
  features: [
    { type: 'Feature', properties: { state_name: 'Maharashtra', regime: 'Active Monsoon', avg_rainfall: 54.2 }, geometry: { type: 'Polygon', coordinates: [[[72.6, 15.6],[80.9, 15.6],[80.9, 22.0],[72.6, 22.0],[72.6, 15.6]]] } },
    { type: 'Feature', properties: { state_name: 'Kerala', regime: 'Orographic Rainfall', avg_rainfall: 114.2 }, geometry: { type: 'Polygon', coordinates: [[[74.9, 8.2],[77.4, 8.2],[77.4, 12.8],[74.9, 12.8],[74.9, 8.2]]] } },
    { type: 'Feature', properties: { state_name: 'Rajasthan', regime: 'Break Monsoon', avg_rainfall: 5.6 }, geometry: { type: 'Polygon', coordinates: [[[69.5, 23.0],[78.2, 23.0],[78.2, 30.2],[69.5, 30.2],[69.5, 23.0]]] } },
    { type: 'Feature', properties: { state_name: 'West Bengal', regime: 'Monsoon Depression', avg_rainfall: 96.8 }, geometry: { type: 'Polygon', coordinates: [[[85.8, 21.5],[89.9, 21.5],[89.9, 27.2],[85.8, 27.2],[85.8, 21.5]]] } },
    { type: 'Feature', properties: { state_name: 'Uttarakhand', regime: 'Orographic Rainfall', avg_rainfall: 79.3 }, geometry: { type: 'Polygon', coordinates: [[[77.6, 29.0],[81.0, 29.0],[81.0, 31.5],[77.6, 31.5],[77.6, 29.0]]] } },
    { type: 'Feature', properties: { state_name: 'Tamil Nadu', regime: 'Coastal Rainfall', avg_rainfall: 59.5 }, geometry: { type: 'Polygon', coordinates: [[[76.2, 8.0],[80.4, 8.0],[80.4, 13.5],[76.2, 13.5],[76.2, 8.0]]] } },
    { type: 'Feature', properties: { state_name: 'Gujarat', regime: 'Active Monsoon', avg_rainfall: 38.4 }, geometry: { type: 'Polygon', coordinates: [[[68.2, 20.1],[74.4, 20.1],[74.4, 24.7],[68.2, 24.7],[68.2, 20.1]]] } },
    { type: 'Feature', properties: { state_name: 'Madhya Pradesh', regime: 'Active Monsoon', avg_rainfall: 67.1 }, geometry: { type: 'Polygon', coordinates: [[[74.0, 21.1],[82.8, 21.1],[82.8, 26.9],[74.0, 26.9],[74.0, 21.1]]] } },
    { type: 'Feature', properties: { state_name: 'Uttar Pradesh', regime: 'Active Monsoon', avg_rainfall: 43.8 }, geometry: { type: 'Polygon', coordinates: [[[77.1, 23.9],[84.6, 23.9],[84.6, 30.4],[77.1, 30.4],[77.1, 23.9]]] } },
    { type: 'Feature', properties: { state_name: 'Karnataka', regime: 'Active Monsoon', avg_rainfall: 72.3 }, geometry: { type: 'Polygon', coordinates: [[[74.0, 11.6],[78.6, 11.6],[78.6, 18.4],[74.0, 18.4],[74.0, 11.6]]] } },
    { type: 'Feature', properties: { state_name: 'Odisha', regime: 'Monsoon Depression', avg_rainfall: 88.7 }, geometry: { type: 'Polygon', coordinates: [[[81.4, 17.8],[87.5, 17.8],[87.5, 22.6],[81.4, 22.6],[81.4, 17.8]]] } },
    { type: 'Feature', properties: { state_name: 'Andhra Pradesh', regime: 'Coastal Rainfall', avg_rainfall: 61.4 }, geometry: { type: 'Polygon', coordinates: [[[76.8, 13.2],[84.7, 13.2],[84.7, 19.9],[76.8, 19.9],[76.8, 13.2]]] } },
    { type: 'Feature', properties: { state_name: 'Bihar', regime: 'Active Monsoon', avg_rainfall: 51.2 }, geometry: { type: 'Polygon', coordinates: [[[83.3, 24.3],[88.0, 24.3],[88.0, 27.5],[83.3, 27.5],[83.3, 24.3]]] } },
    { type: 'Feature', properties: { state_name: 'Punjab', regime: 'Western Disturbance', avg_rainfall: 22.8 }, geometry: { type: 'Polygon', coordinates: [[[73.9, 29.6],[76.8, 29.6],[76.8, 32.5],[73.9, 32.5],[73.9, 29.6]]] } },
    { type: 'Feature', properties: { state_name: 'Assam', regime: 'Active Monsoon', avg_rainfall: 142.3 }, geometry: { type: 'Polygon', coordinates: [[[89.7, 24.0],[96.0, 24.0],[96.0, 27.9],[89.7, 27.9],[89.7, 24.0]]] } },
  ],
}

// Lead-time multipliers per date index (Today / Tomorrow / Day+2)
const DATE_MULTIPLIERS = [1.0, 1.18, 1.35]

export default function IndiaMap({ onStateClick, selectedLayer = 'rainfall', layerData, selectedDate = 0 }) {
  const geoJsonRef = useRef(null)
  const INDIA_CENTER = [20.5937, 78.9629]
  const INDIA_ZOOM = 5

  const multiplier = DATE_MULTIPLIERS[selectedDate] ?? 1.0

  const styleFeature = (feature) => {
    const regime = feature.properties.regime
    const color = REGIME_COLORS[regime] || '#94a3b8'
    return {
      fillColor: color,
      fillOpacity: 0.35,
      color: color,
      weight: 1.5,
      opacity: 0.8,
    }
  }

  const onEachFeature = (feature, layer) => {
    const { state_name, regime, avg_rainfall } = feature.properties
    layer.bindTooltip(
      `<div style="font-family:Inter,sans-serif;padding:4px 0">
        <strong style="font-size:13px">${state_name}</strong><br/>
        <span style="color:#64748b;font-size:11px">Regime: ${regime}</span><br/>
        <span style="color:#64748b;font-size:11px">Avg: ${avg_rainfall} mm</span>
      </div>`,
      { sticky: true, opacity: 0.95 },
    )
    layer.on({
      click: () => { if (onStateClick) onStateClick({ state_name, regime, avg_rainfall }) },
      mouseover: (e) => { e.target.setStyle({ fillOpacity: 0.55, weight: 2.5 }) },
      mouseout: (e) => { if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target) },
    })
  }

  // Compute marker appearance based on active layer + selected date
  const getMarkerProps = (d) => {
    const alertColors = { normal: '#18A86B', moderate: '#F59E0B', heavy: '#E84E1A', very_heavy: '#DC2626' }

    if (selectedLayer === 'rainfall') {
      const mm = (d.corrected_mm || 0) * multiplier
      const color = mm >= 115.5 ? '#DC2626' : mm >= 64.5 ? '#E84E1A' : mm >= 15 ? '#F59E0B' : '#18A86B'
      const radius = Math.max(4, Math.min(14, 4 + mm / 20))
      return { color, radius, tooltipExtra: `Corrected: ${mm.toFixed(1)} mm` }
    }

    if (selectedLayer === 'probability') {
      const prob = Math.min(1, (d.heavy_rain_prob || 0) * multiplier)
      const color = prob > 0.8 ? '#DC2626' : prob > 0.6 ? '#E84E1A' : prob > 0.4 ? '#F59E0B' : '#18A86B'
      const radius = 4 + prob * 10
      return { color, radius, tooltipExtra: `Heavy Rain Prob: ${(prob * 100).toFixed(0)}%` }
    }

    if (selectedLayer === 'regime') {
      const color = REGIME_COLORS[d.regime] || '#94a3b8'
      return { color, radius: 7, tooltipExtra: `Regime: ${d.regime}` }
    }

    return { color: alertColors[d.alert_level] || '#18A86B', radius: 6, tooltipExtra: '' }
  }

  return (
    <MapContainer
      center={INDIA_CENTER}
      zoom={INDIA_ZOOM}
      style={{ height: '100%', width: '100%', minHeight: '340px', borderRadius: '8px' }}
      zoomControl={true}
      attributionControl={false}
    >
      <SetViewOnChange center={INDIA_CENTER} zoom={INDIA_ZOOM} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <GeoJSON
        ref={geoJsonRef}
        data={INDIA_GEOJSON}
        style={styleFeature}
        onEachFeature={onEachFeature}
      />
      {layerData && layerData.map((d) => {
        const { color, radius, tooltipExtra } = getMarkerProps(d)
        return (
          <CircleMarker
            key={`${d.id}-${selectedDate}-${selectedLayer}`}
            center={[d.lat, d.lon]}
            radius={radius}
            fillColor={color}
            color="white"
            weight={1.5}
            fillOpacity={0.9}
            eventHandlers={{ click: () => onStateClick && onStateClick(d) }}
          >
            <Tooltip sticky>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: '12px' }}>
                <strong>{d.name}</strong>, {d.state}<br />
                <span style={{ color: '#64748b' }}>{tooltipExtra}</span>
              </div>
            </Tooltip>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}

