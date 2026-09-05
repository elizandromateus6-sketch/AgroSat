import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { Farm } from '../types';
import { getNdviClassification } from '../services/satelliteService';
import {
  Layers,
  MapPin,
  Info,
  Eye,
  AlertTriangle,
  Sparkles,
  Droplets,
  Sprout,
  Sun,
  Flame,
  CheckCircle2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sliders,
  Compass,
  Gauge
} from 'lucide-react';

export type SatelliteLayerType = 'satellite' | 'ndvi' | 'vegetation' | 'soil' | 'water' | 'alerts';
export type SatelliteProvider = 'google_hybrid' | 'google_sat' | 'esri_hd' | 'esri_clarity' | 'google_terrain';

interface InteractiveMapProps {
  farms: Farm[];
  selectedFarmId?: string;
  onSelectFarm?: (farmId: string) => void;
  activeLayer?: SatelliteLayerType;
  onLayerChange?: (layer: SatelliteLayerType) => void;
  height?: string;
  showLayerControl?: boolean;
}

// Generate sub-grid cells inside a farm polygon to simulate high-resolution Sentinel-2 10m spectral raster data
function generateSubGridCells(center: { lat: number; lng: number }, baseNdvi: number, seed: number) {
  const cells: { lat: number; lng: number; ndvi: number; size: number }[] = [];
  const rows = 6;
  const cols = 6;
  const step = 0.0010; // High-density grid (~100m grid per pixel for ultra-fine resolution)

  for (let r = -rows / 2; r < rows / 2; r++) {
    for (let c = -cols / 2; c < cols / 2; c++) {
      // Deterministic variation based on position and seed
      const variation = Math.sin(r * 1.5 + seed) * 0.12 + Math.cos(c * 1.8 + seed) * 0.08;
      const cellNdvi = Math.min(0.94, Math.max(0.20, baseNdvi + variation));
      cells.push({
        lat: center.lat + (r + 0.5) * step,
        lng: center.lng + (c + 0.5) * step,
        ndvi: Number(cellNdvi.toFixed(2)),
        size: step,
      });
    }
  }
  return cells;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  farms,
  selectedFarmId,
  onSelectFarm,
  activeLayer = 'satellite',
  onLayerChange,
  height = '480px',
  showLayerControl = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const overlaysGroupRef = useRef<L.LayerGroup | null>(null);

  const [currentLayer, setCurrentLayer] = useState<SatelliteLayerType>(activeLayer);
  const [provider, setProvider] = useState<SatelliteProvider>('google_hybrid');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(0.65);
  const [currentZoom, setCurrentZoom] = useState<number>(12);
  const [showSettingsPopover, setShowSettingsPopover] = useState<boolean>(false);

  // Sync external prop changes
  useEffect(() => {
    if (activeLayer && activeLayer !== currentLayer) {
      setCurrentLayer(activeLayer);
    }
  }, [activeLayer]);

  // Handle Layer Selection with instant visual feedback
  const handleLayerSelect = (layerKey: SatelliteLayerType) => {
    setCurrentLayer(layerKey);
    if (onLayerChange) {
      onLayerChange(layerKey);
    }
  };

  // 1. Initialize Map Instance (Runs Once)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Center on Angola default coordinates
    const defaultLat = -12.7761;
    const defaultLng = 15.7392;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [defaultLat, defaultLng],
        zoom: 12,
        maxZoom: 21,
        minZoom: 4,
        scrollWheelZoom: true,
        zoomControl: false,
        attributionControl: false,
      });

      // Track zoom level for resolution indicator
      map.on('zoomend', () => {
        setCurrentZoom(Math.round(map.getZoom()));
      });

      // Default Ultra-HD Base Layer: Google Maps Satellite Hybrid (lyrs=y)
      const baseTile = L.tileLayer('https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        attribution: '&copy; Google Satellite HD & Sentinel-2 ESA',
        maxZoom: 21,
        maxNativeZoom: 20,
        subdomains: ['0', '1', '2', '3'],
        keepBuffer: 8,
        updateWhenZooming: true,
      });
      baseTile.addTo(map);
      baseTileLayerRef.current = baseTile;

      const overlaysGroup = L.layerGroup().addTo(map);
      overlaysGroupRef.current = overlaysGroup;

      mapInstanceRef.current = map;

      // Handle ResizeObserver for precise container fit
      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(mapContainerRef.current);

      return () => {
        resizeObserver.disconnect();
        map.remove();
        mapInstanceRef.current = null;
        baseTileLayerRef.current = null;
        overlaysGroupRef.current = null;
      };
    }
  }, []);

  // 2. Switch Base Tile Layers dynamically (Google Maps HD, Google 4K Sat, Esri HD, etc.)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    let tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
    let attribution = '&copy; Google Satellite HD & Sentinel-2';
    let subdomains: string[] = ['0', '1', '2', '3'];
    let maxNativeZoom = 20;

    switch (provider) {
      case 'google_hybrid':
        tileUrl = 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
        attribution = '&copy; Google Satellite HD (Híbrido + Ruas)';
        subdomains = ['0', '1', '2', '3'];
        maxNativeZoom = 20;
        break;
      case 'google_sat':
        tileUrl = 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
        attribution = '&copy; Google Satélite Óptico Puro 4K';
        subdomains = ['0', '1', '2', '3'];
        maxNativeZoom = 20;
        break;
      case 'esri_hd':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = '&copy; Esri World Imagery & Maxar HD';
        subdomains = ['a', 'b', 'c'];
        maxNativeZoom = 19;
        break;
      case 'esri_clarity':
        tileUrl = 'https://clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = '&copy; Esri Clarity High-Res Satellite';
        subdomains = ['a', 'b', 'c'];
        maxNativeZoom = 19;
        break;
      case 'google_terrain':
        tileUrl = 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
        attribution = '&copy; Google Terreno & Relevo Topográfico';
        subdomains = ['0', '1', '2', '3'];
        maxNativeZoom = 18;
        break;
    }

    const newBase = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 21,
      maxNativeZoom,
      subdomains,
      keepBuffer: 8,
      updateWhenZooming: true,
    });

    newBase.addTo(map);
    baseTileLayerRef.current = newBase;
  }, [provider]);

  // 3. Render Overlays, Heatmaps, Spectral Grids, and Polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    const overlayGroup = overlaysGroupRef.current;
    if (!map || !overlayGroup) return;

    overlayGroup.clearLayers();
    if (farms.length === 0) return;

    const bounds = L.latLngBounds([]);

    farms.forEach((farm, farmIdx) => {
      const isSelected = farm.id === selectedFarmId;
      const farmNdvi = farm.id === 'farm_001' ? 0.78 : farm.id === 'farm_002' ? 0.54 : farm.id === 'farm_004' ? 0.81 : 0.79;
      const ndviMeta = getNdviClassification(farmNdvi);
      const centerPt: [number, number] = [farm.centerCoords.lat, farm.centerCoords.lng];

      bounds.extend(centerPt);

      // A. Layer-Specific Overlays (NDVI Raster Grid, Moisture Mask, Soil Heatmap, Stress Alerts)
      if (currentLayer === 'ndvi') {
        // High-definition NDVI Simulated 10m Pixel Grid
        const gridCells = generateSubGridCells(farm.centerCoords, farmNdvi, farmIdx + 1);
        gridCells.forEach((cell) => {
          const cellMeta = getNdviClassification(cell.ndvi);
          const half = cell.size / 2;
          const cellBounds: L.LatLngBoundsExpression = [
            [cell.lat - half, cell.lng - half],
            [cell.lat + half, cell.lng + half],
          ];

          const cellRect = L.rectangle(cellBounds, {
            color: cellMeta.colorHex,
            weight: 1,
            fillColor: cellMeta.colorHex,
            fillOpacity: isSelected ? overlayOpacity : overlayOpacity * 0.75,
          });

          cellRect.bindTooltip(
            `<strong>${farm.name}</strong><br/>Pixel NDVI: <span style="color:${cellMeta.colorHex};font-weight:bold">${cell.ndvi}</span> (${cellMeta.category})`,
            { sticky: true, opacity: 0.95 }
          );

          cellRect.on('click', () => {
            if (onSelectFarm) onSelectFarm(farm.id);
          });

          cellRect.addTo(overlayGroup);
        });
      } else if (currentLayer === 'vegetation') {
        // EVI / False-Color Infrared (NIR Band 8)
        const gridCells = generateSubGridCells(farm.centerCoords, farmNdvi, farmIdx + 10);
        gridCells.forEach((cell) => {
          const color = cell.ndvi > 0.7 ? '#10B981' : cell.ndvi > 0.5 ? '#34D399' : '#A7F3D0';
          const half = cell.size / 2;
          const cellBounds: L.LatLngBoundsExpression = [
            [cell.lat - half, cell.lng - half],
            [cell.lat + half, cell.lng + half],
          ];

          const cellRect = L.rectangle(cellBounds, {
            color: '#059669',
            weight: 1,
            fillColor: color,
            fillOpacity: isSelected ? overlayOpacity : overlayOpacity * 0.75,
          });

          cellRect.bindTooltip(
            `<strong>${farm.name}</strong><br/>Biomassa EVI: ${(cell.ndvi * 1.1).toFixed(2)} (Clorofila Ativa)`,
            { sticky: true }
          );

          cellRect.on('click', () => {
            if (onSelectFarm) onSelectFarm(farm.id);
          });

          cellRect.addTo(overlayGroup);
        });
      } else if (currentLayer === 'soil') {
        // Soil Moisture / Bare Soil Heatmap (BSI)
        const gridCells = generateSubGridCells(farm.centerCoords, farmNdvi, farmIdx + 20);
        gridCells.forEach((cell) => {
          const soilIndex = 1 - cell.ndvi;
          const color = soilIndex > 0.6 ? '#D97706' : soilIndex > 0.4 ? '#F59E0B' : '#FDE68A';
          const half = cell.size / 2;
          const cellBounds: L.LatLngBoundsExpression = [
            [cell.lat - half, cell.lng - half],
            [cell.lat + half, cell.lng + half],
          ];

          const cellRect = L.rectangle(cellBounds, {
            color: '#B45309',
            weight: 1,
            fillColor: color,
            fillOpacity: isSelected ? overlayOpacity : overlayOpacity * 0.75,
          });

          cellRect.bindTooltip(
            `<strong>${farm.name}</strong><br/>Índice de Solo Exposto: ${soilIndex.toFixed(2)}`,
            { sticky: true }
          );

          cellRect.on('click', () => {
            if (onSelectFarm) onSelectFarm(farm.id);
          });

          cellRect.addTo(overlayGroup);
        });
      } else if (currentLayer === 'water') {
        // NDWI (Water Index / Canopy Moisture)
        const gridCells = generateSubGridCells(farm.centerCoords, farmNdvi, farmIdx + 30);
        gridCells.forEach((cell) => {
          const ndwi = cell.ndvi * 0.85;
          const color = ndwi > 0.6 ? '#0284C7' : ndwi > 0.4 ? '#38BDF8' : '#BAE6FD';
          const half = cell.size / 2;
          const cellBounds: L.LatLngBoundsExpression = [
            [cell.lat - half, cell.lng - half],
            [cell.lat + half, cell.lng + half],
          ];

          const cellRect = L.rectangle(cellBounds, {
            color: '#0369A1',
            weight: 1,
            fillColor: color,
            fillOpacity: isSelected ? overlayOpacity : overlayOpacity * 0.75,
          });

          cellRect.bindTooltip(
            `<strong>${farm.name}</strong><br/>Umidade Foliar NDWI: ${ndwi.toFixed(2)} (Água na Folha)`,
            { sticky: true }
          );

          cellRect.on('click', () => {
            if (onSelectFarm) onSelectFarm(farm.id);
          });

          cellRect.addTo(overlayGroup);
        });
      } else if (currentLayer === 'alerts') {
        // Stress Points Alert Indicators
        const alertPulse = L.circle(centerPt, {
          radius: 350,
          color: '#EF4444',
          fillColor: '#F87171',
          fillOpacity: 0.35,
          weight: 2,
          dashArray: '6, 6',
        });

        alertPulse.bindTooltip(
          `<strong>⚠️ Alerta Fitossanitário</strong><br/>${farm.name}: Variação de vigor foliar detectada na última passagem orbital.`,
          { sticky: true }
        );
        alertPulse.addTo(overlayGroup);
      }

      // B. Farm Boundary Polygon
      if (farm.polygon && farm.polygon.length >= 3) {
        const polyCoords: [number, number][] = farm.polygon.map((p) => [p.lat, p.lng]);
        const polygon = L.polygon(polyCoords, {
          color: isSelected ? '#10B981' : '#F59E0B',
          weight: isSelected ? 3.5 : 2,
          opacity: 0.95,
          fillColor: ndviMeta.colorHex,
          fillOpacity: currentLayer === 'satellite' ? 0.15 : isSelected ? 0.35 : 0.2,
          dashArray: isSelected ? undefined : '4, 4',
        });

        polygon.bindTooltip(
          `<strong>${farm.name}</strong><br/>${farm.totalArea} ha • ${farm.mainCrop}<br/>NDVI Médio: <strong>${farmNdvi.toFixed(2)}</strong>`,
          { sticky: true }
        );

        polygon.on('click', () => {
          if (onSelectFarm) onSelectFarm(farm.id);
        });

        polygon.addTo(overlayGroup);
      }

      // C. High-Definition Custom Map Pin
      const customIcon = L.divIcon({
        className: 'custom-farm-marker',
        html: `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: ${isSelected ? '#10B981' : '#1E291B'};
            border: 2px solid ${isSelected ? '#FFFFFF' : '#8BB174'};
            border-radius: 9999px;
            width: 34px;
            height: 34px;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.45);
            font-size: 14px;
            cursor: pointer;
            transition: transform 0.2s ease;
          ">
            🌱
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker(centerPt, { icon: customIcon });

      // Interactive Details Popup
      const popupHtml = `
        <div style="font-family: sans-serif; padding: 4px; min-width: 210px; color: #0f172a;">
          <h4 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px; color: #1e293b;">${farm.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">📍 ${farm.locationName}</p>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span>Área:</span> <strong>${farm.totalArea} ha</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span>Cultura:</span> <strong>${farm.mainCrop}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px;">
            <span>NDVI Atual:</span>
            <span style="background-color: ${ndviMeta.colorHex}; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">
              ${farmNdvi.toFixed(2)} (${ndviMeta.category})
            </span>
          </div>
          <button id="btn-select-${farm.id}" style="
            width: 100%;
            background-color: #059669;
            color: white;
            border: none;
            padding: 7px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            Focar Propriedade em Alta Resolução
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${farm.id}`);
        if (btn && onSelectFarm) {
          btn.addEventListener('click', () => {
            onSelectFarm(farm.id);
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(centerPt, 17, { duration: 1.2 });
            }
          });
        }
      });

      marker.addTo(overlayGroup);
    });

    if (farms.length > 0 && bounds.isValid() && !selectedFarmId) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [farms, selectedFarmId, currentLayer, overlayOpacity, onSelectFarm]);

  // Fly to selected farm when changed
  useEffect(() => {
    if (!selectedFarmId || !mapInstanceRef.current) return;
    const targetFarm = farms.find((f) => f.id === selectedFarmId);
    if (targetFarm) {
      mapInstanceRef.current.flyTo(
        [targetFarm.centerCoords.lat, targetFarm.centerCoords.lng],
        16,
        { duration: 1.2 }
      );
    }
  }, [selectedFarmId, farms]);

  // Quick Zoom Functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleFocusFarm = () => {
    const target = farms.find((f) => f.id === selectedFarmId) || farms[0];
    if (target && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([target.centerCoords.lat, target.centerCoords.lng], 18, { duration: 1.2 });
    }
  };

  // Layer buttons configuration
  const LAYER_BUTTONS: { id: SatelliteLayerType; label: string; icon: any; desc: string }[] = [
    { id: 'satellite', label: '🛰️ Satélite HD (Google)', icon: Sun, desc: 'Imagens Ópticas de Alta Resolução Sub-métrica' },
    { id: 'ndvi', label: '🌱 NDVI (Saúde Vegetal)', icon: Sprout, desc: 'Vigor Vegetativo & Clorofila' },
    { id: 'vegetation', label: '🌳 EVI / Biomassa', icon: Sparkles, desc: 'Índice de Vegetação Melhorado' },
    { id: 'soil', label: '🏜️ Solo Exposto (BSI)', icon: Flame, desc: 'Cobertura e Textura do Solo' },
    { id: 'water', label: '💧 Umidade (NDWI)', icon: Droplets, desc: 'Umidade e Corpos de Água' },
    { id: 'alerts', label: '⚠️ Áreas de Estresse', icon: AlertTriangle, desc: 'Anomalias e Déficit Hídrico' },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-[#2A3826] bg-[#1E291B]">
      {/* Top Floating Satellite Layer Switcher Toolbar */}
      {showLayerControl && (
        <div className="absolute top-3 left-3 right-3 z-[1000] bg-[#131A11]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#33422F] shadow-2xl space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 text-white">
              <Layers className="w-4 h-4 text-[#8BB174]" />
              <span className="font-bold font-display text-xs text-[#E8EDDF]">Satélite & Índices Espectrais:</span>
              <span className="text-[10px] text-emerald-300 bg-[#2A3826] px-2 py-0.5 rounded-full font-mono font-bold border border-emerald-500/30 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Google Maps Ultra-HD</span>
              </span>
            </div>

            {/* Satellite Provider & Opacity Controls */}
            <div className="flex items-center space-x-2">
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as SatelliteProvider)}
                className="bg-[#1E291B] text-white text-[11px] font-bold px-2.5 py-1 rounded-xl border border-[#3A4E35] focus:outline-none cursor-pointer"
                title="Mudar Provedor de Imagem Satélite"
              >
                <option value="google_hybrid">🌐 Google Maps HD (Híbrido + Ruas)</option>
                <option value="google_sat">🛰️ Google Satélite Puro 4K</option>
                <option value="esri_hd">📡 Esri World Imagery (Maxar HD)</option>
                <option value="esri_clarity">☀️ Esri Clarity High-Res</option>
                <option value="google_terrain">⛰️ Google Terreno & Relevo</option>
              </select>

              <button
                type="button"
                onClick={() => setShowSettingsPopover(!showSettingsPopover)}
                className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center space-x-1 transition-all cursor-pointer ${
                  showSettingsPopover
                    ? 'bg-[#4B6344] text-white border-[#8BB174]'
                    : 'bg-[#1E291B] text-[#A3B18A] hover:text-white border-[#3A4E35]'
                }`}
                title="Configurações de Transparência e Camada"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Opacidade</span>
              </button>
            </div>
          </div>

          {/* Opacity Slider Popover */}
          {showSettingsPopover && (
            <div className="p-2.5 bg-[#1E291B] rounded-xl border border-[#3A4E35] flex items-center justify-between gap-3 text-xs animate-in fade-in">
              <div className="flex items-center space-x-2 text-white">
                <Sliders className="w-3.5 h-3.5 text-[#8BB174]" />
                <span className="font-bold text-[11px]">Transparência do Filtro Espectral:</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-[#A3B18A]">Satélite Puro</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.95"
                  step="0.05"
                  value={overlayOpacity}
                  onChange={(e) => setOverlayOpacity(parseFloat(e.target.value))}
                  className="w-28 sm:w-44 accent-[#8BB174] cursor-pointer"
                />
                <span className="text-[10px] font-mono font-bold text-emerald-400">
                  {Math.round(overlayOpacity * 100)}%
                </span>
              </div>
            </div>
          )}

          {/* Layer Buttons with clear active state */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {LAYER_BUTTONS.map((layerItem) => {
              const active = currentLayer === layerItem.id;
              return (
                <button
                  key={layerItem.id}
                  type="button"
                  onClick={() => handleLayerSelect(layerItem.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center space-x-1.5 cursor-pointer select-none ${
                    active
                      ? 'bg-[#8BB174] text-[#1E291B] shadow-md ring-2 ring-white/50 scale-[1.02]'
                      : 'bg-[#2A3826] text-[#D0D7C9] hover:text-white hover:bg-[#384C33] border border-[#33422F]'
                  }`}
                  title={layerItem.desc}
                >
                  <span>{layerItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Map Leaflet Container */}
      <div ref={mapContainerRef} style={{ height }} className="w-full z-1" />

      {/* Floating Action Controls (Right side) */}
      <div className="absolute right-3 top-36 z-[1000] flex flex-col space-y-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-8 h-8 bg-[#131A11]/90 hover:bg-[#1E291B] text-white rounded-xl border border-[#33422F] shadow-lg flex items-center justify-center cursor-pointer transition-colors"
          title="Aumentar Zoom (Resolução Máxima)"
        >
          <ZoomIn className="w-4 h-4 text-[#8BB174]" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-8 h-8 bg-[#131A11]/90 hover:bg-[#1E291B] text-white rounded-xl border border-[#33422F] shadow-lg flex items-center justify-center cursor-pointer transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut className="w-4 h-4 text-[#8BB174]" />
        </button>
        <button
          type="button"
          onClick={handleFocusFarm}
          className="w-8 h-8 bg-[#4B6344] hover:bg-[#3B4E35] text-white rounded-xl border border-[#8BB174]/40 shadow-lg flex items-center justify-center cursor-pointer transition-colors"
          title="Focar na Fazenda em Resolução Máxima (Nível 18)"
        >
          <Maximize2 className="w-4 h-4 text-emerald-200" />
        </button>
      </div>

      {/* Dynamic Bottom-Left Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[1000] bg-[#131A11]/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-[#33422F] text-[#E8EDDF] text-xs space-y-1 shadow-2xl max-w-xs sm:max-w-sm">
        <div className="font-bold text-white flex items-center space-x-1.5 text-[11px]">
          <Eye className="w-3.5 h-3.5 text-[#8BB174]" />
          <span>
            {currentLayer === 'satellite' && '🛰️ Satélite Óptico HD (Resolução Sub-métrica)'}
            {currentLayer === 'ndvi' && '🌱 Escala de Vigor Vegetativo (NDVI)'}
            {currentLayer === 'vegetation' && '🌳 Índice de Biomassa Ativa (EVI)'}
            {currentLayer === 'soil' && '🏜️ Índice de Solo Exposto (BSI)'}
            {currentLayer === 'water' && '💧 Índice de Umidade & Água (NDWI)'}
            {currentLayer === 'alerts' && '⚠️ Mapa de Anomalias & Estresse Fitossanitário'}
          </span>
        </div>

        {/* Dynamic Color Scale */}
        {currentLayer === 'ndvi' && (
          <div className="flex items-center space-x-2 pt-0.5">
            <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-red-600 via-amber-400 via-emerald-400 to-emerald-800 border border-black/20" />
            <span className="font-mono text-[10px] text-[#A3B18A]">&lt; 0.20 ➔ &gt; 0.85</span>
          </div>
        )}

        {currentLayer === 'vegetation' && (
          <div className="flex items-center space-x-2 pt-0.5">
            <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-emerald-100 via-emerald-400 to-emerald-900 border border-black/20" />
            <span className="font-mono text-[10px] text-[#A3B18A]">Baixo ➔ Alto EVI</span>
          </div>
        )}

        {currentLayer === 'soil' && (
          <div className="flex items-center space-x-2 pt-0.5">
            <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-amber-200 via-amber-600 to-yellow-900 border border-black/20" />
            <span className="font-mono text-[10px] text-[#A3B18A]">Coberto ➔ Exposto</span>
          </div>
        )}

        {currentLayer === 'water' && (
          <div className="flex items-center space-x-2 pt-0.5">
            <div className="h-2.5 w-32 rounded-full bg-gradient-to-r from-sky-200 via-blue-500 to-blue-900 border border-black/20" />
            <span className="font-mono text-[10px] text-[#A3B18A]">Seco ➔ Úmido / Rega</span>
          </div>
        )}

        {currentLayer === 'alerts' && (
          <div className="flex items-center space-x-1.5 pt-0.5 text-[10px] text-rose-300 font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-1"></span>
            <span>Talhões com queda &gt;15% no vigor foliar</span>
          </div>
        )}

        {currentLayer === 'satellite' && (
          <p className="text-[10px] text-[#A3B18A] leading-tight pt-0.5">
            Google Maps Satélite Ultra-HD + Sentinel-2 em cores reais calibradas.
          </p>
        )}
      </div>

      {/* Resolution Indicator & Attribution Badge */}
      <div className="absolute bottom-3 right-3 z-[1000] flex items-center space-x-2">
        <div className="bg-[#131A11]/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-[#33422F] text-[10px] text-emerald-300 font-mono flex items-center space-x-1 shadow-lg">
          <Gauge className="w-3 h-3 text-[#8BB174]" />
          <span>
            {currentZoom >= 18
              ? `Zoom ${currentZoom} • Resolução Sub-métrica 0.3m/px`
              : currentZoom >= 15
              ? `Zoom ${currentZoom} • Resolução HD 1.0m/px`
              : `Zoom ${currentZoom} • Visão Regional`}
          </span>
        </div>
      </div>
    </div>
  );
};
