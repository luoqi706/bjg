import { DollItem } from '../types';

const STORAGE_KEY = 'bjd_cabinet_ledger_items_v1';
const TAGS_STORAGE_KEY = 'bjd_cabinet_ledger_tags_v1';

export const DEFAULT_TAGS: string[] = [
  '整娃',
  '娃头',
  '娃衣',
  '假发',
  '眼珠',
  '鞋靴',
  '配件',
  '素体',
  '妆面',
  '道具',
  '其他',
];

export function getStoredTags(): string[] {
  try {
    const raw = localStorage.getItem(TAGS_STORAGE_KEY);
    if (!raw) return DEFAULT_TAGS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    return DEFAULT_TAGS;
  } catch {
    return DEFAULT_TAGS;
  }
}

export function saveStoredTags(tags: string[]): void {
  try {
    localStorage.setItem(TAGS_STORAGE_KEY, JSON.stringify(tags));
  } catch (e) {
    console.error(e);
  }
}

// 预设精致的SVG占位图或数据URI，具有柔和莫兰迪色系与BJD主题
export const PRESET_AVATARS: { id: string; label: string; svgData: string }[] = [
  {
    id: 'doll-head',
    label: '白肌娃头',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23E7EBE7"/><circle cx="100" cy="85" r="46" fill="%23F7EFE9"/><ellipse cx="100" cy="88" rx="42" ry="46" fill="%23FFF9F5"/><path d="M78 80 Q88 77 94 82" stroke="%237D6E66" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M122 80 Q112 77 106 82" stroke="%237D6E66" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="86" cy="87" r="7" fill="%23556B5A"/><circle cx="114" cy="87" r="7" fill="%23556B5A"/><circle cx="88" cy="85" r="2.5" fill="%23FFFFFF"/><circle cx="116" cy="85" r="2.5" fill="%23FFFFFF"/><path d="M100 92 L98 99 Q100 100 102 99 Z" fill="%23E8C1B5"/><path d="M94 109 Q100 114 106 109" stroke="%23C2796D" stroke-width="2.5" fill="none" stroke-linecap="round"/><ellipse cx="78" cy="98" rx="8" ry="4" fill="%23EBB3A6" opacity="0.45"/><ellipse cx="122" cy="98" rx="8" ry="4" fill="%23EBB3A6" opacity="0.45"/><path d="M62 70 Q100 35 138 70 Q125 45 100 45 Q75 45 62 70 Z" fill="%23B8A89A"/><path d="M88 132 L100 156 L112 132 Z" fill="%23DCD7D2"/></svg>`,
  },
  {
    id: 'doll-dress',
    label: '宫廷娃衣',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23EFECE7"/><path d="M82 45 L118 45 L132 85 L116 90 L100 65 L84 90 L68 85 Z" fill="%237D9684"/><path d="M84 90 L116 90 L146 160 Q100 172 54 160 Z" fill="%2368816F"/><path d="M100 90 L100 165" stroke="%23D8E2DA" stroke-width="1.5" stroke-dasharray="3,3"/><path d="M82 45 Q100 56 118 45" stroke="%23F4EFEA" stroke-width="4" fill="none"/><circle cx="100" cy="102" r="3" fill="%23E8C98B"/><circle cx="100" cy="118" r="3" fill="%23E8C98B"/><circle cx="100" cy="134" r="3" fill="%23E8C98B"/></svg>`,
  },
  {
    id: 'doll-eyes',
    label: '手作眼珠',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23EAEFF0"/><ellipse cx="100" cy="100" rx="60" ry="60" fill="%23F8FBFB" stroke="%23D0D8D9" stroke-width="2"/><circle cx="100" cy="100" r="34" fill="%234A6B5B"/><circle cx="100" cy="100" r="22" fill="%232D483B"/><circle cx="100" cy="100" r="12" fill="%2317261F"/><circle cx="93" cy="92" r="8" fill="%23FFFFFF" opacity="0.85"/><circle cx="108" cy="108" r="3.5" fill="%23FFFFFF" opacity="0.6"/></svg>`,
  },
  {
    id: 'doll-wig',
    label: '银灰假发',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23F2EFEF"/><path d="M60 120 C50 60 150 60 140 120 C145 155 130 165 125 140 C120 100 110 80 100 80 C90 80 80 100 75 140 C70 165 55 155 60 120 Z" fill="%239EA5A0"/><path d="M78 80 C88 95 95 125 92 155" stroke="%237D8580" stroke-width="2" fill="none"/><path d="M122 80 C112 95 105 125 108 155" stroke="%237D8580" stroke-width="2" fill="none"/></svg>`,
  },
  {
    id: 'doll-shoes',
    label: '复古皮鞋',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><rect width="200" height="200" fill="%23ECEAE6"/><path d="M50 125 C50 110 65 100 95 100 L115 100 C145 100 160 115 160 135 C160 148 145 150 100 150 L60 150 C50 150 50 138 50 125 Z" fill="%237A5B4C"/><path d="M52 142 L158 142 L158 148 L52 148 Z" fill="%234A352A"/><rect x="85" y="94" width="25" height="12" rx="3" fill="%23CCA462"/></svg>`,
  },
];

const INITIAL_ITEMS: DollItem[] = [
  {
    id: 'bjd-item-01',
    name: 'Souldoll - 纯白修女整娃 [月光巡礼]',
    tag: '整娃',
    photoUrl: PRESET_AVATARS[0].svgData,
    status: 'owned',
    paymentMode: 'full',
    fullAmount: 4280.00,
    fullDate: '2026-03-12',
    fullPostage: 45.00,
    fullPostageDate: '2026-03-12',
    depositAmount: null,
    depositDate: '',
    finalAmount: null,
    finalDate: '',
    depositPostage: null,
    depositPostageDate: '',
    isResold: false,
    resaleAmount: null,
    resaleDate: '',
    notes: '含官方修女妆面、眼珠及全套礼服配件，关节手已安装铝线防滑。',
    brand: 'Souldoll',
    material: '进口高白树脂',
    size: '1/3 女体 (62cm)',
    color: '白肌',
    channel: '官方通贩直购',
    cabinetPrice: 4280.00,
    cabinetQuantity: 1,
    createdAt: '2026-03-12T10:00:00.000Z',
    updatedAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'bjd-item-02',
    name: 'Volks - 经典伊丽莎白娃头 [茶会特别妆]',
    tag: '娃头',
    photoUrl: PRESET_AVATARS[0].svgData,
    status: 'pending_final',
    paymentMode: 'deposit',
    fullAmount: null,
    fullDate: '',
    fullPostage: null,
    fullPostageDate: '',
    depositAmount: 850.00,
    depositDate: '2026-02-18',
    finalAmount: 1800.00,
    finalDate: '2026-11-20',
    depositPostage: 25.00,
    depositPostageDate: '2026-02-18',
    isResold: false,
    resaleAmount: null,
    resaleDate: '',
    notes: '日本特约妆师私养面绘，预计11月下旬截单通知补尾款后顺丰发货。',
    brand: 'Volks',
    material: '树脂',
    size: '1/3 普头',
    color: '粉白肌',
    channel: '日本代购',
    cabinetPrice: 2650.00,
    cabinetQuantity: 1,
    createdAt: '2026-02-18T14:30:00.000Z',
    updatedAt: '2026-02-18T14:30:00.000Z',
  },
  {
    id: 'bjd-item-03',
    name: 'Sadol - 雾灰格纹呢子风衣套装',
    tag: '娃衣',
    photoUrl: PRESET_AVATARS[1].svgData,
    status: 'pending_shipment',
    paymentMode: 'full',
    fullAmount: 620.00,
    fullDate: '2026-04-05',
    fullPostage: 18.00,
    fullPostageDate: '2026-04-05',
    depositAmount: null,
    depositDate: '',
    finalAmount: null,
    finalDate: '',
    depositPostage: null,
    depositPostageDate: '',
    isResold: false,
    resaleAmount: null,
    resaleDate: '',
    notes: '五件套包含呢子大衣、马甲、衬衫、西裤及金属怀表链，已全款排单等出货。',
    brand: 'Sadol',
    material: '精纺羊毛呢 / 金属配饰',
    size: '1/3 叔体 (72cm)',
    color: '冷灰格纹',
    channel: 'DP展会官方预售',
    cabinetPrice: 620.00,
    cabinetQuantity: 1,
    createdAt: '2026-04-05T09:15:00.000Z',
    updatedAt: '2026-04-05T09:15:00.000Z',
  },
  {
    id: 'bjd-item-04',
    name: 'MoonlightEyes - 极光翡翠手作玻璃树脂眼',
    tag: '眼珠',
    photoUrl: PRESET_AVATARS[2].svgData,
    status: 'owned',
    paymentMode: 'full',
    fullAmount: 260.00,
    fullDate: '2026-05-10',
    fullPostage: 12.00,
    fullPostageDate: '2026-05-10',
    depositAmount: null,
    depositDate: '',
    finalAmount: null,
    finalDate: '',
    depositPostage: null,
    depositPostageDate: '',
    isResold: false,
    resaleAmount: null,
    resaleDate: '',
    notes: '14mm小虹膜，深绿偏翠色微光流转，反光非常灵动有神。',
    brand: 'MoonlightEyes',
    material: '高透UV树脂 / 水晶',
    size: '14/5 mm',
    color: '极光翡翠绿',
    channel: '手作作者定做',
    cabinetPrice: 260.00,
    cabinetQuantity: 1,
    createdAt: '2026-05-10T16:20:00.000Z',
    updatedAt: '2026-05-10T16:20:00.000Z',
  },
  {
    id: 'bjd-item-05',
    name: 'Luts - 复古高领羊绒毛衣',
    tag: '娃衣',
    photoUrl: PRESET_AVATARS[1].svgData,
    status: 'resold',
    paymentMode: 'full',
    fullAmount: 320.00,
    fullDate: '2026-01-15',
    fullPostage: 15.00,
    fullPostageDate: '2026-01-15',
    depositAmount: null,
    depositDate: '',
    finalAmount: null,
    finalDate: '',
    depositPostage: null,
    depositPostageDate: '',
    isResold: true,
    resaleAmount: 380.00,
    resaleDate: '2026-06-20',
    notes: '闲鱼转出给同好，状态完好，小赚出坑回血。',
    brand: 'Luts',
    material: '细羊绒混纺',
    size: '1/4',
    color: '燕麦米白',
    channel: '二手鱼塘收回',
    cabinetPrice: 320.00,
    cabinetQuantity: 1,
    createdAt: '2026-01-15T11:00:00.000Z',
    updatedAt: '2026-06-20T17:40:00.000Z',
  },
];

export function getStoredItems(): DollItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
      return INITIAL_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_ITEMS;
  } catch (err) {
    console.error('Failed to load items from localStorage:', err);
    return INITIAL_ITEMS;
  }
}

export function saveStoredItems(items: DollItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save items to localStorage:', err);
  }
}

export function resetStoredItems(): DollItem[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ITEMS;
}

export function exportDataAsJSON(items: DollItem[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `bjd-closet-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
