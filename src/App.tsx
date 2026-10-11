/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { DollItem } from './types';
import { getStoredItems, saveStoredItems } from './utils/storage';
import { Navbar } from './components/Navbar';
import { CabinetView } from './components/CabinetView';
import { LedgerView } from './components/LedgerView';
import { ItemDetailPage } from './components/ItemDetailPage';
import { ItemFormPage } from './components/ItemFormPage';
import { BackupModal } from './components/BackupModal';
import { ThemeModal } from './components/ThemeModal';
import { THEME_PRESETS, getStoredThemeId, applyThemeToDOM, MorandiTheme } from './utils/theme';
import { Check } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<DollItem[]>([]);
  const [activeTab, setActiveTab] = useState<'cabinet' | 'ledger'>('cabinet');

  // 全页面路由状态：'list' (主界面) | 'detail' (娃物详情新页面) | 'edit' (编辑页面) | 'create' (创建页面)
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit' | 'create'>('list');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 主题配色状态
  const [currentTheme, setCurrentTheme] = useState<MorandiTheme>(() => {
    const savedId = getStoredThemeId();
    return THEME_PRESETS.find((t) => t.id === savedId) || THEME_PRESETS[0];
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 初始化加载数据与应用莫兰迪UI主题
  useEffect(() => {
    const loaded = getStoredItems();
    setItems(loaded);
    applyThemeToDOM(currentTheme);
  }, []);

  const currentItem = items.find((i) => i.id === selectedItemId) || null;

  // 保存娃物 (新增或编辑)
  const handleSaveItem = (savedItem: DollItem) => {
    setItems((prevItems) => {
      const existsIndex = prevItems.findIndex((i) => i.id === savedItem.id);
      let updated: DollItem[];
      if (existsIndex >= 0) {
        updated = [...prevItems];
        updated[existsIndex] = savedItem;
      } else {
        updated = [savedItem, ...prevItems];
      }
      saveStoredItems(updated);
      return updated;
    });

    setSelectedItemId(savedItem.id);
    setViewMode('detail');
    showToast(`「${savedItem.name}」已保存`);
  };

  // 点击创建新娃物 / 记一笔
  const handleOpenCreate = () => {
    setViewMode('create');
  };

  // 点击具体的单个娃物 -> 跳转到新页面
  const handleSelectItem = (item: DollItem) => {
    setSelectedItemId(item.id);
    setViewMode('detail');
  };

  // 从详情页点击编辑信息 -> 跳转到信息编辑页面
  const handleEditFromDetail = (item: DollItem) => {
    setSelectedItemId(item.id);
    setViewMode('edit');
  };

  // 返回列表
  const handleBackToList = () => {
    setViewMode('list');
  };

  // 删除娃物
  const handleDeleteItem = (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== itemId);
      saveStoredItems(updated);
      return updated;
    });
    setViewMode('list');
    setSelectedItemId(null);
    showToast('娃物已删除');
  };

  // 快捷更新 (例如账本中结清尾款)
  const handleUpdateItem = (item: DollItem) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === item.id ? item : i));
      saveStoredItems(next);
      return next;
    });
    showToast(`「${item.name}」已更新`);
  };

  // 导入数据
  const handleImportItems = (newItems: DollItem[]) => {
    setItems(newItems);
    saveStoredItems(newItems);
    setViewMode('list');
    setSelectedItemId(null);
    showToast(`成功导入 ${newItems.length} 件娃物数据`);
  };

  // 应用并更新主题
  const handleApplyTheme = (theme: MorandiTheme) => {
    setCurrentTheme(theme);
    applyThemeToDOM(theme);
    showToast(`已应用「${theme.name}」色调`);
  };

  return (
    <div className="min-h-screen text-[var(--theme-text)] flex flex-col justify-between" style={{ backgroundColor: 'var(--theme-bg)' }}>
      {/* 顶部简明导航栏：娃物、账本、备份 + 最右侧自定义UI颜色SVG图标 */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setViewMode('list');
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenTheme={() => setIsThemeModalOpen(true)}
      />

      {/* 手机端主体容器 */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4">
        {/* 1. 详情新页面 */}
        {viewMode === 'detail' && currentItem && (
          <ItemDetailPage
            item={currentItem}
            onBack={handleBackToList}
            onEdit={handleEditFromDetail}
          />
        )}

        {/* 2. 编辑页面 */}
        {viewMode === 'edit' && currentItem && (
          <ItemFormPage
            initialItem={currentItem}
            onBack={() => setViewMode('detail')}
            onSave={handleSaveItem}
            onDelete={handleDeleteItem}
          />
        )}

        {/* 3. 创建新娃物页面 */}
        {viewMode === 'create' && (
          <ItemFormPage
            initialItem={null}
            onBack={handleBackToList}
            onSave={handleSaveItem}
          />
        )}

        {/* 4. 常规Tab视图 */}
        {viewMode === 'list' && (
          <>
            {activeTab === 'cabinet' && (
              <CabinetView
                items={items}
                onOpenCreate={handleOpenCreate}
                onSelectItem={handleSelectItem}
              />
            )}

            {activeTab === 'ledger' && (
              <LedgerView
                items={items}
                onUpdateItem={handleUpdateItem}
                onSelectItem={handleSelectItem}
                onEditItem={handleEditFromDetail}
              />
            )}
          </>
        )}
      </main>

      {/* 
        手机端右下角悬浮按钮：纯圆形、无文字，恢复之前好看的SVG笔图标
      */}
      {viewMode === 'list' && (
        <button
          onClick={handleOpenCreate}
          className="fixed bottom-6 right-5 z-40 w-12 h-12 rounded-full bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] text-white shadow-xl shadow-black/25 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
          title="记一笔"
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 18.5l-4 1 1-4L16.5 3.5z" />
            <path d="M14.5 5.5l3 3" />
            <circle cx="9" cy="14" r="0.75" fill="currentColor" />
          </svg>
        </button>
      )}

      {/* 自定义软件UI颜色弹窗 */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onApplyTheme={handleApplyTheme}
      />

      {/* 数据备份模态窗 */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        items={items}
        onImportItems={handleImportItems}
      />

      {/* Toast 提示框 */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#2D3A32]/90 backdrop-blur-md text-white text-xs font-medium shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <Check className="w-3.5 h-3.5 text-[#8FA593]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
