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
import { Check, Edit3 } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<DollItem[]>([]);
  const [activeTab, setActiveTab] = useState<'cabinet' | 'ledger'>('cabinet');

  // 全页面路由状态：'list' (主界面) | 'detail' (娃物详情新页面) | 'edit' (编辑页面) | 'create' (创建页面)
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit' | 'create'>('list');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 初始化加载数据
  useEffect(() => {
    const loaded = getStoredItems();
    setItems(loaded);
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

  return (
    <div className="min-h-screen bg-[#F3F6F3] text-[#2D3A32] flex flex-col justify-between">
      {/* 顶部简明导航栏：娃物、账本、备份 */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setViewMode('list');
        }}
        onOpenBackup={() => setIsBackupModalOpen(true)}
      />

      {/* 手机端主体容器 (以手机端为主，居中且宽度适度) */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-4">
        {/* 1. 详情新页面 (全页面展示，左上角返回按键，底部仅编辑按钮) */}
        {viewMode === 'detail' && currentItem && (
          <ItemDetailPage
            item={currentItem}
            onBack={handleBackToList}
            onEdit={handleEditFromDetail}
          />
        )}

        {/* 2. 编辑页面 (单个界面完成全部信息修改，同一行对应金额与时间) */}
        {viewMode === 'edit' && currentItem && (
          <ItemFormPage
            initialItem={currentItem}
            onBack={() => setViewMode('detail')}
            onSave={handleSaveItem}
            onDelete={handleDeleteItem}
          />
        )}

        {/* 3. 创建新娃物页面 (同一行对应金额与时间) */}
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

      {/* 手机端右下角悬浮「记一笔」快捷按钮 (参考截图右下角胶囊悬浮键) */}
      {viewMode === 'list' && (
        <button
          onClick={handleOpenCreate}
          className="fixed bottom-6 right-5 z-40 px-4 py-2.5 rounded-full bg-[#2D3A32] text-white shadow-lg shadow-black/20 flex items-center gap-1.5 active:scale-95 transition-all text-xs font-medium"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>记一笔</span>
        </button>
      )}

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
