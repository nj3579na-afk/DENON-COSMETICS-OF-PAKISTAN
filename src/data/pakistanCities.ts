import { StoreBusinessType, StoreLocation } from '../types';

export interface PakistanProvince {
  id: string;
  nameEn: string;
  nameUr: string;
}

export interface PakistanCity {
  nameEn: string;
  nameUr: string;
  province: string;
  lat: number;
  lng: number;
  aliases?: string[];
}

export const PAKISTAN_CENTER = { lat: 30.3753, lng: 69.3451 };
export const PAKISTAN_DEFAULT_ZOOM = 6;

export const PAKISTAN_PROVINCES: PakistanProvince[] = [
  { id: 'Punjab', nameEn: 'Punjab', nameUr: 'پنجاب' },
  { id: 'Sindh', nameEn: 'Sindh', nameUr: 'سندھ' },
  { id: 'Khyber Pakhtunkhwa', nameEn: 'Khyber Pakhtunkhwa', nameUr: 'خیبر پختونخوا' },
  { id: 'Balochistan', nameEn: 'Balochistan', nameUr: 'بلوچستان' },
  { id: 'Islamabad Capital Territory', nameEn: 'Islamabad Capital Territory', nameUr: 'وفاقی دارالحکومت اسلام آباد' },
  { id: 'Azad Jammu & Kashmir', nameEn: 'Azad Jammu & Kashmir', nameUr: 'آزاد جموں و کشمیر' },
  { id: 'Gilgit-Baltistan', nameEn: 'Gilgit-Baltistan', nameUr: 'گلگت بلتستان' },
];

export const STORE_BUSINESS_TYPES: {
  value: StoreBusinessType;
  labelEn: string;
  labelUr: string;
}[] = [
  { value: 'Pharmacy', labelEn: 'Pharmacy', labelUr: 'فارمیسی' },
  { value: 'Cosmetics Shop', labelEn: 'Cosmetics Shop', labelUr: 'کاسمیٹکس شاپ' },
  { value: 'Retailer', labelEn: 'Retailer', labelUr: 'ریٹیلر' },
  { value: 'Wholesaler', labelEn: 'Wholesaler', labelUr: 'ہول سیلر' },
  { value: 'Distributor', labelEn: 'Distributor', labelUr: 'ڈسٹری بیوٹر' },
];

