import React, { useState, useMemo } from 'react';
import { PieChart, X, CheckCircle2, Clock } from 'lucide-react';
import { DollItem, LedgerEntry, LedgerEntryType } from '../types';
import { formatCurrency, extractLedgerData, getTodayDateString } from '../utils/formatters';

interface LedgerViewProps {
  items: DollItem[];
  onUpdateItem: (item: DollItem) => void;
  onSelectItem: (item: DollItem) => void;
  onEditItem: (item: DollItem) => void;
}

// 辅助函数：获取Tag对应简写单字
function getTagChar(rawTag: string): string {
  const tag = (rawTag || '').replace(/^BJD\s*[\/\-]\s*/i, '');
  if (!tag) return '娃';
  if (tag.includes('假发') || tag.includes('毛')) return '假';
  if (tag.includes('妆')) return '约';
  if (tag.includes('衣') || tag.includes('服')) return '衣';
  if (tag.includes('头')) return '头';
  if (tag.includes('眼')) return '眼';
  if (tag.includes('鞋')) return '鞋';
  if (tag.includes('体')) return '体';
  if (tag.includes('配')) return '配';
  if (tag.includes('道')) return '道';
  if (tag.includes('杂') || tag.includes('其')) return '杂';
  return tag.charAt(0);
}

