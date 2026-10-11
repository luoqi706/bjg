import React, { useRef, useState } from 'react';
import { X, Download, Upload, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { DollItem } from '../types';
import { exportDataAsJSON, resetStoredItems } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: DollItem[];
  onImportItems: (items: DollItem[]) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  items,
  onImportItems,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportDataAsJSON(items);
    setStatusMsg({ text: '数据导出成功，已保存至本地JSON文件', type: 'success' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          onImportItems(parsed);
          setStatusMsg({ text: `导入成功，共载入 ${parsed.length} 件娃物数据`, type: 'success' });
        } else {
          setStatusMsg({ text: '文件格式不正确，需为有效娃物JSON数据', type: 'error' });
        }
      } catch (err) {
        setStatusMsg({ text: '无法解析所选文件，请确认是有效的JSON备份', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('确定要恢复初始示例数据吗？当前的自定义修改将被示例娃物替换。')) {
      const initial = resetStoredItems();
      onImportItems(initial);
      setStatusMsg({ text: '已恢复初始示例娃物与账本', type: 'success' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md rounded-3xl glass-panel p-6 shadow-2xl border border-white/80 text-[#2D3A32]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#A2B29F]/30">
          <div>
            <h3 className="text-base font-serif-sc font-bold text-[#2D3A32]">
              数据管理与备份
            </h3>
            <p className="text-xs text-[#6F8873]">
              本地持久存储，支持导出、恢复与导入
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6F8873] hover:text-[#2D3A32] rounded-full hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMsg && (
          <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
            statusMsg.type === 'success' 
              ? 'bg-[#EAF1EC] text-[#3D5645] border border-[#BDCEBF]' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {statusMsg.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMsg.text}</span>
          </div>
        )}

        <div className="mt-5 space-y-3">
          <button
            onClick={handleExport}
            className="w-full p-4 rounded-2xl bg-white/70 hover:bg-white border border-[#CBD7CE] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-[#5B7360]/10 text-[#5B7360] group-hover:bg-[#5B7360] group-hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#2D3A32]">导出全部数据 (JSON)</div>
                <div className="text-[11px] text-[#7A8E7E]">包含当前 {items.length} 件娃物及所有账目记录</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 rounded-2xl bg-white/70 hover:bg-white border border-[#CBD7CE] transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-[#5B798E]/10 text-[#5B798E] group-hover:bg-[#5B798E] group-hover:text-white transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-semibold text-[#2D3A32]">导入备份数据</div>
                <div className="text-[11px] text-[#7A8E7E]">从 JSON 文件还原娃物与账本</div>
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </button>

          <button
            onClick={handleReset}
            className="w-full p-3.5 rounded-2xl bg-white/50 hover:bg-red-50/70 border border-[#CBD7CE]/70 hover:border-red-200 transition-all flex items-center gap-3 group text-left"
          >
            <div className="p-2 rounded-xl bg-black/5 text-[#7A8E7E] group-hover:text-red-600 transition-colors">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-[#4A5D4F] group-hover:text-red-700">重置为示例数据</div>
              <div className="text-[11px] text-[#7A8E7E]">恢复初始预设的5件典型BJD藏品</div>
            </div>
          </button>
        </div>

        <div className="mt-5 pt-3 border-t border-[#A2B29F]/30 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-[#5B7360] hover:text-[#2D3A32]"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
