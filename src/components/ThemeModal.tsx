import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { THEME_PRESETS, MorandiTheme, saveStoredThemeId, applyThemeToDOM } from '../utils/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: MorandiTheme;
  onApplyTheme: (theme: MorandiTheme) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onApplyTheme,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<MorandiTheme>(currentTheme);

  if (!isOpen) return null;

  // 点击预设直接应用并实时保存
  const handleSelect = (theme: MorandiTheme) => {
    setSelectedTheme(theme);
    applyThemeToDOM(theme);
    saveStoredThemeId(theme.id);
    onApplyTheme(theme);
  };

  // 确认按钮：保存并关闭
  const handleConfirm = () => {
    saveStoredThemeId(selectedTheme.id);
    applyThemeToDOM(selectedTheme);
    onApplyTheme(selectedTheme);
    onClose();
  };

  // 重置按钮：恢复默认豆青鼠尾草莫兰迪配色，并保存应用
  const handleReset = () => {
    const defaultTheme = THEME_PRESETS[0]; // 豆青鼠尾草
    setSelectedTheme(defaultTheme);
    saveStoredThemeId(defaultTheme.id);
    applyThemeToDOM(defaultTheme);
    onApplyTheme(defaultTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-sm rounded-3xl glass-panel p-5 shadow-2xl border border-white/80 space-y-4"
        style={{ color: 'var(--theme-text)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] pb-2.5">
          <div className="flex items-center gap-2">
            {/* 调色盘纯SVG图标 */}
            <svg 
              className="w-4.5 h-4.5 text-[var(--theme-primary)]" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
              <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
              <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
              <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.562C22 6.5 17.5 2 12 2z" />
            </svg>
            <h3 className="text-sm font-serif-sc font-bold text-[var(--theme-text)]">
              自定义软件 UI 色调
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-black/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 预设莫兰迪色系列表：点击直接应用并保存 */}
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {THEME_PRESETS.map((theme) => {
            const isSelected = selectedTheme.id === theme.id;
            return (
              <div
                key={theme.id}
                onClick={() => handleSelect(theme)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'ring-2 ring-[var(--theme-primary)] bg-white shadow-xs'
                    : 'bg-white/70 hover:bg-white border-[var(--theme-border)]/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* 莫兰迪色环展示：主色、底色、字色 */}
                  <div className="flex items-center -space-x-1">
                    <span 
                      className="w-5 h-5 rounded-full border border-white shadow-2xs" 
                      style={{ backgroundColor: theme.primary }} 
                      title="主色调"
                    />
                    <span 
                      className="w-5 h-5 rounded-full border border-white shadow-2xs" 
                      style={{ backgroundColor: theme.bg }} 
                      title="背景底色"
                    />
                    <span 
                      className="w-5 h-5 rounded-full border border-white shadow-2xs" 
                      style={{ backgroundColor: theme.text }} 
                      title="主要文字"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-[var(--theme-text)]">
                      {theme.name}
                    </div>
                    <div className="text-[10px] text-[var(--theme-text-muted)] font-mono">
                      {theme.primary} · 背景 {theme.bg}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <Check className="w-4 h-4 text-[var(--theme-primary)] shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* 弹窗底部：重置与确认两个按钮并列 */}
        <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-[var(--theme-border)]">
          <button
            type="button"
            onClick={handleReset}
            className="w-full py-2 text-xs font-medium text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] bg-white/75 hover:bg-white border border-[var(--theme-border)] rounded-xl transition-colors active:scale-95"
          >
            重置
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-2 text-xs font-semibold text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] rounded-xl shadow-xs transition-colors active:scale-95"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};
