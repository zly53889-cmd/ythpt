<template>
  <div class="relative w-full h-full bg-[#041126]">
    <!-- Map Container -->
    <div ref="mapContainer" class="w-full h-full z-0"></div>
    
    <!-- Tech Overlay Grid -->
    <div class="absolute inset-0 pointer-events-none opacity-20 z-10" style="background-image: linear-gradient(#00d0ff 1px, transparent 1px), linear-gradient(90deg, #00d0ff 1px, transparent 1px); background-size: 50px 50px;"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const props = withDefaults(defineProps<{
  showFixed?: boolean;
  showMobile?: boolean;
  showPersonnel?: boolean;
  overlays?: {
    satellite: boolean;
    radar: boolean;
    rainfall: boolean;
    flightPath: boolean;
  };
}>(), {
  showFixed: true,
  showMobile: true,
  showPersonnel: true,
  overlays: () => ({
    satellite: false,
    radar: false,
    rainfall: false,
    flightPath: false
  })
});

const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;
let fixedLayerGroup: L.LayerGroup | null = null;
let mobileLayerGroup: L.LayerGroup | null = null;
let personnelLayerGroup: L.LayerGroup | null = null;
let satelliteLayer: L.Layer | null = null;
let radarLayer: L.Layer | null = null;
let rainfallLayer: L.Layer | null = null;
let flightPathLayer: L.LayerGroup | null = null;

// Mock data for operation points within Tianjin
const fixedPoints: [number, number][] = [
  [39.13, 117.20], [39.40, 117.40], [38.85, 117.15], [39.60, 117.45], [39.25, 117.70]
];
const mobilePoints: [number, number][] = [
  [39.05, 117.05], [39.50, 117.20], [39.35, 117.55], [38.95, 117.40], [39.45, 117.75]
];
const personnelPoints = [
  { latlog: [39.15, 117.25] as [number, number], count: 12 },
  { latlog: [39.35, 117.15] as [number, number], count: 8 },
  { latlog: [39.00, 117.50] as [number, number], count: 15 },
  { latlog: [39.45, 117.35] as [number, number], count: 6 },
];