export const LedgerView: React.FC<LedgerViewProps> = ({
  items,
  onUpdateItem,
  onSelectItem,
  onEditItem,
}) => {
  const { entries, summary } = useMemo(() => extractLedgerData(items), [items]);

  // 筛选类型：全部 | 花销 (expense) | 回血 (resale) | 待付尾款 (pending)
  const [activeFilter, setActiveFilter] = useState<'all' | LedgerEntryType>('all');
  
  // 财务统计弹窗状态
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // 按 Tag 统计支出构成
  const tagStats = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    entries.filter((e) => e.type === 'expense').forEach((e) => {
      if (!map[e.itemTag]) {
        map[e.itemTag] = { total: 0, count: 0 };
      }
      map[e.itemTag].total += e.amount;
      map[e.itemTag].count += 1;
    });

    const list = Object.entries(map).map(([tag, data]) => ({
      tag,
      total: data.total,
      count: data.count,
      percent: summary.totalSpent > 0 ? (data.total / summary.totalSpent) * 100 : 0,
    }));

    return list.sort((a, b) => b.total - a.total);
  }, [entries, summary.totalSpent]);

  // 待付尾款清单
  const pendingFinalItems = useMemo(() => {
    return items.filter((i) => i.status === 'pending_final' && (i.finalAmount || 0) > 0);
  }, [items]);

  // 筛选后的条目
  const filteredEntries = useMemo(() => {
    if (activeFilter === 'all') return entries;
    return entries.filter((e) => e.type === activeFilter);
  }, [entries, activeFilter]);

  // 按日期归类账本明细
  const groupedEntries = useMemo(() => {
    const groups: { date: string; list: LedgerEntry[] }[] = [];
    const map: Record<string, LedgerEntry[]> = {};

    filteredEntries.forEach((e) => {
      const d = e.date || '未注明日期';
      if (!map[d]) {
        map[d] = [];
      }
      map[d].push(e);
    });

    const sortedDates = Object.keys(map).sort((a, b) => b.localeCompare(a));
    sortedDates.forEach((date) => {
      groups.push({ date, list: map[date] });
    });

    return groups;
  }, [filteredEntries]);

  // 点击结清按钮：直接跳转到该物品的信息编辑页面
  const handlePayFinal = (e: React.MouseEvent, entry: LedgerEntry) => {
    e.stopPropagation();
    const targetItem = items.find((i) => i.id === entry.itemId);
    if (!targetItem) return;
    onEditItem(targetItem);
  };

  const handlePayFinalFromModal = (item: DollItem) => {
    setIsStatsModalOpen(false);
    onEditItem(item);
  };

  return (
    <div className="space-y-3 pb-16">
      {/* 
        第一行：3个横向抬头（总计花费、总计回血、待付尾款）
        彻底优化宽度与字体大小，确保小数位（包括.00）完整展示，绝不截断！
      */}
      <div className="grid grid-cols-3 gap-1.5 w-full">
        {/* 1. 总计花费 */}
        <div 
          className="rounded-2xl py-2.5 px-1.5 text-center flex flex-col justify-center items-center shadow-2xs"
          style={{
            background: 'rgba(234, 241, 236, 0.95)',
            border: '1px solid #BDCEBF',
          }}
        >
          <div className="text-[11px] font-medium text-[#3D5645] leading-tight">总计花费</div>
          <div className="text-[12px] sm:text-[13px] font-bold font-mono tabular-nums text-[#233527] mt-1 whitespace-nowrap overflow-x-auto max-w-full">
            {formatCurrency(summary.totalSpent)}
          </div>
        </div>

        {/* 2. 总计回血 */}
        <div 
          className="rounded-2xl py-2.5 px-1.5 text-center flex flex-col justify-center items-center shadow-2xs"
          style={{
            background: 'rgba(251, 242, 238, 0.95)',
            border: '1px solid #E8C5B8',
          }}
        >
          <div className="text-[11px] font-medium text-[#8D4B38] leading-tight">总计回血</div>
          <div className="text-[12px] sm:text-[13px] font-bold font-mono tabular-nums text-[#592617] mt-1 whitespace-nowrap overflow-x-auto max-w-full">
            {formatCurrency(summary.totalRecovered)}
          </div>
        </div>

        {/* 3. 待付尾款 */}
        <div 
          className="rounded-2xl py-2.5 px-1.5 text-center flex flex-col justify-center items-center shadow-2xs"
          style={{
            background: 'rgba(238, 243, 247, 0.95)',
            border: '1px solid #C4D4E0',
          }}
        >
          <div className="text-[11px] font-medium text-[#3E5C70] leading-tight">待付尾款</div>
          <div className="text-[12px] sm:text-[13px] font-bold font-mono tabular-nums text-[#233847] mt-1 whitespace-nowrap overflow-x-auto max-w-full">
            {formatCurrency(summary.pendingPayment)}
          </div>
        </div>
      </div>

      {/* 
        第二行：筛选功能（花销、回血、待付尾款） + SVG统计图标
      */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* 3个筛选按钮 */}
        <div className="flex items-center gap-1.5 flex-1">
          <button
            onClick={() => setActiveFilter(activeFilter === 'expense' ? 'all' : 'expense')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeFilter === 'expense'
                ? 'bg-[#4E6E58] text-white shadow-2xs font-semibold'
                : 'bg-white/80 text-[#3D5645] border border-[#BDCEBF] hover:bg-white'
            }`}
          >
            花销
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'resale' ? 'all' : 'resale')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeFilter === 'resale'
                ? 'bg-[#B86B53] text-white shadow-2xs font-semibold'
                : 'bg-white/80 text-[#8D4B38] border border-[#E8C5B8] hover:bg-white'
            }`}
          >
            回血
          </button>

          <button
            onClick={() => setActiveFilter(activeFilter === 'pending' ? 'all' : 'pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              activeFilter === 'pending'
                ? 'bg-[#5B798E] text-white shadow-2xs font-semibold'
                : 'bg-white/80 text-[#3E5C70] border border-[#C4D4E0] hover:bg-white'
            }`}
          >
            待付尾款
          </button>

          {activeFilter !== 'all' && (
            <button
              onClick={() => setActiveFilter('all')}
              className="text-[11px] text-[#7A8E7E] hover:text-[#2D3A32] underline ml-1"
            >
              全部
            </button>
          )}
        </div>

        {/* SVG统计图标按钮：点击弹出统计弹窗 */}
        <button
          onClick={() => setIsStatsModalOpen(true)}
          className="p-2 rounded-xl bg-white/80 hover:bg-white text-[#5B7360] border border-[#CBD7CE] transition-all shrink-0 active:scale-95"
          title="查看财务统计与尾款提醒"
        >
          <PieChart className="w-4 h-4" />
        </button>
      </div>

      {/* 
        账本明细列表：细长方形条目卡片，按日期分组展示
      */}
      <div className="space-y-3.5 pt-1">
        {groupedEntries.length === 0 ? (
          <div className="text-center py-16 rounded-2xl bg-white/50 text-[#7A8E7E] text-xs">
            {activeFilter === 'all' ? '暂无账本明细' : '当前分类下无账目'}
          </div>
        ) : (
          groupedEntries.map((group) => (
            <div key={group.date} className="space-y-1.5">
              {/* 日期抬头 */}
              <div className="text-[11px] font-mono text-[#7A8E7E] px-1">
                {group.date}
              </div>

              {/* 细长方形条目卡片 */}
              <div className="space-y-1.5">
                {group.list.map((entry) => {
                  const isExpense = entry.type === 'expense';
                  const isResale = entry.type === 'resale';
                  const isPending = entry.type === 'pending';

                  let categoryText = '';
                  if (isResale) categoryText = '转卖收入';
                  else if (isPending) categoryText = '待付尾款';
                  else if (entry.category === '邮费') categoryText = '邮费支出';
                  else if (entry.category === '全款') categoryText = '全款支出';
                  else if (entry.category === '定金') categoryText = '定金支出';
                  else categoryText = '尾款支出';

                  const linkedItem = items.find((i) => i.id === entry.itemId);

                  const cleanTag = (entry.itemTag || '').replace(/^BJD\s*[\/\-]\s*/i, '');

                  return (
                    <div
                      key={entry.id}
                      onClick={() => linkedItem && onSelectItem(linkedItem)}
                      className="w-full rounded-2xl bg-white/85 hover:bg-white border border-white/70 shadow-2xs p-3 flex items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99]"
                    >
                      {/* 左侧：支出/回血/尾款 3个不同的SVG图标 + 名字 + 仅显示Tag */}
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                          title={isResale ? '回血' : isPending ? '待付尾款' : '支出'}
                          style={{
                            background: isResale ? '#FAF0EE' : isPending ? '#EDF3F7' : '#EAF1EC',
                            color: isResale ? '#B86B53' : isPending ? '#5B798E' : '#4E6E58',
                          }}
                        >
                          {isResale ? (
                            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="7" y1="17" x2="17" y2="7" />
                              <polyline points="7 7 17 7 17 17" />
                            </svg>
                          ) : isPending ? (
                            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="9" />
                              <polyline points="12 7 12 12 15 14" />
                            </svg>
                          ) : (
                            <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="7" y1="7" x2="17" y2="17" />
                              <polyline points="17 7 17 17 7 17" />
                            </svg>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-[var(--theme-text)] truncate">
                            {entry.itemName}
                          </div>
                          <div className="text-[10px] text-[var(--theme-text-muted)] truncate mt-0.5">
                            {cleanTag}
                          </div>
                        </div>
                      </div>

                      {/* 右侧：类别说明 + 金额 */}
                      <div className="text-right shrink-0">
                        <div className="text-[10px] text-[#8C9E91]">
                          {categoryText}
                        </div>

                        <div 
                          className={`text-xs font-bold font-mono tabular-nums mt-0.5 whitespace-nowrap ${
                            isExpense 
                              ? 'text-[#4E6E58]' 
                              : isResale 
                              ? 'text-[#C07D67]' 
                              : 'text-[#5B798E]'
                          }`}
                        >
                          {isExpense ? `-${formatCurrency(entry.amount)}` : isResale ? `+${formatCurrency(entry.amount)}` : formatCurrency(entry.amount)}
                        </div>

                        {isPending && linkedItem && (
                          <button
                            onClick={(e) => handlePayFinal(e, entry)}
                            className="mt-0.5 inline-flex items-center gap-0.5 text-[10px] text-[#5B798E] hover:underline font-medium"
                          >
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            结清
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 
        财务统计弹窗（点击SVG图标后弹出，包含Tag构成与尾款提醒）
      */}
      {isStatsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-sm max-h-[85vh] overflow-y-auto rounded-3xl glass-panel p-5 shadow-2xl border border-white/80 text-[#2D3A32] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#CBD7CE]/50 pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-[#5B7360]" />
                <h3 className="text-sm font-serif-sc font-bold text-[#2D3A32]">
                  财务统计与提醒
                </h3>
              </div>
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="p-1 rounded-full text-[#7A8E7E] hover:text-[#2D3A32] hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. 待付尾款计划提醒表 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#3E5C70]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> 待付尾款提醒
                </span>
                <span className="font-mono text-[11px]">
                  共 {pendingFinalItems.length} 笔
                </span>
              </div>

              {pendingFinalItems.length === 0 ? (
                <div className="text-[11px] text-[#7A8E7E] p-3 rounded-xl bg-white/60 text-center">
                  暂无待付尾款，全部结清
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[175px] overflow-y-auto pr-1">
                  {pendingFinalItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-white/80 border border-[#C4D4E0] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-medium text-[#2D3A32] truncate">{item.name}</div>
                        <div className="text-[10px] text-[#5B798E] font-mono mt-0.5">
                          待付: {formatCurrency(item.finalAmount)} · 计划: {item.finalDate || '待定'}
                        </div>
                      </div>
                      <button
                        onClick={() => handlePayFinalFromModal(item)}
                        className="px-2 py-1 text-[11px] bg-[#5B798E] text-white rounded-lg shrink-0 hover:bg-[#4A6477] transition-colors"
                      >
                        结清
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. 按物品 Tag 支出构成 */}
            <div className="space-y-2 pt-2 border-t border-[#CBD7CE]/40">
              <div className="text-xs font-semibold text-[#3D5645]">
                按物品 Tag 支出构成
              </div>

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {tagStats.length === 0 ? (
                  <div className="text-[11px] text-[#7A8E7E] text-center py-2">暂无支出数据</div>
                ) : (
                  tagStats.map((st) => (
                    <div key={st.tag} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#3D4F42] font-medium">
                          {st.tag} <span className="text-[#7A8E7E] text-[10px]">({st.count}笔)</span>
                        </span>
                        <span className="font-mono text-[#2D3A32]">
                          {formatCurrency(st.total)} <span className="text-[#7A8E7E] text-[10px]">({st.percent.toFixed(1)}%)</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E8ECE8] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#5B7360]"
                          style={{ width: `${Math.min(100, Math.max(3, st.percent))}%` }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-[#CBD7CE]/40 flex justify-end">
              <button
                onClick={() => setIsStatsModalOpen(false)}
                className="px-4 py-1.5 text-xs text-[#5B7360] font-medium hover:text-[#2D3A32]"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
