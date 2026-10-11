import React from 'react';

interface NavbarProps {
  currentTab: 'cabinet' | 'ledger';
  onSelectTab: (tab: 'cabinet' | 'ledger') => void;
  onOpenBackup: () => void;
  onOpenTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenBackup,
  onOpenTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--theme-bg)]/90 backdrop-blur-md border-b border-[var(--theme-border)]/50">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* 上方大标题位置放：娃物、账本、备份 三个按钮 */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab('cabinet')}
            className={`text-lg font-serif-sc transition-colors whitespace-nowrap relative py-1 ${
              currentTab === 'cabinet'
                ? 'font-bold text-[var(--theme-text)]'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
            }`}
          >
            娃物
            {currentTab === 'cabinet' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[var(--theme-primary)] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('ledger')}
            className={`text-lg font-serif-sc transition-colors whitespace-nowrap relative py-1 ${
              currentTab === 'ledger'
                ? 'font-bold text-[var(--theme-text)]'
                : 'text-[var(--theme-text-muted)] hover:text-[var(--theme-text)]'
            }`}
          >
            账本
            {currentTab === 'ledger' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[var(--theme-primary)] rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenBackup}
            className="text-lg font-serif-sc text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] transition-colors whitespace-nowrap py-1"
          >
            备份
          </button>
        </div>

        {/* 
          三个大按钮右侧最右边：新增纯 SVG 调色盘图标按钮，点击弹出自定义UI颜色弹窗
        */}
        <button
          onClick={onOpenTheme}
          className="p-2 rounded-xl text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] hover:bg-black/5 transition-all active:scale-95"
          title="自定义软件UI莫兰迪配色"
        >
          <svg
            className="w-5 h-5 text-[var(--theme-primary)] hover:opacity-85 transition-opacity"
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
        </button>
      </div>
    </header>
  );
};
