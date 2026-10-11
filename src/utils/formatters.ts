import { DollItem, LedgerEntry, LedgerSummary } from '../types';

/**
 * 确保金额严格保留至两位小数
 */
export function roundToTwoDecimals(value: number | string | null | undefined): number {
  if (value === null || value === undefined || value === '') return 0;
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 0;
  return Math.round(num * 100) / 100;
}

/**
 * 格式化货币展示，例如 ¥ 1,250.00
 */
export function formatCurrency(value: number | null | undefined, showSymbol: boolean = true): string {
  const num = roundToTwoDecimals(value);
  const formatted = num.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `¥ ${formatted}` : formatted;
}

/**
 * 获取当前日期的 YYYY-MM-DD 字符串
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 从娃物列表自动生成账目明细（Ledger Entries）和汇总数据（Summary）
 * 规则：
 * 1. 全款模式：
 *    - 全款金额（若 > 0）：计入总计花费 (expense)，类别“全款”
 *    - 邮费金额（若 > 0）：计入总计花费 (expense)，类别“邮费”
 * 2. 定金模式：
 *    - 定金金额（若 > 0）：计入总计花费 (expense)，类别“定金”
 *    - 尾款金额（若 > 0）：
 *        如果状态是 'pending_final' (待付尾款)，则计入 待支付 (pending)，类别“待付尾款”
 *        若状态不是待付尾款 (如已拥有、待发货、已转卖)，则视为已付尾款，计入 总计花费 (expense)，类别“已付尾款”
 *    - 邮费金额（若 > 0）：计入总计花费 (expense)，类别“邮费”
 * 3. 转卖回血：
 *    - 若 isResold 且 resaleAmount > 0：计入 总计回血 (resale)，类别“转卖回血”
 * 
 * *特别注意*：娃柜里的 cabinetPrice 和 cabinetQuantity 纯展示用，不计入账本数据。
 */