export const PAKISTAN_CITIES: PakistanCity[] = [
  { nameEn: 'Peshawar', nameUr: 'پشاور', province: 'Khyber Pakhtunkhwa', lat: 34.0151, lng: 71.5249, aliases: ['peshawer', 'پشاور'] },
  { nameEn: 'Lahore', nameUr: 'لاہور', province: 'Punjab', lat: 31.5204, lng: 74.3587, aliases: ['lhr', 'لاہور'] },
  { nameEn: 'Karachi', nameUr: 'کراچی', province: 'Sindh', lat: 24.8607, lng: 67.0011, aliases: ['khi', 'کراچی'] },
  { nameEn: 'Islamabad', nameUr: 'اسلام آباد', province: 'Islamabad Capital Territory', lat: 33.6844, lng: 73.0479, aliases: ['isb', 'اسلام اباد'] },
  { nameEn: 'Rawalpindi', nameUr: 'راولپنڈی', province: 'Punjab', lat: 33.5651, lng: 73.0169, aliases: ['pindi', 'rwp', 'راولپنڈی'] },
  { nameEn: 'Quetta', nameUr: 'کوئٹہ', province: 'Balochistan', lat: 30.1798, lng: 66.9750, aliases: ['کوئٹہ'] },
  { nameEn: 'Multan', nameUr: 'ملتان', province: 'Punjab', lat: 30.1575, lng: 71.5249, aliases: ['ملتان'] },
  { nameEn: 'Faisalabad', nameUr: 'فیصل آباد', province: 'Punjab', lat: 31.4504, lng: 73.1350, aliases: ['fsd', 'lyallpur', 'فیصل اباد'] },
  { nameEn: 'Sialkot', nameUr: 'سیالکوٹ', province: 'Punjab', lat: 32.4945, lng: 74.5229, aliases: ['سیالکوٹ'] },
  { nameEn: 'Gujranwala', nameUr: 'گوجرانوالہ', province: 'Punjab', lat: 32.1877, lng: 74.1945, aliases: ['گوجرانوالہ'] },
  { nameEn: 'Hyderabad', nameUr: 'حیدرآباد', province: 'Sindh', lat: 25.3960, lng: 68.3578, aliases: ['حیدرآباد', 'حیدراباد'] },
  { nameEn: 'Abbottabad', nameUr: 'ایبٹ آباد', province: 'Khyber Pakhtunkhwa', lat: 34.1688, lng: 73.2215, aliases: ['ایبٹ اباد'] },
  { nameEn: 'Mardan', nameUr: 'مردان', province: 'Khyber Pakhtunkhwa', lat: 34.1989, lng: 72.0231, aliases: ['مردان'] },
  { nameEn: 'Swat', nameUr: 'سوات', province: 'Khyber Pakhtunkhwa', lat: 34.7717, lng: 72.3602, aliases: ['mingora', 'مینگورہ', 'سوات'] },
  { nameEn: 'Bahawalpur', nameUr: 'بہاولپور', province: 'Punjab', lat: 29.3544, lng: 71.6911, aliases: ['بہاولپور'] },
  { nameEn: 'Sargodha', nameUr: 'سرگودھا', province: 'Punjab', lat: 32.0740, lng: 72.6861, aliases: ['سرگودھا'] },
  { nameEn: 'Sukkur', nameUr: 'سکھر', province: 'Sindh', lat: 27.7052, lng: 68.8574, aliases: ['سکھر'] },
  { nameEn: 'Mirpur', nameUr: 'میرپور', province: 'Azad Jammu & Kashmir', lat: 33.1480, lng: 73.7518, aliases: ['میرپور'] },
  { nameEn: 'Muzaffarabad', nameUr: 'مظفرآباد', province: 'Azad Jammu & Kashmir', lat: 34.3700, lng: 73.4711, aliases: ['مظفر اباد'] },
  { nameEn: 'Gilgit', nameUr: 'گلگت', province: 'Gilgit-Baltistan', lat: 35.9208, lng: 74.3089, aliases: ['گلگت'] },
  { nameEn: 'Dera Ismail Khan', nameUr: 'ڈیرہ اسماعیل خان', province: 'Khyber Pakhtunkhwa', lat: 31.8326, lng: 70.9024, aliases: ['di khan', 'ڈی آئی خان'] },
  { nameEn: 'Kohat', nameUr: 'کوہاٹ', province: 'Khyber Pakhtunkhwa', lat: 33.5889, lng: 71.4429, aliases: ['کوہاٹ'] },
  { nameEn: 'Bannu', nameUr: 'بنوں', province: 'Khyber Pakhtunkhwa', lat: 32.9889, lng: 70.6056, aliases: ['بنوں'] },
  { nameEn: 'Nowshera', nameUr: 'نوشہرہ', province: 'Khyber Pakhtunkhwa', lat: 34.0158, lng: 71.9747, aliases: ['نوشہرہ'] },
  { nameEn: 'Swabi', nameUr: 'صوابی', province: 'Khyber Pakhtunkhwa', lat: 34.1202, lng: 72.4698, aliases: ['صوابی'] },
  { nameEn: 'Charsadda', nameUr: 'چارسدہ', province: 'Khyber Pakhtunkhwa', lat: 34.1453, lng: 71.7308, aliases: ['چارسدہ'] },
  { nameEn: 'Gwadar', nameUr: 'گوادر', province: 'Balochistan', lat: 25.1216, lng: 62.3254, aliases: ['گوادر'] },
  { nameEn: 'Larkana', nameUr: 'لاڑکانہ', province: 'Sindh', lat: 27.5570, lng: 68.2028, aliases: ['لاڑکانہ'] },
  { nameEn: 'Gujrat', nameUr: 'گجرات', province: 'Punjab', lat: 32.5731, lng: 74.0750, aliases: ['گجرات'] },
  { nameEn: 'Rahim Yar Khan', nameUr: 'رحیم یار خان', province: 'Punjab', lat: 28.4212, lng: 70.2989, aliases: ['ryk', 'رحیم یار خان'] },
  { nameEn: 'Sahiwal', nameUr: 'ساہیوال', province: 'Punjab', lat: 30.6682, lng: 73.1114, aliases: ['ساہیوال'] },
  { nameEn: 'Jhelum', nameUr: 'جہلم', province: 'Punjab', lat: 32.9425, lng: 73.7257, aliases: ['جہلم'] },
  { nameEn: 'Wah Cantt', nameUr: 'واہ کینٹ', province: 'Punjab', lat: 33.7715, lng: 72.7511, aliases: ['واہ کینٹ'] },
  { nameEn: 'Sheikhupura', nameUr: 'شیخوپورہ', province: 'Punjab', lat: 31.7167, lng: 73.9850, aliases: ['شیخوپورہ'] },
  { nameEn: 'Jhang', nameUr: 'جھنگ', province: 'Punjab', lat: 31.2781, lng: 72.3317, aliases: ['جھنگ'] },
  { nameEn: 'Kasur', nameUr: 'قصور', province: 'Punjab', lat: 31.1179, lng: 74.4408, aliases: ['قصور'] },
  { nameEn: 'Okara', nameUr: 'اوکاڑہ', province: 'Punjab', lat: 30.8090, lng: 73.4508, aliases: ['اوکاڑہ'] },
  { nameEn: 'Attock', nameUr: 'اٹک', province: 'Punjab', lat: 33.7667, lng: 72.3667, aliases: ['اٹک'] },
  { nameEn: 'Chakwal', nameUr: 'چکوال', province: 'Punjab', lat: 32.9328, lng: 72.8630, aliases: ['چکوال'] },
];

