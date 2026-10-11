import React, { useState, useMemo } from 'react';
import { Search, Tag as TagIcon, Plus, X } from 'lucide-react';
import { DollItem, ItemStatus } from '../types';
import { formatCurrency } from '../utils/formatters';
import { getStoredTags, saveStoredTags } from '../utils/storage';

interface CabinetViewProps {
  items: DollItem[];
  onOpenCreate: () => void;
  onSelectItem: (item: DollItem) => void;
}

const STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: 'owned', label: '已拥有' },
  { value: 'pending_final', label: '待付尾款' },
  { value: 'pending_shipment', label: '待发货' },
  { value: 'resold', label: '已转卖' },
];

export const CabinetView: React.FC<CabinetViewProps> = ({
  items,
  onSelectItem,
}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 状态筛选：全部 (all) 或 4个状态之一
  const [statusFilter, setStatusFilter] = useState<'all' | ItemStatus>('all');

  // Tag 筛选：当前已生效的 Tag
  const [activeTag, setActiveTag] = useState<string>('all');

  // Tag 筛选弹窗内临时选中的 Tag
  const [tempTag, setTempTag] = useState<string>('all');
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  // 所有可用 Tag 列表 (支持自定义添加)
  const [allTags, setAllTags] = useState<string[]>(() => getStoredTags());
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  // 打开 Tag 筛选弹窗
  const handleOpenTagModal = () => {
    setTempTag(activeTag);
    setIsAddingTag(false);
    setNewTagInput('');
    setIsTagModalOpen(true);
  };

  // 弹窗中添加新 Tag
  const handleAddNewTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (!allTags.includes(trimmed)) {
      const updated = [...allTags, trimmed];
      setAllTags(updated);
      saveStoredTags(updated);
      setTempTag(trimmed);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  // 弹窗确认
  const handleConfirmTagModal = () => {
    setActiveTag(tempTag);
    setIsTagModalOpen(false);
  };

  // 弹窗重置
  const handleResetTagModal = () => {
    setTempTag('all');
    setActiveTag('all');
    setIsTagModalOpen(false);
  };

  // 综合过滤娃物
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 关键字
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(kw);
        const matchNotes = (item.notes || '').toLowerCase().includes(kw);
        const matchBrand = (item.brand || '').toLowerCase().includes(kw);
        if (!matchName && !matchNotes && !matchBrand) return false;
      }
      // 状态
      if (statusFilter !== 'all' && item.status !== statusFilter) {
        return false;
      }
      // Tag
      if (activeTag !== 'all' && item.tag !== activeTag) {
        return false;
      }
      return true;
    });
  }, [items, searchKeyword, statusFilter, activeTag]);

  return (
    <div className="space-y-3 pb-16">
      {/* 
        搜索栏：最右边放置一个SVG图标（Tag图标）
        当有进行tag筛选的时候变色，没有的时候恢复默认色
      */}
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--theme-text-muted)]" />
        <input
          type="text"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          placeholder="搜索娃物名称..."
          className="w-full pl-8 pr-10 py-2 rounded-xl text-xs glass-input text-[var(--theme-text)] placeholder:text-[var(--theme-text-muted)]"
        />

        {/* 搜索框最右边的SVG图标：点击打开Tag筛选弹窗 */}
        <button
          onClick={handleOpenTagModal}
          className={`absolute right-2 top-1.5 p-1 rounded-lg transition-colors cursor-pointer ${
            activeTag !== 'all'
              ? 'text-[var(--theme-primary)] bg-[var(--theme-primary-light)] ring-1 ring-[var(--theme-primary)]/40'
              : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
          }`}
          title={activeTag !== 'all' ? `已筛选Tag: ${activeTag}` : '选择Tag筛选'}
        >
          <TagIcon className="w-4 h-4" />
        </button>
      </div>

      {/* 
        在搜索框下面增加一排横向的按钮：娃物的4个状态，点击筛选
      */}
      <div className="grid grid-cols-4 gap-1.5">
        {STATUS_OPTIONS.map((st) => {
          const isSelected = statusFilter === st.value;
          return (
            <button
              key={st.value}
              onClick={() => setStatusFilter(isSelected ? 'all' : st.value)}
              className={`py-1.5 px-1 rounded-xl text-xs text-center font-medium transition-all truncate cursor-pointer ${
                isSelected
                  ? 'bg-[var(--theme-primary)] text-white shadow-2xs font-semibold'
                  : 'bg-white/80 text-[var(--theme-text)] border border-[var(--theme-border)] hover:bg-white'
              }`}
            >
              {st.label}
            </button>
          );
        })}
      </div>

      {/* 如果当前有 Tag 筛选，展示一个小提示并允许直接清除 */}
      {activeTag !== 'all' && (
        <div className="flex items-center justify-between px-2.5 py-1 rounded-lg bg-[var(--theme-primary-light)] border border-[var(--theme-border)] text-[11px] text-[var(--theme-text)]">
          <span>已筛选 Tag: <strong>{activeTag}</strong></span>
          <button
            onClick={() => setActiveTag('all')}
            className="text-[10px] text-[var(--theme-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <X className="w-3 h-3" />
            清除筛选
          </button>
        </div>
      )}

      {/* 娃物陈列网格：严格一行3个 (grid-cols-3)，完美适配手机端 */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white/50 text-[var(--theme-text-muted)] text-xs space-y-2">
          <p>暂无符合筛选条件的娃物</p>
          {(statusFilter !== 'all' || activeTag !== 'all' || searchKeyword) && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setActiveTag('all');
                setSearchKeyword('');
              }}
              className="text-xs text-[var(--theme-primary)] font-medium underline cursor-pointer"
            >
              重置所有筛选
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="cursor-pointer rounded-xl bg-white/80 hover:bg-white border border-white/70 shadow-2xs overflow-hidden flex flex-col active:scale-[0.98] transition-all"
            >
              {/* 正方形缩略图 */}
              <div className="w-full aspect-square bg-[#E8ECE8] overflow-hidden">
                <img
                  src={item.photoUrl}
                  alt={item.name}
                  className="w-full h-full aspect-square object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* 仅显示名字与娃柜价格 */}
              <div className="p-1.5 flex flex-col justify-between gap-0.5">
                <div 
                  className="text-xs font-medium text-[var(--theme-text)] truncate"
                  title={item.name}
                >
                  {item.name}
                </div>

                <div className="font-mono text-[11px] font-semibold text-[var(--theme-primary)] tabular-nums truncate">
                  {item.cabinetPrice !== null ? formatCurrency(item.cabinetPrice) : '¥ 0.00'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 
        Tag 筛选弹窗：
        显示各种各样的Tag，后面跟一个小小的加号(+)可以自定义新建tag。
        底部并列放置两个按钮：【重置】与【确定】
      */}
      {isTagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div 
            className="w-full max-w-sm rounded-3xl glass-panel p-5 shadow-2xl border border-white/80 text-[var(--theme-text)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--theme-border)]/50 pb-2.5">
              <h3 className="text-sm font-serif-sc font-bold text-[var(--theme-text)]">
                选择物品 Tag 筛选
              </h3>
              <button
                onClick={() => setIsTagModalOpen(false)}
                className="p-1 text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] rounded-full hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tag 标签网格 */}
            <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTempTag(tempTag === t ? 'all' : t)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                    tempTag === t
                      ? 'bg-[var(--theme-primary)] text-white shadow-2xs font-semibold'
                      : 'bg-white/80 text-[var(--theme-text)] border border-[var(--theme-border)] hover:bg-white'
                  }`}
                >
                  {t}
                </button>
              ))}

              {/* 
                在所有的 tag 标签后面，增加一个 SVG 图标的小小的加号 (+)
                点击可以自定义新建 tag
              */}
              <button
                type="button"
                onClick={() => setIsAddingTag(!isAddingTag)}
                className="px-2.5 py-1.5 rounded-xl border border-dashed border-[var(--theme-primary)] text-[var(--theme-primary)] hover:bg-[var(--theme-primary-light)] text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                title="新建自定义Tag"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建</span>
              </button>
            </div>

            {/* 新建 Tag 输入框 */}
            {isAddingTag && (
              <form onSubmit={handleAddNewTag} className="flex items-center gap-2 pt-1 animate-fade-in">
                <input
                  type="text"
                  autoFocus
                  required
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  placeholder="输入新 Tag 名称..."
                  className="flex-1 px-3 py-1.5 text-xs glass-input rounded-xl text-[var(--theme-text)]"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-medium bg-[var(--theme-primary)] text-white rounded-xl shrink-0 cursor-pointer"
                >
                  添加
                </button>
              </form>
            )}

            {/* 弹窗底部：重置与确定两个按钮并列 */}
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[var(--theme-border)]/50">
              <button
                type="button"
                onClick={handleResetTagModal}
                className="w-full py-2 text-xs font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] bg-white/70 hover:bg-white border border-[var(--theme-border)] rounded-xl transition-colors cursor-pointer"
              >
                重置
              </button>
              <button
                type="button"
                onClick={handleConfirmTagModal}
                className="w-full py-2 text-xs font-semibold text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
