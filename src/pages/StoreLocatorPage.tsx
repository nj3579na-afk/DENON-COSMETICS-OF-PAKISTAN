import React, { useState, useMemo, useEffect } from 'react';
import {
  MapPin,
  Search,
  Phone,
  MessageCircle,
  Navigation,
  Copy,
  Check,
  ShieldCheck,
  Clock,
  Mail,
  Store,
  LocateFixed,
  X,
  User,
  Sparkles,
  ExternalLink,
  Building2,
  Globe,
  ShoppingBag,
} from 'lucide-react';
import { StoreLocation, Product, StoreBusinessType } from '../types';
import { StoreMap, CameraTarget } from '../components/StoreMap';
import {
  PAKISTAN_CENTER,
  PAKISTAN_DEFAULT_ZOOM,
  PAKISTAN_PROVINCES,
  PAKISTAN_CITIES,
  STORE_BUSINESS_TYPES,
  findCityMatch,
  storeMatchesQuery,
  calculateDistanceKm,
  getStoreDirectionsUrl,
  getCityUrduName,
  getProvinceUrduName,
  normalizeSearchText,
} from '../data/pakistanCities';

interface StoreLocatorPageProps {
  stores: StoreLocation[];
  products: Product[];
  initialCity?: string;
  onClearInitialCity?: () => void;
  setActiveTab?: (tab: string) => void;
}

