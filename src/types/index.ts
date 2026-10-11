export type ItemStatus = 'owned' | 'pending_final' | 'pending_shipment' | 'resold';

export type PaymentMode = 'full' | 'deposit';

export type DollTag = 
  | '整娃'
  | '娃头'
  | '娃衣'
  | '假发'
  | '眼珠'
  | '鞋靴'
  | '配件'
  | '素体'
  | '妆面'
  | '道具'
  | '其他';

export interface DollItem {
  id: string;
  name: string;
  tag: string;
  photoUrl: string;
  status: ItemStatus;
  
  // 支付方式
  paymentMode: PaymentMode;
  
  // 全款模式 (2行4项)
  fullAmount: number | null;
  fullDate: string;
  fullPostage: number | null;
  fullPostageDate: string;
  
  // 定金模式 (3行6项)
  depositAmount: number | null;
  depositDate: string;
  finalAmount: number | null;
  finalDate: string;
  depositPostage: number | null;
  depositPostageDate: string;
  
  // 是否转卖
  isResold: boolean;
  resaleAmount: number | null;
  resaleDate: string;
  
  // 自定义备注
  notes: string;
  
  // 娃柜专属独立信息 (只展示在娃柜，不计入真实账本)
  brand?: string;              // 品牌/作者 (在材质之前)
  material: string;
  size: string;
  color: string;
  channel: string;
  cabinetPrice: number | null; // 显示在娃柜里的价格
  cabinetQuantity: number;     // 显示在娃柜里的数量
  
  createdAt: string;
  updatedAt: string;
}

export type LedgerEntryType = 'expense' | 'resale' | 'pending';

export type LedgerCategory = 
  | '全款' 
  | '定金' 
  | '已付尾款' 
  | '待付尾款' 
  | '邮费' 
  | '转卖回血';

export interface LedgerEntry {
  id: string;
  itemId: string;
  itemName: string;
  itemTag: string;
  itemPhotoUrl: string;
  type: LedgerEntryType; // expense (总花费), resale (总回血), pending (待支付)
  category: LedgerCategory;
  amount: number;
  date: string;
  status: ItemStatus;
  note?: string;
}

export interface LedgerSummary {
  totalSpent: number;     // 总计花费
  totalRecovered: number; // 总计回血
  pendingPayment: number; // 待支付
  netBalance: number;     // 净支出 (总计花费 - 总计回血)
}
