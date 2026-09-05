import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Coordinates } from '../types';
import {
  ANGOLA_MUNICIPALITIES,
  ANGOLA_PROVINCES_COORDS,
  ANGOLA_PROVINCES_CONFIG,
  AngolaLocation,
  searchAngolaLocations,
  parseGPSCoordinates,
} from '../data/angolaLocations';
import {
  MapPin,
  Crosshair,
  RotateCcw,
  Layers,
  Info,
  CheckCircle2,
  Navigation,
  Pencil,
  MousePointerClick,
  Undo2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Search,
  Compass,
  Building2,
  Sparkles,
  Map as MapIcon,
  X,
  Target,
  Sliders,
  Flag
} from 'lucide-react';

export { ANGOLA_PROVINCES_COORDS };

// Calculate geodesic area in hectares for a polygon
function calculatePolygonAreaInHectares(coords: Coordinates[]): number {
  if (coords.length < 3) return 0;
  const radius = 6378137; // Earth radius in meters
  let total = 0;

  for (let i = 0; i < coords.length; i++) {
    const j = (i + 1) % coords.length;
    const p1 = coords[i];
    const p2 = coords[j];

    const radLat1 = (p1.lat * Math.PI) / 180;
    const radLat2 = (p2.lat * Math.PI) / 180;
    const radLngDiff = ((p2.lng - p1.lng) * Math.PI) / 180;

    total += radLngDiff * (2 + Math.sin(radLat1) + Math.sin(radLat2));
  }

  const areaSquareMeters = Math.abs((total * radius * radius) / 4);
  const areaHa = areaSquareMeters / 10000;
  return Number(areaHa.toFixed(2));
}

// Generate square polygon around center
function generateSquarePolygon(center: Coordinates, areaHa: number): Coordinates[] {
  const sideMeters = Math.sqrt(Math.max(areaHa, 0.5) * 10000);
  const deltaLat = (sideMeters / 111320) / 2;
  const deltaLng = (sideMeters / (111320 * Math.cos((center.lat * Math.PI) / 180))) / 2;

  return [
    { lat: Number((center.lat - deltaLat).toFixed(6)), lng: Number((center.lng - deltaLng).toFixed(6)) },
    { lat: Number((center.lat - deltaLat).toFixed(6)), lng: Number((center.lng + deltaLng).toFixed(6)) },
    { lat: Number((center.lat + deltaLat).toFixed(6)), lng: Number((center.lng + deltaLng).toFixed(6)) },
    { lat: Number((center.lat + deltaLat).toFixed(6)), lng: Number((center.lng - deltaLng).toFixed(6)) },
  ];
}

interface FarmMapSelectorProps {
  province: string;
  totalArea: number;
  centerCoords: Coordinates;
  polygon: Coordinates[];
  onLocationChange: (center: Coordinates, polygon: Coordinates[]) => void;
  onAreaCalculated?: (areaHa: number) => void;
  farmName?: string;
  cropName?: string;
  initialMunicipality?: string;
}