export function normalizeSearchText(value: string): string {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/آ/g, 'ا')
    .replace(/أ|إ/g, 'ا')
    .replace(/ى/g, 'ی')
    .replace(/ة/g, 'ہ');
}

export function findCityMatch(query: string): PakistanCity | null {
  const clean = normalizeSearchText(query);
  if (!clean) return null;

  // Exact match first
  const exact = PAKISTAN_CITIES.find(
    (c) =>
      normalizeSearchText(c.nameEn) === clean ||
      normalizeSearchText(c.nameUr) === clean ||
      c.aliases?.some((a) => normalizeSearchText(a) === clean)
  );
  if (exact) return exact;

  // Partial prefix or contains match
  return (
    PAKISTAN_CITIES.find(
      (c) =>
        normalizeSearchText(c.nameEn).includes(clean) ||
        normalizeSearchText(c.nameUr).includes(clean) ||
        c.aliases?.some((a) => normalizeSearchText(a).includes(clean))
    ) || null
  );
}

export function getCityUrduName(cityName: string): string {
  const matched = findCityMatch(cityName);
  return matched ? matched.nameUr : cityName;
}

export function getProvinceUrduName(provinceName: string): string {
  const matched = PAKISTAN_PROVINCES.find(
    (p) => normalizeSearchText(p.nameEn) === normalizeSearchText(provinceName)
  );
  return matched ? matched.nameUr : provinceName;
}

/**
 * Matches a store against a free-text query in either English or Urdu
 * (matching store name, city EN/UR, province EN/UR, address, owner, business type EN/UR).
 */
export function storeMatchesQuery(store: StoreLocation, rawQuery: string): boolean {
  const q = normalizeSearchText(rawQuery);
  if (!q) return true;

  const cityMeta = findCityMatch(store.city);
  const provUr = getProvinceUrduName(store.province);
  const bTypeMeta = STORE_BUSINESS_TYPES.find((b) => b.value === store.businessType);

  const haystack = [
    store.name,
    store.ownerName,
    store.address,
    store.city,
    cityMeta?.nameUr || '',
    ...(cityMeta?.aliases || []),
    store.province,
    provUr,
    store.businessType,
    bTypeMeta?.labelUr || '',
  ]
    .map(normalizeSearchText)
    .join(' ');

  if (haystack.includes(q)) return true;

  // Also check if user typed an Urdu/alias city name matching store.city
  const queryCity = findCityMatch(rawQuery);
  if (queryCity && normalizeSearchText(store.city) === normalizeSearchText(queryCity.nameEn)) {
    return true;
  }

  return false;
}

/**
 * Parses coordinates from Google Maps URLs or plain "lat, lng" pairs.
 * Supports @lat,lng, ?q=lat,lng, ll=lat,lng, query=lat,lng, !3dlat!4dlng.
 */
export function parseGoogleMapsUrl(input: string): { lat: number; lng: number } | null {
  const raw = (input || '').trim();
  if (!raw) return null;

  const patterns = [
    /@(-?\d+\.\d+),(-?\d+\.\d+)/,
    /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/,
    /[?&](?:q|ll|query|center)=(-?\d+\.\d+)(?:,|%2C)(-?\d+\.\d+)/i,
    /^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/,
  ];

  for (const regex of patterns) {
    const match = raw.match(regex);
    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) };
      }
    }
  }

  return null;
}

/**
 * Haversine great-circle distance in kilometers.
 */
export function calculateDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export function getStoreDirectionsUrl(store: Pick<StoreLocation, 'latitude' | 'longitude' | 'googleMapsUrl' | 'name' | 'address' | 'city' | 'province'>): string {
  if (typeof store.latitude === 'number' && typeof store.longitude === 'number' && store.latitude !== 0 && store.longitude !== 0) {
    return `https://www.google.com/maps/dir/?api=1&destination=${store.latitude},${store.longitude}`;
  }
  if (store.googleMapsUrl && (store.googleMapsUrl.startsWith('http://') || store.googleMapsUrl.startsWith('https://'))) {
    return store.googleMapsUrl;
  }
  const query = [store.name, store.address, store.city, store.province, 'Pakistan'].filter(Boolean).join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
