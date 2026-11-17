import React, { useEffect, useState, useCallback } from 'react';
import {
  APIProvider,
  Map as GoogleMap,
  AdvancedMarker,
  Pin,
  InfoWindow,
  useMap,
  useAdvancedMarkerRef,
  useApiLoadingStatus,
  APILoadingStatus,
  MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, ShieldCheck, ExternalLink, Store as StoreIcon, AlertTriangle } from 'lucide-react';
import { StoreLocation } from '../types';
import { PAKISTAN_CENTER, PAKISTAN_DEFAULT_ZOOM, getStoreDirectionsUrl } from '../data/pakistanCities';

export interface CameraTarget {
  lat: number;
  lng: number;
  zoom: number;
  key?: number;
}

interface StoreMapProps {
  stores?: StoreLocation[];
  selectedStore?: StoreLocation | null;
  onSelectStore?: (store: StoreLocation | null) => void;
  onOpenStoreDetails?: (store: StoreLocation) => void;
  userLocation?: { lat: number; lng: number } | null;
  cameraTarget?: CameraTarget | null;
  language?: 'en' | 'ur';
  heightClassName?: string;
  pickerMode?: boolean;
  pickedCoords?: { lat: number; lng: number } | null;
  onPickLocation?: (lat: number, lng: number) => void;
}

function useGoogleMapsApiKey(): { apiKey: string; loadingKey: boolean } {
  const envKey = ((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string) || '';
  const [apiKey, setApiKey] = useState<string>(envKey);
  const [loadingKey, setLoadingKey] = useState<boolean>(!envKey);

  useEffect(() => {
    if (envKey) {
      setApiKey(envKey);
      setLoadingKey(false);
      return;
    }

    let cancelled = false;
    fetch('/api/maps-config')
      .then((res) => (res.ok ? res.json() : { apiKey: '' }))
      .then((data) => {
        if (!cancelled && data?.apiKey) {
          setApiKey(String(data.apiKey));
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingKey(false);
      });

    return () => {
      cancelled = true;
    };
  }, [envKey]);

  return { apiKey, loadingKey };
}

const CameraController: React.FC<{ cameraTarget?: CameraTarget | null }> = ({ cameraTarget }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !cameraTarget) return;
    map.panTo({ lat: cameraTarget.lat, lng: cameraTarget.lng });
    map.setZoom(cameraTarget.zoom);
  }, [map, cameraTarget]);

  return null;
};

interface StoreMarkerProps {
  store: StoreLocation;
  isSelected: boolean;
  isActiveInfo: boolean;
  language: 'en' | 'ur';
  onMarkerClick: (store: StoreLocation) => void;
  onCloseInfo: () => void;
  onOpenDetails?: (store: StoreLocation) => void;
}