export function extractLedgerData(items: DollItem[]): {
  entries: LedgerEntry[];
  summary: LedgerSummary;
} {
  const entries: LedgerEntry[] = [];
  let totalSpent = 0;
  let totalRecovered = 0;
  let pendingPayment = 0;

  for (const item of items) {
    if (item.paymentMode === 'full') {
      // 1. 全款金额
      const fullAmt = roundToTwoDecimals(item.fullAmount);
      if (fullAmt > 0) {
        entries.push({
          id: `${item.id}-full`,
          itemId: item.id,
          itemName: item.name,
          itemTag: item.tag,
          itemPhotoUrl: item.photoUrl,
          type: 'expense',
          category: '全款',
          amount: fullAmt,
          date: item.fullDate || item.createdAt.slice(0, 10),
          status: item.status,
          note: item.notes,
        });
        totalSpent += fullAmt;
      }

      // 2. 全款模式邮费
      const fullPost = roundToTwoDecimals(item.fullPostage);
      if (fullPost > 0) {
        entries.push({
          id: `${item.id}-full-postage`,
          itemId: item.id,
          itemName: item.name,
          itemTag: item.tag,
          itemPhotoUrl: item.photoUrl,
          type: 'expense',
          category: '邮费',
          amount: fullPost,
          date: item.fullPostageDate || item.fullDate || item.createdAt.slice(0, 10),
          status: item.status,
          note: '全款配套邮费',
        });
        totalSpent += fullPost;
      }
    } else {
      // 定金模式
      // 1. 定金金额
      const depAmt = roundToTwoDecimals(item.depositAmount);
      if (depAmt > 0) {
        entries.push({
          id: `${item.id}-deposit`,
          itemId: item.id,
          itemName: item.name,
          itemTag: item.tag,
          itemPhotoUrl: item.photoUrl,
          type: 'expense',
          category: '定金',
          amount: depAmt,
          date: item.depositDate || item.createdAt.slice(0, 10),
          status: item.status,
          note: item.notes,
        });
        totalSpent += depAmt;
      }

      // 2. 尾款金额
      const finAmt = roundToTwoDecimals(item.finalAmount);
      if (finAmt > 0) {
        if (item.status === 'pending_final') {
          // 待付尾款
          entries.push({
            id: `${item.id}-final-pending`,
            itemId: item.id,
            itemName: item.name,
            itemTag: item.tag,
            itemPhotoUrl: item.photoUrl,
            type: 'pending',
            category: '待付尾款',
            amount: finAmt,
            date: item.finalDate || '待通知',
            status: item.status,
            note: '尚未结清尾款',
          });
          pendingPayment += finAmt;
        } else {
          // 已支付尾款
          entries.push({
            id: `${item.id}-final-paid`,
            itemId: item.id,
            itemName: item.name,
            itemTag: item.tag,
            itemPhotoUrl: item.photoUrl,
            type: 'expense',
            category: '已付尾款',
            amount: finAmt,
            date: item.finalDate || item.createdAt.slice(0, 10),
            status: item.status,
            note: '尾款已结清',
          });
          totalSpent += finAmt;
        }
      }

      // 3. 定金模式邮费
      const depPost = roundToTwoDecimals(item.depositPostage);
      if (depPost > 0) {
        entries.push({
          id: `${item.id}-deposit-postage`,
          itemId: item.id,
          itemName: item.name,
          itemTag: item.tag,
          itemPhotoUrl: item.photoUrl,
          type: 'expense',
          category: '邮费',
          amount: depPost,
          date: item.depositPostageDate || item.depositDate || item.createdAt.slice(0, 10),
          status: item.status,
          note: '定尾配套邮费',
        });
        totalSpent += depPost;
      }
    }

    // 4. 转卖回血
    if (item.isResold) {
      const resAmt = roundToTwoDecimals(item.resaleAmount);
      if (resAmt > 0) {
        entries.push({
          id: `${item.id}-resale`,
          itemId: item.id,
          itemName: item.name,
          itemTag: item.tag,
          itemPhotoUrl: item.photoUrl,
          type: 'resale',
          category: '转卖回血',
          amount: resAmt,
          date: item.resaleDate || item.updatedAt.slice(0, 10),
          status: item.status,
          note: '已转卖回血款',
        });
        totalRecovered += resAmt;
      }
    }
  }

  // 排序：最新的日期优先
  entries.sort((a, b) => {
    return (b.date || '').localeCompare(a.date || '');
  });

  return {
    entries,
    summary: {
      totalSpent: roundToTwoDecimals(totalSpent),
      totalRecovered: roundToTwoDecimals(totalRecovered),
      pendingPayment: roundToTwoDecimals(pendingPayment),
      netBalance: roundToTwoDecimals(totalSpent - totalRecovered),
    },
  };
}

/**
 * 计算单个娃物的已付总额与真实财务汇总
 */
export function calculateItemFinance(item: DollItem): {
  paidTotal: number;
  unpaidTotal: number;
  resaleAmount: number;
  netCost: number;
} {
  let paidTotal = 0;
  let unpaidTotal = 0;

  if (item.paymentMode === 'full') {
    paidTotal += roundToTwoDecimals(item.fullAmount);
    paidTotal += roundToTwoDecimals(item.fullPostage);
  } else {
    paidTotal += roundToTwoDecimals(item.depositAmount);
    paidTotal += roundToTwoDecimals(item.depositPostage);
    if (item.status === 'pending_final') {
      unpaidTotal += roundToTwoDecimals(item.finalAmount);
    } else {
      paidTotal += roundToTwoDecimals(item.finalAmount);
    }
  }

  const resaleAmount = item.isResold ? roundToTwoDecimals(item.resaleAmount) : 0;
  const netCost = roundToTwoDecimals(paidTotal - resaleAmount);

  return {
    paidTotal,
    unpaidTotal,
    resaleAmount,
    netCost,
  };
}