const FEATURED_CITIES = ['Peshawar', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Quetta', 'Multan', 'Faisalabad'];

export const StoreLocatorPage: React.FC<StoreLocatorPageProps> = ({
  stores,
  products,
  initialCity = '',
  onClearInitialCity,
  setActiveTab,
}) => {
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [searchQuery, setSearchQuery] = useState(initialCity);
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [selectedProvince, setSelectedProvince] = useState('All');
  const [selectedBusinessType, setSelectedBusinessType] = useState<'All' | StoreBusinessType>('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [selectedStore, setSelectedStore] = useState<StoreLocation | null>(null);
  const [detailStore, setDetailStore] = useState<StoreLocation | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedStoreId, setCopiedStoreId] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null);

  // Sync incoming city jump (e.g. from HomePage "Find DENON Near You")
  useEffect(() => {
    if (initialCity) {
      setSearchQuery(initialCity);
      setSelectedCity(initialCity);
      const cityInfo = findCityMatch(initialCity);
      if (cityInfo) {
        setCameraTarget({ lat: cityInfo.lat, lng: cityInfo.lng, zoom: 12, key: Date.now() });
      }
      if (onClearInitialCity) onClearInitialCity();
    }
  }, [initialCity, onClearInitialCity]);

  // Only show Active + Approved stores on public storefront
  const publicStores = useMemo(
    () =>
      stores.filter(
        (s) => s && s.isActive !== false && s.approvalStatus !== 'Pending' && s.approvalStatus !== 'Rejected'
      ),
    [stores]
  );

  // Available cities in registered stores (plus popular cities)
  const availableStoreCities = useMemo(() => {
    const citySet = new Set<string>();
    publicStores.forEach((s) => {
      if (s.city?.trim()) citySet.add(s.city.trim());
    });
    return Array.from(citySet).sort();
  }, [publicStores]);

  // Filtered + optional Near Me distance sorting
  const filteredStores = useMemo(() => {
    const matched = publicStores.filter((store) => {
      if (verifiedOnly && !store.isVerified) return false;
      if (selectedProvince !== 'All' && normalizeSearchText(store.province) !== normalizeSearchText(selectedProvince)) {
        return false;
      }
      if (selectedBusinessType !== 'All' && store.businessType !== selectedBusinessType) {
        return false;
      }
      if (selectedCity) {
        const cityMeta = findCityMatch(selectedCity);
        const matchDirect = normalizeSearchText(store.city) === normalizeSearchText(selectedCity);
        const matchAlias = cityMeta && normalizeSearchText(store.city) === normalizeSearchText(cityMeta.nameEn);
        if (!matchDirect && !matchAlias) return false;
      }
      if (searchQuery.trim() && !storeMatchesQuery(store, searchQuery)) {
        return false;
      }
      return true;
    });

    const withDistance = matched.map((store) => {
      const distanceKm =
        userLocation && store.latitude && store.longitude
          ? calculateDistanceKm(userLocation.lat, userLocation.lng, store.latitude, store.longitude)
          : null;
      return { store, distanceKm };
    });

    if (userLocation) {
      withDistance.sort((a, b) => {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      });
    } else {
      withDistance.sort((a, b) => Number(b.store.isVerified) - Number(a.store.isVerified));
    }

    return withDistance;
  }, [publicStores, verifiedOnly, selectedProvince, selectedBusinessType, selectedCity, searchQuery, userLocation]);

  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setSearchQuery(cityName);
    if (!cityName) {
      setCameraTarget({ ...PAKISTAN_CENTER, zoom: PAKISTAN_DEFAULT_ZOOM, key: Date.now() });
      return;
    }

    const cityStores = publicStores.filter(
      (s) => normalizeSearchText(s.city) === normalizeSearchText(cityName)
    );
    const cityInfo = findCityMatch(cityName);
    if (cityInfo) {
      setCameraTarget({ lat: cityInfo.lat, lng: cityInfo.lng, zoom: 12, key: Date.now() });
    } else if (cityStores[0]?.latitude && cityStores[0]?.longitude) {
      setCameraTarget({
        lat: cityStores[0].latitude,
        lng: cityStores[0].longitude,
        zoom: 12,
        key: Date.now(),
      });
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (!val.trim()) {
      setSelectedCity('');
      setCameraTarget({ ...PAKISTAN_CENTER, zoom: PAKISTAN_DEFAULT_ZOOM, key: Date.now() });
      return;
    }

    const matchedCity = findCityMatch(val);
    if (matchedCity) {
      setSelectedCity('');
      setCameraTarget({ lat: matchedCity.lat, lng: matchedCity.lng, zoom: 11, key: Date.now() });
    }
  };

  const handleFindNearMe = () => {
    setGeoError('');
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setGeoError(
        lang === 'ur'
          ? 'آپ کے براؤزر میں لوکیشن کی سہولت دستیاب نہیں ہے۔'
          : 'Geolocation is not supported in your browser.'
      );
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        setSelectedCity('');
        setSearchQuery('');
        setSelectedProvince('All');
        setCameraTarget({ lat: coords.lat, lng: coords.lng, zoom: 12, key: Date.now() });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setGeoError(
          lang === 'ur'
            ? 'لوکیشن تک رسائی کی اجازت نہیں ملی۔ براہِ کرم شہر منتخب کریں یا سرچ کریں۔'
            : 'Location permission denied. Please allow browser location or search your city manually.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('');
    setSelectedProvince('All');
    setSelectedBusinessType('All');
    setVerifiedOnly(false);
    setUserLocation(null);
    setGeoError('');
    setSelectedStore(null);
    setCameraTarget({ ...PAKISTAN_CENTER, zoom: PAKISTAN_DEFAULT_ZOOM, key: Date.now() });
  };

  const handleCopyAddress = (store: StoreLocation) => {
    const fullText = `${store.name}, ${store.address}, ${store.city}, ${store.province}, Pakistan`;
    navigator.clipboard?.writeText(fullText);
    setCopiedStoreId(store.id);
    setTimeout(() => setCopiedStoreId(null), 2000);
  };

  const handleOpenStoreModal = (store: StoreLocation) => {
    setSelectedStore(store);
    setDetailStore(store);
    setActivePhotoIdx(0);
    if (store.latitude && store.longitude) {
      setCameraTarget({ lat: store.latitude, lng: store.longitude, zoom: 15, key: Date.now() });
    }
  };

  const formatWhatsAppHref = (num: string, storeName: string) => {
    const clean = (num || '').replace(/[^0-9]/g, '');
    const normalized = clean.startsWith('0') ? `92${clean.slice(1)}` : clean;
    const text = encodeURIComponent(`Assalam-o-Alaikum, I found ${storeName} on DENON COSMETICS Store Locator and want to inquire about Denon products.`);
    return `https://wa.me/${normalized}?text=${text}`;
  };

  const t = {
    badge: lang === 'ur' ? 'پاکستان سٹور لوکیٹر' : 'PAKISTAN SMART STORE LOCATOR',
    title: lang === 'ur' ? 'اپنے قریب DENON سٹورز تلاش کریں' : 'Find Authorized DENON COSMETICS Stores Across Pakistan',
    subtitle:
      lang === 'ur'
        ? 'پاکستان بھر میں تصدیق شدہ کاسمیٹکس شاپس، فارمیسیز، ہول سیلرز اور آفیشل ڈسٹری بیوٹرز تلاش کریں۔'
        : 'Locate verified cosmetics shops, pharmacies, wholesalers, and authorized DENON distributors in your city.',
    nearMe: lang === 'ur' ? 'میرے قریب DENON سٹورز' : 'Find DENON Stores Near Me',
    locating: lang === 'ur' ? 'لوکیشن تلاش کی جا رہی ہے...' : 'Detecting Your Location...',
    searchPlaceholder:
      lang === 'ur'
        ? 'شہر یا دکان تلاش کریں (مثلاً پشاور، لاہور، کراچی، اسلام آباد)...'
        : 'Search by city or store (e.g. Peshawar, پشاور, Lahore, Karachi)...',
    allProvinces: lang === 'ur' ? 'تمام صوبے' : 'All Provinces',
    allCities: lang === 'ur' ? 'تمام شہر' : 'All Cities',
    allTypes: lang === 'ur' ? 'تمام اقسام' : 'All Types',
    verifiedOnlyLabel: lang === 'ur' ? 'صرف تصدیق شدہ سٹورز' : 'Verified Only',
    resetFilters: lang === 'ur' ? 'ری سیٹ' : 'Reset',
    noStoresTitle:
      publicStores.length === 0
        ? lang === 'ur'
          ? 'ابھی کوئی سٹور رجسٹرڈ نہیں ہے'
          : 'No Registered Stores Added Yet'
        : lang === 'ur'
          ? 'اس شہر یا فلٹر میں ابھی کوئی سٹور دستیاب نہیں'
          : 'No DENON Stores Found for This Search',
    noStoresDesc:
      publicStores.length === 0
        ? lang === 'ur'
          ? 'ایڈمن پینل یا ڈسٹری بیوٹر پورٹل سے تصدیق شدہ سٹورز شامل ہونے کے بعد وہ یہاں خودکار طریقے سے نقشے پر ظاہر ہوں گے۔'
          : 'Once authorized stores or distributors are added and approved in the Admin Panel, they will automatically appear live on Pakistan’s map.'
        : lang === 'ur'
          ? 'براہِ کرم کوئی دوسرا شہر منتخب کریں یا فلٹرز صاف کرکے تمام دستیاب سٹورز دیکھیں۔'
          : 'Try searching another Pakistani city (like Lahore, Karachi, Peshawar, or Islamabad) or reset your filters.',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6" dir={lang === 'ur' ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/40 text-amber-300 text-[11px] font-bold tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.badge}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-white leading-tight">{t.title}</h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Language Switcher EN / اردو */}
          <div className="flex bg-stone-800 p-1 rounded-xl border border-stone-700 text-xs font-bold" dir="ltr">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                lang === 'en' ? 'bg-amber-600 text-white' : 'text-stone-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('ur')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                lang === 'ur' ? 'bg-amber-600 text-white' : 'text-stone-300 hover:text-white'
              }`}
            >
              اردو
            </button>
          </div>

          <button
            id="find-stores-near-me-btn"
            type="button"
            onClick={handleFindNearMe}
            disabled={isLocating}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? t.locating : t.nearMe}</span>
          </button>
        </div>
      </div>

      {/* Geolocation Error Banner */}
      {geoError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl text-xs flex items-center justify-between gap-3">
          <span>{geoError}</span>
          <button onClick={() => setGeoError('')} className="p-1 hover:bg-amber-100 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search & Multi-Filter Control Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Bilingual City & Store Search */}
          <div className="md:col-span-5 relative">
            <Search className={`w-4 h-4 text-stone-400 absolute top-3 ${lang === 'ur' ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              list="pakistan-cities-datalist"
              className={`w-full py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-900 focus:ring-1 focus:ring-amber-700 focus:outline-hidden ${
                lang === 'ur' ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
            <datalist id="pakistan-cities-datalist">
              {PAKISTAN_CITIES.map((c) => (
                <option key={c.nameEn} value={lang === 'ur' ? c.nameUr : c.nameEn}>
                  {c.nameEn} — {c.nameUr}
                </option>
              ))}
            </datalist>
          </div>

          {/* City Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedCity}
              onChange={(e) => handleCitySelect(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-amber-700 focus:outline-hidden"
            >
              <option value="">{t.allCities}</option>
              {Array.from(new Set([...FEATURED_CITIES, ...availableStoreCities])).map((city) => (
                <option key={city} value={city}>
                  {lang === 'ur' ? `${getCityUrduName(city)} (${city})` : city}
                </option>
              ))}
            </select>
          </div>

          {/* Province Dropdown */}
          <div className="md:col-span-2">
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-amber-700 focus:outline-hidden"
            >
              <option value="All">{t.allProvinces}</option>
              {PAKISTAN_PROVINCES.map((prov) => (
                <option key={prov.id} value={prov.nameEn}>
                  {lang === 'ur' ? prov.nameUr : prov.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Business Type Dropdown */}
          <div className="md:col-span-3 flex items-center gap-2">
            <select
              value={selectedBusinessType}
              onChange={(e) => setSelectedBusinessType(e.target.value as 'All' | StoreBusinessType)}
              className="flex-1 px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-amber-700 focus:outline-hidden"
            >
              <option value="All">{t.allTypes}</option>
              {STORE_BUSINESS_TYPES.map((bt) => (
                <option key={bt.value} value={bt.value}>
                  {lang === 'ur' ? `${bt.labelUr} (${bt.labelEn})` : bt.labelEn}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer"
            >
              {t.resetFilters}
            </button>
          </div>
        </div>

        {/* City Quick Jump Chips + Verified Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-stone-500 mr-1">
              {lang === 'ur' ? 'مشہور شہر:' : 'Major Cities:'}
            </span>
            {FEATURED_CITIES.map((city) => {
              const isActive = normalizeSearchText(selectedCity) === normalizeSearchText(city);
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => handleCitySelect(isActive ? '' : city)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-stone-900 text-amber-200'
                      : 'bg-stone-100 text-stone-700 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  {lang === 'ur' ? getCityUrduName(city) : city}
                </button>
              );
            })}
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-bold text-stone-700 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 accent-emerald-700 rounded"
            />
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{t.verifiedOnlyLabel}</span>
          </label>
        </div>
      </div>

      {/* Main Split Workspace: Interactive Pakistan Map + Store Directory List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Store List Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-700">
              {lang === 'ur'
                ? `${filteredStores.length} سٹورز دستیاب ہیں`
                : `Showing ${filteredStores.length} Authorized ${filteredStores.length === 1 ? 'Store' : 'Stores'}`}
            </span>
            {userLocation && (
              <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-lg border border-sky-200">
                {lang === 'ur' ? 'فاصلے کے مطابق ترتیب' : 'Sorted by nearest distance'}
              </span>
            )}
          </div>

          {filteredStores.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">{t.noStoresTitle}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{t.noStoresDesc}</p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {publicStores.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-stone-900 text-amber-200 text-xs font-bold rounded-xl cursor-pointer"
                  >
                    {lang === 'ur' ? 'تمام سٹورز دیکھیں' : 'Show All Registered Stores'}
                  </button>
                )}
                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => setActiveTab('account')}
                    className="px-4 py-2 bg-amber-100 text-amber-900 text-xs font-bold rounded-xl hover:bg-amber-200 cursor-pointer"
                  >
                    {lang === 'ur' ? 'ڈسٹری بیوٹر سٹور رجسٹر کریں' : 'Register as Distributor'}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {filteredStores.map(({ store, distanceKm }) => {
                const isSelected = selectedStore?.id === store.id;
                return (
                  <div
                    key={store.id}
                    onClick={() => {
                      setSelectedStore(store);
                      if (store.latitude && store.longitude) {
                        setCameraTarget({
                          lat: store.latitude,
                          lng: store.longitude,
                          zoom: 14,
                          key: Date.now(),
                        });
                      }
                    }}
                    className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-amber-700 ring-2 ring-amber-500/20 shadow-md'
                        : 'border-stone-200 hover:border-amber-400 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {store.photos?.[0] ? (
                          <img
                            src={store.photos[0]}
                            alt={store.name}
                            className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-100"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-center justify-center shrink-0">
                            <Building2 className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h3 className="font-serif text-sm font-bold text-stone-900 truncate">{store.name}</h3>
                            {store.isVerified && (
                              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                <ShieldCheck className="w-3 h-3" />
                                {lang === 'ur' ? 'تصدیق شدہ' : 'Verified'}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-semibold text-amber-800 mt-0.5">
                            {store.businessType} • {lang === 'ur' ? getCityUrduName(store.city) : store.city},{' '}
                            {lang === 'ur' ? getProvinceUrduName(store.province) : store.province}
                          </p>
                          <p className="text-[11px] text-stone-500 line-clamp-2 mt-1">{store.address}</p>
                        </div>
                      </div>

                      {distanceKm !== null && (
                        <span className="px-2 py-1 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-[10px] font-bold shrink-0">
                          {distanceKm} km
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        {store.businessHours || '10:00 AM - 9:00 PM'}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenStoreModal(store);
                        }}
                        className="text-amber-900 font-bold hover:underline cursor-pointer"
                      >
                        {lang === 'ur' ? 'مکمل تفصیلات دیکھیں ←' : 'View Full Details →'}
                      </button>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${store.phone}`}
                        className="py-1.5 px-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3 text-amber-700" />
                        <span>{lang === 'ur' ? 'کال' : 'Call'}</span>
                      </a>
                      <a
                        href={formatWhatsAppHref(store.whatsapp || store.phone, store.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                      <a
                        href={getStoreDirectionsUrl(store)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>{lang === 'ur' ? 'راستہ' : 'Directions'}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyAddress(store)}
                        className="py-1.5 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-200 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedStoreId === store.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedStoreId === store.id ? (lang === 'ur' ? 'کاپی' : 'Copied') : lang === 'ur' ? 'کاپی' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Interactive Pakistan Map Column */}
        <div className="lg:col-span-7 lg:sticky lg:top-24">
          <StoreMap
            stores={filteredStores.map((item) => item.store)}
            selectedStore={selectedStore}
            onSelectStore={setSelectedStore}
            onOpenStoreDetails={handleOpenStoreModal}
            userLocation={userLocation}
            cameraTarget={cameraTarget}
            language={lang}
            heightClassName="h-[440px] lg:h-[600px]"
          />
        </div>
      </div>

      {/* Store Full Details Modal */}
      {detailStore && (
        <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200"
            dir={lang === 'ur' ? 'rtl' : 'ltr'}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-white truncate">{detailStore.name}</h2>
                    {detailStore.isVerified && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" />
                        {lang === 'ur' ? 'تصدیق شدہ DENON سٹور' : 'Verified DENON Store'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300">
                    {detailStore.businessType} • {detailStore.city}, {detailStore.province}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDetailStore(null)}
                className="p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Store Photo Gallery */}
              {detailStore.photos && detailStore.photos.length > 0 && (
                <div className="space-y-2.5">
                  <div className="h-64 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100">
                    <img
                      src={detailStore.photos[activePhotoIdx] || detailStore.photos[0]}
                      alt={detailStore.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {detailStore.photos.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {detailStore.photos.map((photo, idx) => (
                        <button
                          key={`${photo}-${idx}`}
                          type="button"
                          onClick={() => setActivePhotoIdx(idx)}
                          className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 cursor-pointer ${
                            activePhotoIdx === idx ? 'border-amber-700' : 'border-stone-200 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-200 pb-1.5">
                    {lang === 'ur' ? 'سٹور اور مالک کی معلومات' : 'Store & Owner Details'}
                  </h4>
                  <p className="flex items-center gap-2 text-stone-700">
                    <User className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>{lang === 'ur' ? 'مالک:' : 'Owner:'}</strong> {detailStore.ownerName || 'Authorized Partner'}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-stone-700">
                    <Building2 className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>{lang === 'ur' ? 'کاروباری قسم:' : 'Business Type:'}</strong> {detailStore.businessType}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-stone-700">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>{lang === 'ur' ? 'اوقاتِ کار:' : 'Hours:'}</strong> {detailStore.businessHours || '10:00 AM - 9:00 PM'}
                    </span>
                  </p>
                  <p className="flex items-start gap-2 text-stone-700">
                    <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong>{lang === 'ur' ? 'مکمل پتہ:' : 'Address:'}</strong> {detailStore.address}, {detailStore.city},{' '}
                      {detailStore.province}
                    </span>
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-200 pb-1.5">
                    {lang === 'ur' ? 'رابطہ اور گوگل میپس لوکیشن' : 'Contact & Google Maps Location'}
                  </h4>
                  <p className="flex items-center gap-2 text-stone-700">
                    <Phone className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>{lang === 'ur' ? 'فون:' : 'Phone:'}</strong> {detailStore.phone}
                    </span>
                  </p>
                  <p className="flex items-center gap-2 text-stone-700">
                    <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>
                      <strong>WhatsApp:</strong> {detailStore.whatsapp || detailStore.phone}
                    </span>
                  </p>
                  {detailStore.email && (
                    <p className="flex items-center gap-2 text-stone-700">
                      <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>
                        <strong>{lang === 'ur' ? 'ای میل:' : 'Email:'}</strong> {detailStore.email}
                      </span>
                    </p>
                  )}
                  <p className="flex items-center gap-2 text-stone-700">
                    <Globe className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>
                      <strong>Coordinates:</strong> {detailStore.latitude.toFixed(5)}, {detailStore.longitude.toFixed(5)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Available DENON Products */}
              <div className="space-y-3">
                <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'ur' ? 'دستیاب DENON مصنوعات' : 'Available DENON Products at This Store'}</span>
                </h4>
                {!detailStore.availableProducts || detailStore.availableProducts.length === 0 ? (
                  <p className="text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    {lang === 'ur'
                      ? 'اس سٹور پر تمام دستیاب DENON مصنوعات کی تصدیق کے لیے کال یا واٹس ایپ پر رابطہ کریں۔'
                      : 'Contact store via Phone or WhatsApp to confirm specific DENON stock availability.'}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {detailStore.availableProducts.map((itemName) => {
                      const matchedProd = products.find(
                        (p) => p.id === itemName || p.name.toLowerCase() === itemName.toLowerCase()
                      );
                      return (
                        <div
                          key={itemName}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-amber-50/50 border border-amber-200/80"
                        >
                          {matchedProd?.image ? (
                            <img
                              src={matchedProd.image}
                              alt={matchedProd.name}
                              className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                              <Sparkles className="w-4 h-4" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-stone-900 truncate">
                              {matchedProd ? matchedProd.name : itemName}
                            </p>
                            {matchedProd && (
                              <p className="text-[11px] text-amber-800 font-semibold">
                                PKR {matchedProd.salePrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-stone-200">
                <a
                  href={`tel:${detailStore.phone}`}
                  className="py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-900 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Phone className="w-4 h-4 text-amber-700" />
                  <span>{lang === 'ur' ? 'کال کریں' : 'Call Store'}</span>
                </a>

                <a
                  href={formatWhatsAppHref(detailStore.whatsapp || detailStore.phone, detailStore.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={getStoreDirectionsUrl(detailStore)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Navigation className="w-4 h-4" />
                  <span>{lang === 'ur' ? 'راستہ حاصل کریں' : 'Get Directions'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => handleCopyAddress(detailStore)}
                  className="py-3 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedStoreId === detailStore.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copiedStoreId === detailStore.id ? (lang === 'ur' ? 'کاپی ہوگیا' : 'Address Copied') : lang === 'ur' ? 'پتہ کاپی کریں' : 'Copy Address'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