const StoreMarkerWithInfo: React.FC<StoreMarkerProps> = ({
  store,
  isSelected,
  isActiveInfo,
  language,
  onMarkerClick,
  onCloseInfo,
  onOpenDetails,
}) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const pinColors = isSelected
    ? { background: '#b45309', borderColor: '#78350f', glyphColor: '#fef3c7' }
    : store.isVerified
      ? { background: '#047857', borderColor: '#064e3b', glyphColor: '#ecfdf5' }
      : { background: '#1c1917', borderColor: '#0c0a09', glyphColor: '#fde68a' };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: store.latitude, lng: store.longitude }}
        onClick={() => onMarkerClick(store)}
        title={`${store.name} (${store.city})`}
      >
        <Pin
          background={pinColors.background}
          borderColor={pinColors.borderColor}
          glyphColor={pinColors.glyphColor}
          scale={isSelected ? 1.25 : 1.05}
        />
      </AdvancedMarker>

      {isActiveInfo && marker && (
        <InfoWindow anchor={marker} maxWidth={280} onCloseClick={onCloseInfo}>
          <div className="p-1 space-y-2 text-stone-900 font-sans" dir={language === 'ur' ? 'rtl' : 'ltr'}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-serif font-bold text-sm text-stone-900 leading-snug">{store.name}</h4>
                <p className="text-[11px] text-stone-500">
                  {store.businessType} • {store.city}, {store.province}
                </p>
              </div>
              {store.isVerified && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                  <ShieldCheck className="w-3 h-3" />
                  {language === 'ur' ? 'تصدیق شدہ' : 'Verified'}
                </span>
              )}
            </div>

            <p className="text-[11px] text-stone-700 leading-relaxed line-clamp-2">{store.address}</p>

            <div className="flex items-center gap-1.5 pt-1">
              {onOpenDetails && (
                <button
                  type="button"
                  onClick={() => onOpenDetails(store)}
                  className="flex-1 px-2.5 py-1.5 bg-stone-900 text-amber-200 rounded-lg text-[11px] font-bold hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  {language === 'ur' ? 'مکمل تفصیلات' : 'Full Details'}
                </button>
              )}
              <a
                href={getStoreDirectionsUrl(store)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-amber-100 text-amber-900 rounded-lg text-[11px] font-bold hover:bg-amber-200 transition-colors inline-flex items-center gap-1"
              >
                <Navigation className="w-3 h-3" />
                <span>{language === 'ur' ? 'راستہ' : 'Directions'}</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};

const ApiErrorWatch: React.FC<{ language: 'en' | 'ur' }> = ({ language }) => {
  const status = useApiLoadingStatus();
  if (status !== APILoadingStatus.FAILED && status !== APILoadingStatus.AUTH_FAILURE) {
    return null;
  }

  return (
    <div className="absolute bottom-3 left-3 right-3 z-20 bg-amber-50/95 border border-amber-300 text-amber-950 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md">
      <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
      <span>
        {language === 'ur'
          ? 'نقشہ لوڈ کرنے میں عارضی مسئلہ ہے۔ آپ نیچے دی گئی فہرست سے تمام دکانیں اور گوگل میپس ڈائریکشنز دیکھ سکتے ہیں۔'
          : 'Interactive map tiles are currently unavailable. You can still browse all verified stores and open Google Maps directions directly.'}
      </span>
    </div>
  );
};

export const StoreMap: React.FC<StoreMapProps> = ({
  stores = [],
  selectedStore = null,
  onSelectStore,
  onOpenStoreDetails,
  userLocation = null,
  cameraTarget = null,
  language = 'en',
  heightClassName = 'h-[460px] lg:h-[580px]',
  pickerMode = false,
  pickedCoords = null,
  onPickLocation,
}) => {
  const { apiKey, loadingKey } = useGoogleMapsApiKey();
  const [infoStoreId, setInfoStoreId] = useState<string | null>(null);

  useEffect(() => {
    if (selectedStore?.id) {
      setInfoStoreId(selectedStore.id);
    }
  }, [selectedStore?.id]);

  const handleMapClick = useCallback(
    (ev: MapMouseEvent) => {
      if (!pickerMode || !onPickLocation) return;
      const latLng = ev.detail?.latLng;
      if (latLng && typeof latLng.lat === 'number' && typeof latLng.lng === 'number') {
        onPickLocation(Number(latLng.lat.toFixed(6)), Number(latLng.lng.toFixed(6)));
      }
    },
    [pickerMode, onPickLocation]
  );

  const validStores = stores.filter(
    (s) =>
      typeof s.latitude === 'number' &&
      typeof s.longitude === 'number' &&
      !Number.isNaN(s.latitude) &&
      !Number.isNaN(s.longitude) &&
      (s.latitude !== 0 || s.longitude !== 0)
  );

  if (loadingKey) {
    return (
      <div className={`${heightClassName} w-full rounded-2xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center gap-2 text-stone-500`}>
        <div className="w-7 h-7 border-3 border-amber-700 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-medium">
          {language === 'ur' ? 'پاکستان کا نقشہ لوڈ ہو رہا ہے...' : 'Loading Interactive Pakistan Map...'}
        </span>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className={`${heightClassName} w-full rounded-2xl bg-stone-100 border border-stone-200 flex flex-col items-center justify-center p-6 text-center space-y-3`}>
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
          <MapPin className="w-6 h-6" />
        </div>
        <h4 className="font-serif text-base font-bold text-stone-900">
          {language === 'ur' ? 'انٹرایکٹو نقشہ دستیاب نہیں' : 'Interactive Map Temporarily Unavailable'}
        </h4>
        <p className="text-xs text-stone-600 max-w-md">
          {language === 'ur'
            ? 'نقشے کی سروس اس وقت دستیاب نہیں، لیکن آپ فہرست میں موجود ہر دکان کے لیے "Get Directions" پر کلک کرکے گوگل میپس میں لوکیشن کھول سکتے ہیں۔'
            : 'Map preview is initializing. You can use the store directory or paste/click Google Maps coordinates directly.'}
        </p>
      </div>
    );
  }

  const initialCenter = pickedCoords && pickedCoords.lat !== 0
    ? pickedCoords
    : cameraTarget
      ? { lat: cameraTarget.lat, lng: cameraTarget.lng }
      : PAKISTAN_CENTER;

  const initialZoom = pickedCoords && pickedCoords.lat !== 0
    ? 14
    : cameraTarget?.zoom ?? PAKISTAN_DEFAULT_ZOOM;

  return (
    <div className={`relative ${heightClassName} w-full rounded-2xl overflow-hidden border border-stone-200 shadow-sm bg-stone-100`}>
      <APIProvider
        apiKey={apiKey}
        libraries={['marker']}
        language={language === 'ur' ? 'ur' : 'en'}
        region="PK"
      >
        <GoogleMap
          mapId="DEMO_MAP_ID"
          defaultCenter={initialCenter}
          defaultZoom={initialZoom}
          gestureHandling="greedy"
          streetViewControl={false}
          mapTypeControl={true}
          fullscreenControl={true}
          onClick={handleMapClick}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          <CameraController cameraTarget={cameraTarget} />

          {/* Public Store Locator Mode Markers */}
          {!pickerMode &&
            validStores.map((store) => (
              <StoreMarkerWithInfo
                key={store.id}
                store={store}
                isSelected={selectedStore?.id === store.id}
                isActiveInfo={infoStoreId === store.id}
                language={language}
                onMarkerClick={(clicked) => {
                  setInfoStoreId(clicked.id);
                  if (onSelectStore) onSelectStore(clicked);
                }}
                onCloseInfo={() => setInfoStoreId(null)}
                onOpenDetails={onOpenStoreDetails}
              />
            ))}

          {/* Current User Location Marker (Near Me) */}
          {!pickerMode && userLocation && (
            <AdvancedMarker position={userLocation} title="Your Location">
              <Pin background="#0284c7" borderColor="#0c4a6e" glyphColor="#ffffff" scale={1.1} />
            </AdvancedMarker>
          )}

          {/* Admin / Distributor Interactive Pin Picker Marker */}
          {pickerMode && pickedCoords && (pickedCoords.lat !== 0 || pickedCoords.lng !== 0) && (
            <AdvancedMarker position={pickedCoords} title="Selected Store Pin">
              <Pin background="#b45309" borderColor="#78350f" glyphColor="#fef3c7" scale={1.25} />
            </AdvancedMarker>
          )}
        </GoogleMap>
        <ApiErrorWatch language={language} />
      </APIProvider>

      {/* Subtle Map Legend / Picker Instruction Pill */}
      {pickerMode ? (
        <div className="absolute top-3 left-3 z-10 bg-stone-900/90 text-amber-200 px-3 py-1.5 rounded-xl text-[11px] font-semibold shadow-md backdrop-blur-xs pointer-events-none flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Click anywhere on the map to place the exact store pin</span>
        </div>
      ) : (
        <div className="hidden sm:flex absolute bottom-3 left-3 z-10 bg-white/95 border border-stone-200 px-3 py-1.5 rounded-xl text-[11px] font-semibold text-stone-700 shadow-sm items-center gap-3 backdrop-blur-xs">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
            {language === 'ur' ? 'تصدیق شدہ' : 'Verified'}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-900 inline-block" />
            {language === 'ur' ? 'رجسٹرڈ سٹور' : 'Registered Store'}
          </span>
          {userLocation && (
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600 inline-block" />
              {language === 'ur' ? 'آپ کی لوکیشن' : 'You'}
            </span>
          )}
          <span className="text-stone-400 flex items-center gap-1">
            <StoreIcon className="w-3 h-3" /> {validStores.length}
          </span>
        </div>
      )}
    </div>
  );
};
