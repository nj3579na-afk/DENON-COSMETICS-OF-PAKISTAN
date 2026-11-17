import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Upload,
  Plus,
  Trash2,
  Link2,
  CheckCircle2,
  ShieldCheck,
  Store,
  Loader2,
  Package,
} from 'lucide-react';
import { StoreLocation, StoreBusinessType, StoreApprovalStatus, Product } from '../types';
import { StoreMap, CameraTarget } from './StoreMap';
import {
  PAKISTAN_CITIES,
  PAKISTAN_PROVINCES,
  STORE_BUSINESS_TYPES,
  findCityMatch,
  parseGoogleMapsUrl,
} from '../data/pakistanCities';
import { uploadImageToSupabase } from '../lib/supabase';

interface StoreFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (store: StoreLocation) => Promise<void> | void;
  initialStore?: StoreLocation | null;
  products: Product[];
  mode: 'admin' | 'distributor';
  distributorEmail?: string;
}

export const StoreFormModal: React.FC<StoreFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialStore,
  products,
  mode,
  distributorEmail,
}) => {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [businessType, setBusinessType] = useState<StoreBusinessType>('Cosmetics Shop');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [province, setProvince] = useState('Punjab');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [businessHours, setBusinessHours] = useState('10:00 AM - 9:00 PM (Mon - Sat)');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [latitude, setLatitude] = useState<number>(31.5204);
  const [longitude, setLongitude] = useState<number>(74.3587);
  const [photos, setPhotos] = useState<string[]>([]);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const [availableProducts, setAvailableProducts] = useState<string[]>([]);
  const [customProductInput, setCustomProductInput] = useState('');

  // Admin-only status controls
  const [isVerified, setIsVerified] = useState<boolean>(mode === 'admin');
  const [isActive, setIsActive] = useState<boolean>(true);
  const [approvalStatus, setApprovalStatus] = useState<StoreApprovalStatus>(
    mode === 'admin' ? 'Approved' : 'Pending'
  );

  const [cameraTarget, setCameraTarget] = useState<CameraTarget | null>(null);
  const [urlParseMessage, setUrlParseMessage] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormError('');
    setUrlParseMessage('');

    if (initialStore) {
      setName(initialStore.name || '');
      setOwnerName(initialStore.ownerName || '');
      setBusinessType(initialStore.businessType || 'Cosmetics Shop');
      setAddress(initialStore.address || '');
      setCity(initialStore.city || 'Lahore');
      setProvince(initialStore.province || 'Punjab');
      setPhone(initialStore.phone || '');
      setWhatsapp(initialStore.whatsapp || '');
      setEmail(initialStore.email || '');
      setBusinessHours(initialStore.businessHours || '10:00 AM - 9:00 PM');
      setGoogleMapsUrl(initialStore.googleMapsUrl || '');
      setLatitude(initialStore.latitude || 31.5204);
      setLongitude(initialStore.longitude || 74.3587);
      setPhotos(Array.isArray(initialStore.photos) ? initialStore.photos : []);
      setAvailableProducts(
        Array.isArray(initialStore.availableProducts) ? initialStore.availableProducts : []
      );
      setIsVerified(mode === 'admin' ? Boolean(initialStore.isVerified) : false);
      setIsActive(mode === 'admin' ? initialStore.isActive !== false : true);
      setApprovalStatus(mode === 'admin' ? initialStore.approvalStatus || 'Approved' : 'Pending');

      if (initialStore.latitude && initialStore.longitude) {
        setCameraTarget({
          lat: initialStore.latitude,
          lng: initialStore.longitude,
          zoom: 14,
          key: Date.now(),
        });
      }
    } else {
      setName('');
      setOwnerName('');
      setBusinessType(mode === 'distributor' ? 'Distributor' : 'Cosmetics Shop');
      setAddress('');
      setCity('Lahore');
      setProvince('Punjab');
      setPhone('');
      setWhatsapp('');
      setEmail(distributorEmail || '');
      setBusinessHours('10:00 AM - 9:00 PM');
      setGoogleMapsUrl('');
      setLatitude(31.5204);
      setLongitude(74.3587);
      setPhotos([]);
      setAvailableProducts([]);
      setIsVerified(mode === 'admin');
      setIsActive(true);
      setApprovalStatus(mode === 'admin' ? 'Approved' : 'Pending');
      setCameraTarget({ lat: 31.5204, lng: 74.3587, zoom: 11, key: Date.now() });
    }
  }, [isOpen, initialStore, mode, distributorEmail]);

  if (!isOpen) return null;

  const handleCityInputChange = (val: string) => {
    setCity(val);
    const matched = findCityMatch(val);
    if (matched) {
      setProvince(matched.province);
      if (!googleMapsUrl.trim()) {
        setLatitude(matched.lat);
        setLongitude(matched.lng);
      }
      setCameraTarget({ lat: matched.lat, lng: matched.lng, zoom: 12, key: Date.now() });
    }
  };

  const handleMapsUrlChange = (val: string) => {
    setGoogleMapsUrl(val);
    setUrlParseMessage('');
    const parsed = parseGoogleMapsUrl(val);
    if (parsed) {
      setLatitude(parsed.lat);
      setLongitude(parsed.lng);
      setCameraTarget({ lat: parsed.lat, lng: parsed.lng, zoom: 15, key: Date.now() });
      setUrlParseMessage(`Coordinates detected: ${parsed.lat}, ${parsed.lng}`);
    }
  };

  const handleExtractUrlClick = () => {
    const parsed = parseGoogleMapsUrl(googleMapsUrl);
    if (parsed) {
      setLatitude(parsed.lat);
      setLongitude(parsed.lng);
      setCameraTarget({ lat: parsed.lat, lng: parsed.lng, zoom: 15, key: Date.now() });
      setUrlParseMessage(`Extracted pin coordinates: ${parsed.lat}, ${parsed.lng}`);
    } else {
      setUrlParseMessage(
        'Could not detect lat/lng in that URL. Click directly on the map below to place the exact pin.'
      );
    }
  };

  const handlePhotoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;
    const files: File[] = Array.from(fileList);
    setIsUploadingPhoto(true);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        const cdnUrl = await uploadImageToSupabase(file, `store_photo`);
        uploaded.push(cdnUrl);
      }
      setPhotos((prev) => [...prev, ...uploaded]);
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  const handleAddPhotoUrl = () => {
    const clean = photoUrlInput.trim();
    if (!clean) return;
    setPhotos((prev) => [...prev, clean]);
    setPhotoUrlInput('');
  };

  const handleToggleProduct = (productName: string) => {
    setAvailableProducts((prev) =>
      prev.includes(productName) ? prev.filter((p) => p !== productName) : [...prev, productName]
    );
  };

  const handleAddCustomProduct = () => {
    const clean = customProductInput.trim();
    if (!clean || availableProducts.includes(clean)) return;
    setAvailableProducts((prev) => [...prev, clean]);
    setCustomProductInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !ownerName.trim() || !address.trim() || !city.trim() || !phone.trim()) {
      setFormError('Please fill in Store Name, Owner Name, Phone, City, and Full Address.');
      return;
    }

    if (Number.isNaN(latitude) || Number.isNaN(longitude) || (latitude === 0 && longitude === 0)) {
      setFormError('Please pick a location on the interactive map or paste a valid Google Maps URL.');
      return;
    }

    setIsSaving(true);
    try {
      const cleanCity = findCityMatch(city)?.nameEn || city.trim();
      const storePayload: StoreLocation = {
        id: initialStore?.id || `store-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: name.trim(),
        ownerName: ownerName.trim(),
        businessType,
        address: address.trim(),
        city: cleanCity,
        province: province.trim() || 'Punjab',
        phone: phone.trim(),
        whatsapp: (whatsapp || phone).trim(),
        email: email.trim(),
        photos,
        availableProducts,
        businessHours: businessHours.trim() || '10:00 AM - 9:00 PM',
        googleMapsUrl:
          googleMapsUrl.trim() ||
          `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
        latitude: Number(latitude),
        longitude: Number(longitude),
        isVerified: mode === 'admin' ? isVerified : false,
        isActive: mode === 'admin' ? isActive : true,
        approvalStatus: mode === 'admin' ? approvalStatus : 'Pending',
        submittedBy:
          mode === 'distributor'
            ? distributorEmail || initialStore?.submittedBy
            : initialStore?.submittedBy || 'admin',
        createdAt: initialStore?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await onSave(storePayload);
      onClose();
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save store details.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        <div className="sticky top-0 z-10 bg-stone-900 text-stone-100 px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-800 text-amber-100 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {initialStore
                  ? 'Edit Registered Store'
                  : mode === 'admin'
                    ? 'Add New DENON Store / Distributor'
                    : 'Submit Your Store / Distributor Listing'}
              </h3>
              <p className="text-[11px] text-stone-300">
                {mode === 'admin'
                  ? 'Full Admin control: pin exact location on map, upload photos & publish live.'
                  : 'Submissions require Admin approval before appearing on the public Pakistan Store Locator.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs">
          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 font-semibold">
              {formError}
            </div>
          )}

          {/* Basic Business Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Store / Shop Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Al-Madina Cosmetics & Pharmacy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Owner / Contact Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Haji Muhammad Tariq"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Business Type *</label>
              <select
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value as StoreBusinessType)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-semibold focus:ring-1 focus:ring-amber-700"
              >
                {STORE_BUSINESS_TYPES.map((bt) => (
                  <option key={bt.value} value={bt.value}>
                    {bt.labelEn} ({bt.labelUr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location Text Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">City (English or اردو) *</label>
              <input
                type="text"
                required
                list="store-form-cities"
                placeholder="e.g. Peshawar, Lahore, Karachi"
                value={city}
                onChange={(e) => handleCityInputChange(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
              />
              <datalist id="store-form-cities">
                {PAKISTAN_CITIES.map((c) => (
                  <option key={c.nameEn} value={c.nameEn}>
                    {c.nameEn} ({c.nameUr})
                  </option>
                ))}
              </datalist>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Province / Territory *</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl font-semibold focus:ring-1 focus:ring-amber-700"
              >
                {PAKISTAN_PROVINCES.map((p) => (
                  <option key={p.id} value={p.nameEn}>
                    {p.nameEn} ({p.nameUr})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Business Hours</label>
              <input
                type="text"
                placeholder="e.g. 10:00 AM - 10:00 PM (Mon-Sat)"
                value={businessHours}
                onChange={(e) => setBusinessHours(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Full Street Address *</label>
            <input
              type="text"
              required
              placeholder="Shop #, Market / Plaza Name, Main Road, Sector..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
            />
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Phone Number *</label>
              <input
                type="text"
                required
                placeholder="0300 1234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">WhatsApp Number</label>
              <input
                type="text"
                placeholder="0300 1234567"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Email Address (Optional)</label>
              <input
                type="email"
                placeholder="store@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
              />
            </div>
          </div>

          {/* TWO-WAY MAP PIN SELECTION */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-700" />
                  <span>Exact Google Maps Pin Location (2 Methods)</span>
                </h4>
                <p className="text-[11px] text-stone-500">
                  Method 1: Paste a Google Maps URL. Method 2: Click directly on the interactive map below to drop/move the pin.
                </p>
              </div>
              <span className="font-mono text-[11px] bg-white px-2.5 py-1 rounded-lg border border-stone-200 font-bold text-stone-800">
                {latitude.toFixed(5)}, {longitude.toFixed(5)}
              </span>
            </div>

            {/* Method 1: Google Maps URL */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Link2 className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Paste Google Maps URL (e.g. https://www.google.com/maps/@31.5204,74.3587,17z)"
                  value={googleMapsUrl}
                  onChange={(e) => handleMapsUrlChange(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-700"
                />
              </div>
              <button
                type="button"
                onClick={handleExtractUrlClick}
                className="px-4 py-2 bg-stone-900 text-amber-200 rounded-xl font-bold hover:bg-stone-800 shrink-0 cursor-pointer"
              >
                Extract Coordinates
              </button>
            </div>

            {urlParseMessage && (
              <p className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                {urlParseMessage}
              </p>
            )}

            {/* Manual Precision Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Latitude</label>
                <input
                  type="number"
                  step="any"
                  value={latitude}
                  onChange={(e) => {
                    const nextLat = parseFloat(e.target.value) || 0;
                    setLatitude(nextLat);
                    setCameraTarget({ lat: nextLat, lng: longitude, zoom: 14, key: Date.now() });
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Longitude</label>
                <input
                  type="number"
                  step="any"
                  value={longitude}
                  onChange={(e) => {
                    const nextLng = parseFloat(e.target.value) || 0;
                    setLongitude(nextLng);
                    setCameraTarget({ lat: latitude, lng: nextLng, zoom: 14, key: Date.now() });
                  }}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg font-mono"
                />
              </div>
            </div>

            {/* Method 2: Interactive Pin Picker Map */}
            <StoreMap
              pickerMode={true}
              pickedCoords={{ lat: latitude, lng: longitude }}
              cameraTarget={cameraTarget}
              onPickLocation={(lat, lng) => {
                setLatitude(lat);
                setLongitude(lng);
                setUrlParseMessage(`Pin placed on map: ${lat}, ${lng}`);
              }}
              heightClassName="h-[300px]"
            />
          </div>

          {/* Store Photos Upload */}
          <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="font-serif text-sm font-bold text-stone-900">Store Photos (Uploaded to Cloud Storage)</h4>
              <label className="px-3.5 py-2 bg-stone-900 text-amber-200 rounded-xl font-bold hover:bg-stone-800 cursor-pointer inline-flex items-center gap-1.5">
                {isUploadingPhoto ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Store Photos'}</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Or paste an image URL (https://...)"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white border border-stone-300 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="px-3.5 py-2 bg-amber-100 text-amber-900 rounded-xl font-bold hover:bg-amber-200 inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add URL</span>
              </button>
            </div>

            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-1">
                {photos.map((url, idx) => (
                  <div key={`${url}-${idx}`} className="relative group rounded-xl overflow-hidden border border-stone-200 aspect-square bg-white">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-90 hover:opacity-100 cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available DENON Products */}
          <div className="space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <h4 className="font-serif text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <Package className="w-4 h-4 text-amber-700" />
              <span>Available DENON Products at This Store</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
              {products.map((prod) => {
                const checked = availableProducts.includes(prod.name);
                return (
                  <label
                    key={prod.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                      checked
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleProduct(prod.name)}
                      className="accent-amber-700"
                    />
                    <span className="truncate text-[11px]">{prod.name}</span>
                  </label>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add another DENON product name..."
                value={customProductInput}
                onChange={(e) => setCustomProductInput(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-stone-300 rounded-xl"
              />
              <button
                type="button"
                onClick={handleAddCustomProduct}
                className="px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-900 rounded-xl font-bold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Admin Status Controls */}
          {mode === 'admin' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-stone-900">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-stone-900"
                />
                <span>Active on Store Locator</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer font-bold text-emerald-900">
                <input
                  type="checkbox"
                  checked={isVerified}
                  onChange={(e) => setIsVerified(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700"
                />
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Verified Store Badge</span>
              </label>

              <div>
                <select
                  value={approvalStatus}
                  onChange={(e) => setApprovalStatus(e.target.value as StoreApprovalStatus)}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-bold text-stone-900"
                >
                  <option value="Approved">Status: Approved (Live)</option>
                  <option value="Pending">Status: Pending Review</option>
                  <option value="Rejected">Status: Rejected</option>
                </select>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isUploadingPhoto}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-xl font-bold shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              <span>
                {isSaving
                  ? 'Saving Store...'
                  : mode === 'admin'
                    ? 'Save & Sync Store'
                    : 'Submit for Admin Approval'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