const updateMarkers = () => {
  if (!map) return;

  if (fixedLayerGroup) fixedLayerGroup.clearLayers();
  if (mobileLayerGroup) mobileLayerGroup.clearLayers();
  if (personnelLayerGroup) personnelLayerGroup.clearLayers();

  if (props.showFixed) {
    fixedPoints.forEach(pos => {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-6 h-6 rounded bg-[#00d0ff]/10 border border-[#00d0ff]/40 flex items-center justify-center shadow-[0_0_10px_rgba(0,208,255,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00d0ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker(pos, { icon }).addTo(fixedLayerGroup!);
    });
  }

  if (props.showMobile) {
    mobilePoints.forEach(pos => {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-6 h-6 rounded bg-[#2dcc5f]/10 border border-[#2dcc5f]/40 flex items-center justify-center shadow-[0_0_10px_rgba(45,204,95,0.2)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2dcc5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-5h-7v5a1 1 0 0 0 1 1Z"/><path d="M16 8h5"/><circle cx="5.5" cy="18" r="1.5"/><circle cx="17.5" cy="18" r="1.5"/></svg>
               </div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
      L.marker(pos, { icon }).addTo(mobileLayerGroup!);
    });
  }

  if (props.showPersonnel) {
    personnelPoints.forEach(p => {
      const icon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="flex items-center">
                <div class="w-6 h-6 rounded-full bg-[#00d0ff]/20 border border-[#00d0ff]/60 flex items-center justify-center shadow-[0_0_8px_#00d0ff]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00d0ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div class="ml-1 px-1.5 py-0.5 bg-[#00d0ff]/80 text-[#050b1c] text-[10px] font-bold rounded-sm shadow-sm">${p.count}</div>
               </div>`,
        iconSize: [60, 24],
        iconAnchor: [12, 12]
      });
      L.marker(p.latlog, { icon }).addTo(personnelLayerGroup!);
    });
  }
};

const updateOverlays = () => {
  if (!map || !props.overlays) return;

  // Satellite (Mock with a semi-transparent image or color)
  if (props.overlays.satellite) {
    if (!satelliteLayer) {
      satelliteLayer = L.rectangle([[39.5, 116.8], [38.5, 117.8]], {
        color: "#fff",
        weight: 0,
        fillColor: "#fff",
        fillOpacity: 0.1,
        className: 'animate-pulse'
      });
    }
    satelliteLayer.addTo(map);
  } else if (satelliteLayer) {
    map.removeLayer(satelliteLayer);
  }

  // Radar (Mock with some circles of different colors)
  if (props.overlays.radar) {
    if (!radarLayer) {
      radarLayer = L.layerGroup([
        L.circle([39.2, 117.3], { radius: 15000, fillColor: '#2dcc5f', fillOpacity: 0.4, weight: 0 }),
        L.circle([39.2, 117.3], { radius: 8000, fillColor: '#ffe600', fillOpacity: 0.5, weight: 0 }),
        L.circle([39.2, 117.3], { radius: 4000, fillColor: '#ff4747', fillOpacity: 0.6, weight: 0 })
      ]);
    }
    radarLayer.addTo(map);
  } else if (radarLayer) {
    map.removeLayer(radarLayer);
  }

  // Rainfall (Mock with small droplets/icons)
  if (props.overlays.rainfall) {
    if (!rainfallLayer) {
      rainfallLayer = L.circle([38.9, 117.1], { radius: 20000, fillColor: '#00d0ff', fillOpacity: 0.2, weight: 1, color: '#00d0ff', dashArray: '5,5' });
    }
    rainfallLayer.addTo(map);
  } else if (rainfallLayer) {
    map.removeLayer(rainfallLayer);
  }

  // Flight Path (Mock with a polyline)
  if (props.overlays.flightPath) {
    if (!flightPathLayer) {
      const latlngs: [number, number][] = [
        [39.1, 117.1], [39.3, 117.4], [39.5, 117.3], [39.4, 117.6]
      ];
      flightPathLayer = L.layerGroup([
        L.polyline(latlngs, { color: '#b870ff', weight: 2, dashArray: '10, 10' }),
        L.marker([39.4, 117.6], {
          icon: L.divIcon({
            html: '<div class="text-[#b870ff] animate-bounce"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg></div>',
            iconSize: [16, 16],
            className: ''
          })
        })
      ]);
    }
    flightPathLayer.addTo(map);
  } else if (flightPathLayer) {
    map.removeLayer(flightPathLayer);
  }
};

onMounted(() => {
  if (!mapContainer.value) return;

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false
  }).setView([39.13, 117.20], 9); // Tianjin area

  fixedLayerGroup = L.layerGroup().addTo(map);
  mobileLayerGroup = L.layerGroup().addTo(map);
  personnelLayerGroup = L.layerGroup().addTo(map);

  // Google Terrain Layer
  L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    opacity: 0.8
  }).addTo(map);

  // Watch for prop changes
  watch(() => [props.showFixed, props.showMobile, props.showPersonnel], () => {
    updateMarkers();
  });

  watch(() => props.overlays, () => {
    updateOverlays();
  }, { deep: true });

  // Fetch and Add Tianjin City Boundary GeoJSON with fallback strategy
  const fetchBoundary = async () => {
    const urls = [
      'https://geo.datav.aliyun.com/areas_v3/bound/120000_full.json',
      'https://geo.datav.aliyun.com/areas_v2/bound/120000_full.json',
      'https://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/bound/120000_full.json'
    ];

    for (const url of urls) {
      try {
        const res = await fetch(url);
        if (!res.ok) continue;
        const text = await res.text();
        if (text.trim().startsWith('<!')) continue; // Skip if it's HTML
        const data = JSON.parse(text);
        
        if (map) {
          // Main Boundary Line
          L.geoJSON(data, {
            style: {
              color: '#004de6',
              weight: 3,
              opacity: 0.9,
              dashArray: '',
              fill: false
            }
          }).addTo(map);

          // Outer Glow Layer
          L.geoJSON(data, {
            style: {
              color: '#004de6',
              weight: 8,
              opacity: 0.1,
              fill: false
            }
          }).addTo(map);

          // Fit map to boundary
          const geoLayer = L.geoJSON(data);
          map.fitBounds(geoLayer.getBounds(), { padding: [20, 20] });
          
          // Initial rendering
          updateMarkers();
          updateOverlays();
          return; // Success!
        }
      } catch (e) {
        console.warn(`Failed to fetch GeoJSON from ${url}`, e);
      }
    }
    
    // Final Fallback: if all fetches fail
    if (map) {
      L.circle([39.13, 117.20], {
        radius: 45000,
        color: '#004de6',
        weight: 3,
        opacity: 0.6,
        fill: false
      }).addTo(map);
      
      // Initial rendering even in fallback
      updateMarkers();
      updateOverlays();
    }
  };

  fetchBoundary();

  // Add some dark theme overlay to make it fit the dashboard better
  const darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    pane: 'overlayPane'
  });
  // darkLayer.addTo(map); // Optional: only if we want dark labels
});

onBeforeUnmount(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style scoped>
/* Make sure the map takes full space without background issues */
:deep(.leaflet-container) {
  background: transparent !important;
}
</style>
