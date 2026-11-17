import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Upload,
  Download,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Clock,
  Store,
  AlertCircle,
} from 'lucide-react';
import { StoreLocation, Product, StoreBusinessType, StoreApprovalStatus, AuditLog } from '../types';
import { StoreFormModal } from './StoreFormModal';
import {
  PAKISTAN_PROVINCES,
  STORE_BUSINESS_TYPES,
  findCityMatch,
  parseGoogleMapsUrl,
  getStoreDirectionsUrl,
  normalizeSearchText,
} from '../data/pakistanCities';
import { addAuditLog } from '../services/api';

interface AdminStoreLocatorModuleProps {
  stores: StoreLocation[];
  onSaveStores: (nextStores: StoreLocation[]) => Promise<StoreLocation[]> | void;
  products: Product[];
  selectedRole: string;
  onAuditLogAdded?: (logs: AuditLog[]) => void;
}

export const AdminStoreLocatorModule: React.FC<AdminStoreLocatorModuleProps> = ({
  stores,
  onSaveStores,
  products,
  selectedRole,
  onAuditLogAdded,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [approvalFilter, setApprovalFilter] = useState<'All' | StoreApprovalStatus>('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreLocation | null>(null);
  const [statusBanner, setStatusBanner] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    stores.forEach((s) => {
      if (s.city?.trim()) set.add(s.city.trim());
    });
    return Array.from(set).sort();
  }, [stores]);

  const stats = useMemo(() => {
    return {
      total: stores.length,
      approvedActive: stores.filter((s) => s.isActive !== false && s.approvalStatus === 'Approved').length,
      verified: stores.filter((s) => s.isVerified).length,
      pending: stores.filter((s) => s.approvalStatus === 'Pending').length,
    };
  }, [stores]);

  const filteredStores = useMemo(() => {
    return stores.filter((s) => {
      if (cityFilter !== 'All' && normalizeSearchText(s.city) !== normalizeSearchText(cityFilter)) return false;
      if (provinceFilter !== 'All' && normalizeSearchText(s.province) !== normalizeSearchText(provinceFilter)) return false;
      if (typeFilter !== 'All' && s.businessType !== typeFilter) return false;
      if (approvalFilter !== 'All' && s.approvalStatus !== approvalFilter) return false;
      if (searchQuery.trim()) {
        const q = normalizeSearchText(searchQuery);
        const hay = `${s.name} ${s.ownerName} ${s.city} ${s.province} ${s.address} ${s.phone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [stores, cityFilter, provinceFilter, typeFilter, approvalFilter, searchQuery]);

  const recordLog = (action: string, details: string) => {
    const logs = addAuditLog({
      adminUser: `${selectedRole} (Admin)`,
      action,
      category: 'Settings',
      ipAddress: 'Admin Portal',
      details,
    });
    if (onAuditLogAdded) onAuditLogAdded(logs);
  };

  const handleSaveStoreFromModal = async (store: StoreLocation) => {
    const exists = stores.some((s) => s.id === store.id);
    const next = exists ? stores.map((s) => (s.id === store.id ? store : s)) : [store, ...stores];
    await onSaveStores(next);
    recordLog(exists ? 'Updated Store Location' : 'Added Store Location', `${store.name} (${store.city})`);
    setStatusBanner({
      type: 'success',
      text: exists ? `Updated "${store.name}" and synced live.` : `Added "${store.name}" and synced live.`,
    });
  };

  const handleDeleteStore = async (store: StoreLocation) => {
    const next = stores.filter((s) => s.id !== store.id);
    await onSaveStores(next);
    recordLog('Deleted Store Location', `${store.name} (${store.city})`);
    setStatusBanner({ type: 'success', text: `Deleted "${store.name}".` });
  };

  const handleQuickUpdate = async (
    store: StoreLocation,
    patch: Partial<StoreLocation>,
    logAction: string
  ) => {
    const next = stores.map((s) =>
      s.id === store.id ? { ...s, ...patch, updatedAt: new Date().toISOString() } : s
    );
    await onSaveStores(next);
    recordLog(logAction, `${store.name} (${store.city})`);
  };

  // Download sample CSV template for Bulk Import
  const handleDownloadTemplate = () => {
    const headers = [
      'name',
      'ownerName',
      'businessType',
      'address',
      'city',
      'province',
      'phone',
      'whatsapp',
      'email',
      'businessHours',
      'googleMapsUrl',
      'latitude',
      'longitude',
      'availableProducts',
      'isVerified',
      'isActive',
    ];
    const sampleNote = [
      'Example Shop Name',
      'Owner Full Name',
      'Cosmetics Shop',
      'Shop 12 Main Market',
      'Lahore',
      'Punjab',
      '03001234567',
      '03001234567',
      'shop@example.com',
      '10:00 AM - 9:00 PM',
      'https://www.google.com/maps/@31.5204,74.3587,16z',
      '31.5204',
      '74.3587',
      'Denon Rice Water Brightening Face Wash; Denon Beauty Cream',
      'true',
      'true',
    ];
    const csv = `${headers.join(',')}\n${sampleNote.map((v) => `"${v}"`).join(',')}\n`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'denon-stores-import-template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Excel (.xlsx/.xls) and CSV Bulk Import
  const handleBulkImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatusBanner(null);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(firstSheet, { defval: '' });

      if (!rows || rows.length === 0) {
        setStatusBanner({ type: 'error', text: 'The uploaded Excel/CSV file is empty.' });
        return;
      }

      const validTypes = new Set<string>(STORE_BUSINESS_TYPES.map((b) => b.value));
      const imported: StoreLocation[] = [];

      rows.forEach((raw, idx) => {
        const getField = (keys: string[]) => {
          for (const k of keys) {
            const matchKey = Object.keys(raw).find((rk) => rk.trim().toLowerCase() === k.toLowerCase());
            if (matchKey && String(raw[matchKey]).trim() !== '') {
              return String(raw[matchKey]).trim();
            }
          }
          return '';
        };

        const name = getField(['name', 'store name', 'shop name']);
        const city = getField(['city']);
        const address = getField(['address', 'full address']);
        if (!name || !city || !address) return;

        const ownerName = getField(['ownerName', 'owner', 'owner name']) || 'Authorized Partner';
        const rawType = getField(['businessType', 'type', 'business type']);
        const businessType: StoreBusinessType = validTypes.has(rawType)
          ? (rawType as StoreBusinessType)
          : 'Cosmetics Shop';

        const cityMeta = findCityMatch(city);
        const province = getField(['province']) || cityMeta?.province || 'Punjab';
        const phone = getField(['phone', 'mobile']) || '03000000000';
        const whatsapp = getField(['whatsapp']) || phone;
        const email = getField(['email']);
        const businessHours = getField(['businessHours', 'hours']) || '10:00 AM - 9:00 PM';
        const googleMapsUrl = getField(['googleMapsUrl', 'maps url', 'google maps link']);

        let lat = parseFloat(getField(['latitude', 'lat']));
        let lng = parseFloat(getField(['longitude', 'lng', 'lon']));

        if ((Number.isNaN(lat) || Number.isNaN(lng)) && googleMapsUrl) {
          const parsed = parseGoogleMapsUrl(googleMapsUrl);
          if (parsed) {
            lat = parsed.lat;
            lng = parsed.lng;
          }
        }
        if ((Number.isNaN(lat) || Number.isNaN(lng)) && cityMeta) {
          lat = cityMeta.lat;
          lng = cityMeta.lng;
        }
        if (Number.isNaN(lat) || Number.isNaN(lng)) {
          lat = 30.3753;
          lng = 69.3451;
        }

        const rawProducts = getField(['availableProducts', 'products']);
        const availableProducts = rawProducts
          ? rawProducts.split(/[;,|]/).map((p) => p.trim()).filter(Boolean)
          : [];

        const isVerifiedVal = getField(['isVerified', 'verified']).toLowerCase();
        const isActiveVal = getField(['isActive', 'active']).toLowerCase();

        imported.push({
          id: `store-imp-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
          name,
          ownerName,
          businessType,
          address,
          city: cityMeta?.nameEn || city,
          province,
          phone,
          whatsapp,
          email,
          photos: [],
          availableProducts,
          businessHours,
          googleMapsUrl:
            googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
          latitude: lat,
          longitude: lng,
          isVerified: isVerifiedVal === 'true' || isVerifiedVal === 'yes' || isVerifiedVal === '1',
          isActive: isActiveVal !== 'false' && isActiveVal !== 'no' && isActiveVal !== '0',
          approvalStatus: 'Approved',
          submittedBy: 'bulk-import',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      });

      if (imported.length === 0) {
        setStatusBanner({
          type: 'error',
          text: 'No valid stores found in file. Ensure columns include "name", "city", and "address".',
        });
        return;
      }

      const next = [...imported, ...stores];
      await onSaveStores(next);
      recordLog('Bulk Imported Stores', `Imported ${imported.length} stores from ${file.name}`);
      setStatusBanner({
        type: 'success',
        text: `Successfully imported ${imported.length} stores and synced to database.`,
      });
    } catch (err: any) {
      setStatusBanner({ type: 'error', text: err?.message || 'Failed to parse Excel/CSV file.' });
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Row */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-amber-800">
            PAKISTAN SMART STORE LOCATOR CONTROL
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
            Stores, Pharmacies & Distributors Management
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Add real DENON stores, drop exact pins on Google Maps, verify outlets, approve distributor submissions, or bulk import via Excel/CSV.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownloadTemplate}
            className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>CSV Template</span>
          </button>

          <label className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Bulk Import (Excel/CSV)</span>
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleBulkImportFile}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={() => {
              setEditingStore(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-amber-200 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Store</span>
          </button>
        </div>
      </div>

      {/* Status Notice */}
      {statusBanner && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-3 ${
            statusBanner.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <span className="flex items-center gap-2">
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            {statusBanner.text}
          </span>
          <button onClick={() => setStatusBanner(null)} className="text-xs underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Total Stores</span>
          <p className="font-serif text-2xl font-extrabold text-stone-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-emerald-700 uppercase">Live Approved</span>
          <p className="font-serif text-2xl font-extrabold text-emerald-800 mt-1">{stats.approvedActive}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-stone-200">
          <span className="text-[11px] font-bold text-amber-800 uppercase">Verified Badges</span>
          <p className="font-serif text-2xl font-extrabold text-amber-900 mt-1">{stats.verified}</p>
        </div>
        <div
          onClick={() => setApprovalFilter(approvalFilter === 'Pending' ? 'All' : 'Pending')}
          className="bg-white p-4 rounded-2xl border border-stone-200 cursor-pointer hover:border-amber-500 transition-colors"
        >
          <span className="text-[11px] font-bold text-sky-700 uppercase">Pending Approvals</span>
          <p className="font-serif text-2xl font-extrabold text-sky-800 mt-1">{stats.pending}</p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search name, owner, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl"
          />
        </div>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
        >
          <option value="All">All Cities ({uniqueCities.length})</option>
          {uniqueCities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={provinceFilter}
          onChange={(e) => setProvinceFilter(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
        >
          <option value="All">All Provinces</option>
          {PAKISTAN_PROVINCES.map((p) => (
            <option key={p.id} value={p.nameEn}>
              {p.nameEn}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
        >
          <option value="All">All Business Types</option>
          {STORE_BUSINESS_TYPES.map((bt) => (
            <option key={bt.value} value={bt.value}>
              {bt.labelEn}
            </option>
          ))}
        </select>

        <select
          value={approvalFilter}
          onChange={(e) => setApprovalFilter(e.target.value as 'All' | StoreApprovalStatus)}
          className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-semibold"
        >
          <option value="All">All Approval Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending ({stats.pending})</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Stores Table / List */}
      {filteredStores.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-900">
            {stores.length === 0 ? 'No Stores Added Yet' : 'No Matching Stores Found'}
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            {stores.length === 0
              ? 'Your Pakistan Store Locator starts completely clean with zero demo stores. Click "Add New Store" or upload an Excel/CSV file to add your real authorized shops and distributors.'
              : 'Try adjusting your search query or filters.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-start gap-4 min-w-0">
                {store.photos?.[0] ? (
                  <img
                    src={store.photos[0]}
                    alt={store.name}
                    className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                )}

                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-serif text-base font-bold text-stone-900">{store.name}</h4>
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-800 text-[10px] font-bold">
                      {store.businessType}
                    </span>
                    {store.isVerified && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        store.approvalStatus === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : store.approvalStatus === 'Pending'
                            ? 'bg-sky-50 text-sky-700 border border-sky-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {store.approvalStatus}
                    </span>
                    {store.isActive === false && (
                      <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[10px] font-bold">
                        Hidden / Inactive
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-stone-700">
                    <strong>Owner:</strong> {store.ownerName} • <strong>Location:</strong> {store.city},{' '}
                    {store.province}
                  </p>
                  <p className="text-[11px] text-stone-500">{store.address}</p>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500">
                    <span>Phone: {store.phone}</span>
                    <span>• Pin: {store.latitude.toFixed(4)}, {store.longitude.toFixed(4)}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {store.businessHours}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 text-xs">
                {store.approvalStatus !== 'Approved' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickUpdate(
                        store,
                        { approvalStatus: 'Approved', isActive: true },
                        'Approved Store Listing'
                      )
                    }
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {store.approvalStatus === 'Pending' && (
                  <button
                    type="button"
                    onClick={() =>
                      handleQuickUpdate(store, { approvalStatus: 'Rejected' }, 'Rejected Store Listing')
                    }
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleQuickUpdate(
                      store,
                      { isVerified: !store.isVerified },
                      store.isVerified ? 'Unverified Store' : 'Verified Store'
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 cursor-pointer ${
                    store.isVerified
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{store.isVerified ? 'Verified' : 'Verify'}</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleQuickUpdate(
                      store,
                      { isActive: !(store.isActive !== false) },
                      store.isActive !== false ? 'Deactivated Store' : 'Activated Store'
                    )
                  }
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1 cursor-pointer"
                >
                  {store.isActive !== false ? (
                    <ToggleRight className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <ToggleLeft className="w-4 h-4 text-stone-400" />
                  )}
                  <span>{store.isActive !== false ? 'Active' : 'Inactive'}</span>
                </button>

                <a
                  href={getStoreDirectionsUrl(store)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setEditingStore(store);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl cursor-pointer"
                  title="Edit Store"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteStore(store)}
                  className="p-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl cursor-pointer"
                  title="Delete Store"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Store Modal */}
      <StoreFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStore(null);
        }}
        onSave={handleSaveStoreFromModal}
        initialStore={editingStore}
        products={products}
        mode="admin"
      />
    </div>
  );
};