export const FarmMapSelector: React.FC<FarmMapSelectorProps> = ({
  province,
  totalArea,
  centerCoords,
  polygon: initialPolygon,
  onLocationChange,
  onAreaCalculated,
  farmName = 'Nova Propriedade',
  cropName = 'Cultura',
  initialMunicipality,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer and graphics refs
  const currentTileLayerRef = useRef<L.TileLayer | null>(null);
  const polygonLayerRef = useRef<L.Polygon | null>(null);
  const polylineLayerRef = useRef<L.Polyline | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const vertexMarkersRef = useRef<L.Marker[]>([]);

  // State
  const [drawMode, setDrawMode] = useState<'center' | 'polygon'>('polygon');
  const [layerType, setLayerType] = useState<'google_hybrid' | 'google_sat' | 'esri_hd' | 'satellite_clarity' | 'osm' | 'topo'>('google_hybrid');
  const [coords, setCoords] = useState<Coordinates>(() => {
    return centerCoords.lat ? centerCoords : (ANGOLA_PROVINCES_COORDS[province] || { lat: -12.7761, lng: 15.7392 });
  });
  const [vertices, setVertices] = useState<Coordinates[]>(() => {
    if (initialPolygon && initialPolygon.length >= 3) return initialPolygon;
    return generateSquarePolygon(centerCoords, totalArea);
  });
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [gpsLoading, setGpsLoading] = useState(false);

  // Search & Location Assistant State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<AngolaLocation[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [manualCoordsInput, setManualCoordsInput] = useState('');
  const [showCoordsModal, setShowCoordsModal] = useState(false);

  // References to keep latest state inside Leaflet listeners
  const drawModeRef = useRef(drawMode);
  drawModeRef.current = drawMode;

  const verticesRef = useRef(vertices);
  verticesRef.current = vertices;

  const coordsRef = useRef(coords);
  coordsRef.current = coords;

  const totalAreaRef = useRef(totalArea);
  totalAreaRef.current = totalArea;

  const calculatedArea = calculatePolygonAreaInHectares(vertices);

  // Municipalities for current province
  const provinceMunicipalities = ANGOLA_MUNICIPALITIES.filter(
    (m) => m.province.toLowerCase() === province.toLowerCase()
  );

  // Search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const matches = searchAngolaLocations(searchQuery);
    setSearchResults(matches.slice(0, 6));
  }, [searchQuery]);

  // Get tile config
  const getTileConfig = (type: typeof layerType) => {
    switch (type) {
      case 'google_hybrid':
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
          attribution: '&copy; Google Maps Satélite HD (Ultra-Res)',
          maxZoom: 21,
          maxNativeZoom: 20,
          subdomains: ['0', '1', '2', '3'],
        };
      case 'google_sat':
        return {
          url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          attribution: '&copy; Google Satélite Óptico 4K',
          maxZoom: 21,
          maxNativeZoom: 20,
          subdomains: ['0', '1', '2', '3'],
        };
      case 'esri_hd':
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri & Maxar HD Satellite',
          maxZoom: 21,
          maxNativeZoom: 19,
          subdomains: ['a', 'b', 'c'],
        };
      case 'satellite_clarity':
        return {
          url: 'https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          attribution: '&copy; Esri Clarity High-Res Satellite',
          maxZoom: 21,
          maxNativeZoom: 19,
          subdomains: ['a', 'b', 'c'],
        };
      case 'osm':
        return {
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
          maxNativeZoom: 19,
          subdomains: ['a', 'b', 'c'],
        };
      case 'topo':
        return {
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenTopoMap (Relevo & Altitude)',
          maxZoom: 18,
          maxNativeZoom: 17,
          subdomains: ['a', 'b', 'c'],
        };
    }
  };

  // Switch Tile Layer
  const switchLayer = (newType: typeof layerType) => {
    setLayerType(newType);
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    const config = getTileConfig(newType);
    const newLayer = L.tileLayer(config.url, {
      attribution: config.attribution,
      maxZoom: config.maxZoom,
      maxNativeZoom: config.maxNativeZoom,
      subdomains: config.subdomains,
      keepBuffer: 8,
      updateWhenZooming: true,
    });

    newLayer.addTo(map);
    currentTileLayerRef.current = newLayer;
  };

  // Sync with Parent Callback
  const notifyParent = useCallback(
    (center: Coordinates, poly: Coordinates[]) => {
      onLocationChange(center, poly);
      if (onAreaCalculated && poly.length >= 3) {
        const area = calculatePolygonAreaInHectares(poly);
        if (area > 0) {
          onAreaCalculated(area);
        }
      }
    },
    [onLocationChange, onAreaCalculated]
  );

  // Fly and reposition to specific location
  const flyToLocation = (targetLat: number, targetLng: number, zoomLevel: number = 15, labelName?: string) => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.flyTo([targetLat, targetLng], zoomLevel, {
      duration: 1.4,
    });

    const newCenter: Coordinates = {
      lat: Number(targetLat.toFixed(6)),
      lng: Number(targetLng.toFixed(6)),
    };

    setCoords(newCenter);
    coordsRef.current = newCenter;

    const newSquare = generateSquarePolygon(newCenter, totalAreaRef.current);
    setVertices(newSquare);
    verticesRef.current = newSquare;

    notifyParent(newCenter, newSquare);
    setStatusMessage(`🎯 Mapa posicionado com sucesso em ${labelName || 'localização selecionada'}.`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  // Handle Location Search Select
  const handleSelectLocation = (loc: AngolaLocation) => {
    flyToLocation(loc.lat, loc.lng, loc.zoom || 15, `${loc.name} (${loc.province})`);
  };

  // Handle Direct GPS Coordinate Paste / Submit
  const handleApplyCoordinates = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseGPSCoordinates(manualCoordsInput || searchQuery);

    if (parsed) {
      flyToLocation(parsed.lat, parsed.lng, 16, `GPS: [${parsed.lat.toFixed(4)}, ${parsed.lng.toFixed(4)}]`);
      setShowCoordsModal(false);
      setManualCoordsInput('');
      setSearchQuery('');
    } else {
      setStatusMessage('⚠️ Formato de coordenadas inválido. Exemplo correto: -12.7761, 15.7392');
    }
  };

  // Redraw Polygon, Lines, and Vertex Markers on Leaflet Map
  const refreshMapVisuals = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentVertices = verticesRef.current;
    const currentMode = drawModeRef.current;
    const currentCenter = coordsRef.current;

    // 1. Remove old vertex markers
    vertexMarkersRef.current.forEach((m) => m.remove());
    vertexMarkersRef.current = [];

    // 2. Manage Polygon / Polyline
    if (currentVertices.length >= 3) {
      const latLngs = currentVertices.map((v) => [v.lat, v.lng] as [number, number]);

      if (polylineLayerRef.current) {
        polylineLayerRef.current.remove();
        polylineLayerRef.current = null;
      }

      if (polygonLayerRef.current) {
        polygonLayerRef.current.setLatLngs(latLngs);
      } else {
        polygonLayerRef.current = L.polygon(latLngs, {
          color: '#10B981',
          weight: 3,
          fillColor: '#059669',
          fillOpacity: 0.35,
          interactive: false,
        }).addTo(map);
      }
    } else if (currentVertices.length > 0) {
      // Less than 3 points: show connecting polyline
      if (polygonLayerRef.current) {
        polygonLayerRef.current.remove();
        polygonLayerRef.current = null;
      }

      const latLngs = currentVertices.map((v) => [v.lat, v.lng] as [number, number]);
      if (polylineLayerRef.current) {
        polylineLayerRef.current.setLatLngs(latLngs);
      } else {
        polylineLayerRef.current = L.polyline(latLngs, {
          color: '#34D399',
          weight: 3,
          dashArray: '6, 8',
        }).addTo(map);
      }
    } else {
      if (polygonLayerRef.current) {
        polygonLayerRef.current.remove();
        polygonLayerRef.current = null;
      }
      if (polylineLayerRef.current) {
        polylineLayerRef.current.remove();
        polylineLayerRef.current = null;
      }
    }

    // 3. Draw draggable vertex markers if in polygon mode
    if (currentMode === 'polygon') {
      currentVertices.forEach((v, index) => {
        const vertexIcon = L.divIcon({
          className: 'vertex-marker',
          html: `
            <div style="
              width: 22px;
              height: 22px;
              border-radius: 50%;
              background: #10B981;
              border: 2.5px solid #FFFFFF;
              box-shadow: 0 2px 8px rgba(0,0,0,0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              color: #FFFFFF;
              font-weight: 800;
              font-size: 11px;
              cursor: grab;
              transform: translate(-50%, -50%);
            ">
              ${index + 1}
            </div>
          `,
          iconSize: [0, 0],
        });

        const vMarker = L.marker([v.lat, v.lng], {
          icon: vertexIcon,
          draggable: true,
        }).addTo(map);

        vMarker.on('drag', (e: any) => {
          const newPos = e.target.getLatLng();
          const updated = [...verticesRef.current];
          updated[index] = {
            lat: Number(newPos.lat.toFixed(6)),
            lng: Number(newPos.lng.toFixed(6)),
          };
          setVertices(updated);
          verticesRef.current = updated;

          if (polygonLayerRef.current && updated.length >= 3) {
            polygonLayerRef.current.setLatLngs(updated.map((p) => [p.lat, p.lng] as [number, number]));
          }
        });

        vMarker.on('dragend', () => {
          const updated = verticesRef.current;
          if (updated.length > 0) {
            const sum = updated.reduce(
              (acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }),
              { lat: 0, lng: 0 }
            );
            const centroid = {
              lat: Number((sum.lat / updated.length).toFixed(6)),
              lng: Number((sum.lng / updated.length).toFixed(6)),
            };
            setCoords(centroid);
            coordsRef.current = centroid;
            notifyParent(centroid, updated);
          }
        });

        vertexMarkersRef.current.push(vMarker);
      });
    }

    // 4. Center Marker Pin
    if (currentCenter && currentCenter.lat) {
      const pinHtml = `
        <div style="
          background: #1E291B;
          color: #FFFFFF;
          border: 2px solid #8BB174;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 14px rgba(0,0,0,0.5);
          white-space: nowrap;
          transform: translate(-50%, -100%);
          pointer-events: auto;
        ">
          <span style="font-size: 14px;">🌱</span>
          <span>${farmName || 'Propriedade'}</span>
          <span style="background: #4B6344; color: #E8EDDF; padding: 1px 6px; border-radius: 9999px; font-size: 10px;">
            ${calculatedArea > 0 ? calculatedArea : totalArea} ha
          </span>
        </div>
      `;

      const centerIcon = L.divIcon({
        className: 'center-farm-pin',
        html: pinHtml,
        iconSize: [0, 0],
      });

      if (centerMarkerRef.current) {
        centerMarkerRef.current.setLatLng([currentCenter.lat, currentCenter.lng]);
        centerMarkerRef.current.setIcon(centerIcon);
      } else {
        const marker = L.marker([currentCenter.lat, currentCenter.lng], {
          icon: centerIcon,
          draggable: currentMode === 'center',
        }).addTo(map);

        marker.on('dragend', (e: any) => {
          const pos = e.target.getLatLng();
          const newCenter: Coordinates = {
            lat: Number(pos.lat.toFixed(6)),
            lng: Number(pos.lng.toFixed(6)),
          };
          setCoords(newCenter);
          coordsRef.current = newCenter;

          if (drawModeRef.current === 'center') {
            const newSquare = generateSquarePolygon(newCenter, totalAreaRef.current);
            setVertices(newSquare);
            verticesRef.current = newSquare;
            notifyParent(newCenter, newSquare);
            refreshMapVisuals();
          }
        });

        centerMarkerRef.current = marker;
      }
    }
  }, [farmName, totalArea, calculatedArea, notifyParent]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // If initial municipality was specified, try to find its coords
      let startLat = coords.lat;
      let startLng = coords.lng;
      let startZoom = 13;

      if (initialMunicipality) {
        const matchMun = ANGOLA_MUNICIPALITIES.find(
          (m) =>
            m.province.toLowerCase() === province.toLowerCase() &&
            m.name.toLowerCase().includes(initialMunicipality.toLowerCase())
        );
        if (matchMun) {
          startLat = matchMun.lat;
          startLng = matchMun.lng;
          startZoom = matchMun.zoom || 14;
        }
      }

      if (!startLat) {
        const initialCoords = ANGOLA_PROVINCES_COORDS[province] || { lat: -12.7761, lng: 15.7392, zoom: 13 };
        startLat = initialCoords.lat;
        startLng = initialCoords.lng;
        startZoom = initialCoords.zoom || 13;
      }

      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: startZoom,
        maxZoom: 21,
        minZoom: 4,
        zoomControl: false,
        attributionControl: false,
      });

      const config = getTileConfig('google_hybrid');
      const baseTile = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
        maxNativeZoom: config.maxNativeZoom,
        subdomains: config.subdomains,
        keepBuffer: 8,
        updateWhenZooming: true,
      }).addTo(map);

      currentTileLayerRef.current = baseTile;
      mapInstanceRef.current = map;

      // Handle Map Clicks
      map.on('click', (e: L.LeafletMouseEvent) => {
        const clicked: Coordinates = {
          lat: Number(e.latlng.lat.toFixed(6)),
          lng: Number(e.latlng.lng.toFixed(6)),
        };

        if (drawModeRef.current === 'center') {
          const newSquare = generateSquarePolygon(clicked, totalAreaRef.current);
          setCoords(clicked);
          coordsRef.current = clicked;
          setVertices(newSquare);
          verticesRef.current = newSquare;
          notifyParent(clicked, newSquare);
          setStatusMessage(`📍 Ponto central posicionado em [${clicked.lat}, ${clicked.lng}]`);
        } else {
          const currentList = verticesRef.current;
          const next = [...currentList, clicked];
          setVertices(next);
          verticesRef.current = next;

          const sum = next.reduce((acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), { lat: 0, lng: 0 });
          const centroid = {
            lat: Number((sum.lat / next.length).toFixed(6)),
            lng: Number((sum.lng / next.length).toFixed(6)),
          };
          setCoords(centroid);
          coordsRef.current = centroid;

          notifyParent(centroid, next);
          setStatusMessage(`✨ Vértice ${next.length} adicionado ao talhão.`);
        }
      });

      setTimeout(() => {
        map.invalidateSize();
        refreshMapVisuals();
      }, 250);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Whenever vertices or drawMode changes, redraw
  useEffect(() => {
    refreshMapVisuals();
  }, [vertices, drawMode, coords, refreshMapVisuals]);

  // Handle Mode Change
  const handleSetDrawMode = (mode: 'center' | 'polygon') => {
    setDrawMode(mode);
    drawModeRef.current = mode;
    if (mode === 'center' && vertices.length !== 4) {
      const square = generateSquarePolygon(coords, totalArea);
      setVertices(square);
      verticesRef.current = square;
      notifyParent(coords, square);
    }
    setStatusMessage(
      mode === 'polygon'
        ? '📐 Modo Talhão: Clique no mapa para marcar os cantos da propriedade.'
        : '📍 Modo Centro: Clique ou arraste o marcador para a sua fazenda.'
    );
  };

  // Undo Last Point
  const handleUndoPoint = () => {
    if (vertices.length === 0) return;
    const next = vertices.slice(0, -1);
    setVertices(next);
    verticesRef.current = next;

    if (next.length > 0) {
      const sum = next.reduce((acc, p) => ({ lat: acc.lat + p.lat, lng: acc.lng + p.lng }), { lat: 0, lng: 0 });
      const centroid = {
        lat: Number((sum.lat / next.length).toFixed(6)),
        lng: Number((sum.lng / next.length).toFixed(6)),
      };
      setCoords(centroid);
      coordsRef.current = centroid;
      notifyParent(centroid, next);
    }
    setStatusMessage('↩️ Último vértice removido.');
  };

  // Clear All
  const handleClearAll = () => {
    setVertices([]);
    verticesRef.current = [];
    notifyParent(coords, []);
    setStatusMessage('🗑️ Talhão limpo. Clique no mapa de satélite para iniciar nova demarcação.');
  };

  // Center on Province
  const handleCenterProvince = () => {
    const provConfig = ANGOLA_PROVINCES_COORDS[province] || { lat: -12.7761, lng: 15.7392, zoom: 13 };
    flyToLocation(provConfig.lat, provConfig.lng, provConfig.zoom || 13, `Província de ${province}`);
  };

  // Real Device GPS
  const handleGetDeviceGPS = () => {
    if (!navigator.geolocation) {
      setStatusMessage('⚠️ Geolocalização não suportada neste navegador.');
      return;
    }

    setGpsLoading(true);
    setStatusMessage('📡 A contactar sensores GPS do telemóvel/computador...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        flyToLocation(pos.coords.latitude, pos.coords.longitude, 16, 'Minha Localização GPS Atual');
      },
      (err) => {
        setGpsLoading(false);
        handleCenterProvince();
        setStatusMessage(`ℹ️ Sinal GPS direto indisponível (${err.message}). Centralizado na capital de ${province}.`);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  };

  // Zoom Controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  // Fit View
  const handleFitBounds = () => {
    if (!mapInstanceRef.current) return;
    if (vertices.length >= 2) {
      const bounds = L.latLngBounds(vertices.map((v) => [v.lat, v.lng] as [number, number]));
      mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
    } else if (coords.lat) {
      mapInstanceRef.current.setView([coords.lat, coords.lng], 15);
    }
  };

  return (
    <div className="space-y-3 font-sans">
      {/* 🚀 SMART SEARCH & LOCATION FINDER BAR */}
      <div className="bg-[#1E291B] p-3 rounded-2xl border border-[#2D3E29] text-white shadow-md space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-[#8BB174]" />
            <span className="text-xs font-bold text-white">Localizador Rápido da Fazenda</span>
          </div>
          <span className="text-[10px] text-[#A3B18A] font-medium hidden sm:inline">
            Pesquise por município, comuna ou insira coordenadas GPS
          </span>
        </div>

        {/* Input Search Box & Direct Actions */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchResults(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleApplyCoordinates();
                  }
                }}
                placeholder="Ex: Bailundo, Waku Kungo, Matala, Caála ou cole coordenadas GPS..."
                className="w-full bg-[#131A11] border border-[#33422F] rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#8BB174]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* GPS Button */}
            <button
              type="button"
              onClick={handleGetDeviceGPS}
              disabled={gpsLoading}
              className="px-3.5 py-2 bg-[#4B6344] hover:bg-[#3B4E35] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-all cursor-pointer shrink-0"
              title="Detectar localização GPS atual do aparelho"
            >
              <Navigation className={`w-3.5 h-3.5 ${gpsLoading ? 'animate-spin text-amber-300' : 'text-[#8BB174]'}`} />
              <span className="hidden sm:inline">{gpsLoading ? 'A obter...' : 'Meu GPS'}</span>
            </button>

            {/* Direct Coords Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowCoordsModal(!showCoordsModal)}
              className="px-3 py-2 bg-[#2A3826] hover:bg-[#384C33] text-[#E0E2D9] rounded-xl text-xs font-semibold flex items-center space-x-1 border border-[#3A4E35] transition-all cursor-pointer shrink-0"
              title="Inserir Latitude e Longitude exatas"
            >
              <Target className="w-3.5 h-3.5 text-[#8BB174]" />
              <span className="hidden sm:inline">Coordenadas</span>
            </button>
          </div>

          {/* Autocomplete Search Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-[#1E291B] border border-[#3A4E35] rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-[#2A3826] animate-in fade-in slide-in-from-top-2 max-h-60 overflow-y-auto">
              {searchResults.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectLocation(item)}
                  className="w-full text-left px-3.5 py-2.5 text-xs hover:bg-[#2A3826] flex items-center justify-between transition-colors cursor-pointer group"
                >
                  <div className="flex items-center space-x-2.5">
                    <Building2 className="w-4 h-4 text-[#8BB174] shrink-0" />
                    <div>
                      <p className="font-bold text-white group-hover:text-emerald-300">{item.name}</p>
                      <p className="text-[10px] text-[#A3B18A]">{item.description || `Província de ${item.province}`}</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#131A11] text-[#8BB174] border border-[#2A3826]">
                    {item.province}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Manual Coordinates Input Popover */}
        {showCoordsModal && (
          <div className="p-3 bg-[#131A11] rounded-xl border border-[#33422F] space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center space-x-1.5">
                <Target className="w-3.5 h-3.5 text-[#8BB174]" />
                <span>Inserir Coordenadas Manuais (GPS / Google Maps)</span>
              </span>
              <button
                type="button"
                onClick={() => setShowCoordsModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={manualCoordsInput}
                onChange={(e) => setManualCoordsInput(e.target.value)}
                placeholder="Ex: -12.8525, 15.5606"
                className="flex-1 bg-[#1E291B] border border-[#3A4E35] rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:ring-2 focus:ring-[#8BB174] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleApplyCoordinates()}
                className="px-3.5 py-1.5 bg-[#4B6344] hover:bg-[#3B4E35] text-white text-xs font-bold rounded-lg shadow-sm cursor-pointer"
              >
                Ir para o Campo
              </button>
            </div>
            <p className="text-[10px] text-[#A3B18A]">
              Aceita graus decimais com sinal negativo (ex: -12.7761, 15.7392) ou formato com cardinais (12.77° S, 15.73° E).
            </p>
          </div>
        )}

        {/* Quick Municipality Jump Chips for Current Province */}
        {provinceMunicipalities.length > 0 && (
          <div className="space-y-1.5 pt-1 border-t border-[#2A3826]">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#A3B18A] font-semibold flex items-center space-x-1">
                <Building2 className="w-3 h-3 text-[#8BB174]" />
                <span>Polos & Municípios de {province}:</span>
              </span>
              <span className="text-[10px] text-[#6B705C]">Clique para aproximar</span>
            </div>

            <div className="flex items-center flex-wrap gap-1.5 max-h-20 overflow-y-auto">
              {provinceMunicipalities.map((mun, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectLocation(mun)}
                  className="px-2.5 py-1 bg-[#2A3826] hover:bg-[#4B6344] text-[#E8EDDF] hover:text-white rounded-lg text-[11px] font-medium border border-[#3A4E35] transition-all cursor-pointer flex items-center space-x-1"
                >
                  <span>{mun.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Tools & Drawing Mode Bar */}
      <div className="bg-[#1E291B] p-2.5 rounded-2xl border border-[#2D3E29] text-white shadow-md flex flex-wrap items-center justify-between gap-2">
        {/* Drawing Mode Selector */}
        <div className="flex items-center bg-[#131A11] p-1 rounded-xl border border-[#2A3826]">
          <button
            type="button"
            onClick={() => handleSetDrawMode('polygon')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              drawMode === 'polygon'
                ? 'bg-[#4B6344] text-white shadow-sm ring-1 ring-[#8BB174]'
                : 'text-[#9DA695] hover:text-white'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Desenhar Talhão ({vertices.length} pts)</span>
          </button>
          <button
            type="button"
            onClick={() => handleSetDrawMode('center')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              drawMode === 'center'
                ? 'bg-[#4B6344] text-white shadow-sm ring-1 ring-[#8BB174]'
                : 'text-[#9DA695] hover:text-white'
            }`}
          >
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Ponto Central</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-1.5">
          {/* Layer Selector */}
          <div className="flex items-center gap-1 bg-[#131A11] p-1 rounded-xl border border-[#2A3826]">
            <button
              type="button"
              onClick={() => switchLayer('google_hybrid')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                layerType === 'google_hybrid'
                  ? 'bg-[#4B6344] text-white font-bold ring-1 ring-[#8BB174]'
                  : 'text-[#9DA695] hover:text-white'
              }`}
              title="Google Maps Satélite HD com nomes de ruas e localidades"
            >
              🌐 Google HD
            </button>
            <button
              type="button"
              onClick={() => switchLayer('google_sat')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                layerType === 'google_sat'
                  ? 'bg-[#4B6344] text-white font-bold ring-1 ring-[#8BB174]'
                  : 'text-[#9DA695] hover:text-white'
              }`}
              title="Google Satélite Óptico Puro 4K"
            >
              🛰️ Google 4K
            </button>
            <button
              type="button"
              onClick={() => switchLayer('esri_hd')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                layerType === 'esri_hd'
                  ? 'bg-[#4B6344] text-white font-bold ring-1 ring-[#8BB174]'
                  : 'text-[#9DA695] hover:text-white'
              }`}
              title="Esri World Imagery e Maxar HD"
            >
              📡 Esri HD
            </button>
            <button
              type="button"
              onClick={() => switchLayer('osm')}
              className={`px-2 py-1 rounded-lg text-[11px] font-medium transition-all ${
                layerType === 'osm'
                  ? 'bg-[#4B6344] text-white font-bold ring-1 ring-[#8BB174]'
                  : 'text-[#9DA695] hover:text-white'
              }`}
              title="Mapa de Ruas e Estradas"
            >
              🗺️ Ruas
            </button>
          </div>

          {/* Undo Vertex */}
          {vertices.length > 0 && (
            <button
              type="button"
              onClick={handleUndoPoint}
              className="px-2.5 py-1.5 bg-[#2A3826] hover:bg-[#384C33] text-amber-300 hover:text-amber-200 rounded-xl text-xs font-semibold flex items-center space-x-1 border border-[#3A4E35] transition-colors cursor-pointer"
              title="Desfazer último ponto"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Desfazer</span>
            </button>
          )}

          {/* Clear All */}
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3 py-1.5 bg-rose-950/70 hover:bg-rose-900 text-rose-200 hover:text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-rose-800/60 transition-colors cursor-pointer"
            title="Limpar todos os pontos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar</span>
          </button>
        </div>
      </div>

      {/* Instructions and Real-time Status */}
      <div className="bg-[#F0F2EB] border border-[#CCD0C2] rounded-xl p-2.5 text-xs text-[#2D3628] flex items-start justify-between gap-3">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-[#4B6344] shrink-0 mt-0.5" />
          <div className="text-[11px] leading-relaxed">
            {statusMessage ? (
              <p className="font-semibold text-[#1E291B]">{statusMessage}</p>
            ) : drawMode === 'polygon' ? (
              <p>
                <strong>Desenho do Campo:</strong> Clique no mapa de satélite nos 4 cantos da sua fazenda. Você pode arrastar os vértices numéricos para ajustar os limites com precisão cirúrgica.
              </p>
            ) : (
              <p>
                <strong>Modo Ponto Central:</strong> Clique no mapa ou arraste o marcador 📍 para a sua propriedade. O perímetro de <strong>{totalArea} ha</strong> é ajustado automaticamente.
              </p>
            )}
          </div>
        </div>

        {/* Live Area Badge */}
        <div className="shrink-0 bg-white border border-[#CCD0C2] px-2.5 py-1 rounded-lg text-right">
          <span className="block text-[9px] uppercase tracking-wider text-[#6B705C] font-bold">Área Medida</span>
          <span className="text-xs font-black text-[#1E291B]">
            {calculatedArea > 0 ? `${calculatedArea} ha` : `${totalArea} ha`}
          </span>
        </div>
      </div>

      {/* Map Canvas with On-Map Controls */}
      <div className="relative w-full h-[380px] rounded-2xl overflow-hidden border-2 border-[#1E291B] shadow-inner bg-[#131A11]">
        <div ref={mapContainerRef} className="w-full h-full z-1" />

        {/* Custom Zoom Controls (Top Left) */}
        <div className="absolute top-3 left-3 z-[1000] flex flex-col bg-[#1E291B]/90 backdrop-blur-md rounded-xl border border-[#3A4E35] overflow-hidden shadow-lg">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 text-white hover:bg-[#4B6344] transition-colors border-b border-[#3A4E35] cursor-pointer"
            title="Aproximar Zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 text-white hover:bg-[#4B6344] transition-colors border-b border-[#3A4E35] cursor-pointer"
            title="Afastar Zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleFitBounds}
            className="p-2 text-[#8BB174] hover:bg-[#4B6344] hover:text-white transition-colors cursor-pointer"
            title="Enquadrar Minha Fazenda"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom Coordinates & Stats */}
        <div className="absolute bottom-3 left-3 z-[1000] bg-[#1E291B]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#3A4E35] text-white text-[11px] font-mono flex items-center space-x-2 shadow-lg">
          <span className="text-[#8BB174]">📍 GPS:</span>
          <span>
            {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
          </span>
        </div>

        <div className="absolute bottom-3 right-3 z-[1000] bg-[#1E291B]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#3A4E35] text-[#8BB174] text-[11px] font-bold flex items-center space-x-1.5 shadow-lg">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>
            {vertices.length >= 3
              ? `Talhão Fechado (${vertices.length} Vértices)`
              : vertices.length > 0
              ? `A demarcar... (${vertices.length} pts)`
              : 'Clique no mapa para marcar'}
          </span>
        </div>
      </div>
    </div>
  );
};
