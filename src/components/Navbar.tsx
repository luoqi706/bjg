import React from 'react';

interface NavbarProps {
  currentTab: 'cabinet' | 'ledger';
  onSelectTab: (tab: 'cabinet' | 'ledger') => void;
  onOpenBackup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenBackup,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F3F6F3]/90 backdrop-blur-md border-b border-[#CBD7CE]/50">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* 上方大标题位置放：娃物、账本、备份 三个按钮 */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onSelectTab('cabinet')}
            className={`text-lg font-serif-sc transition-colors whitespace-nowrap relative py-1 ${
              currentTab === 'cabinet'
                ? 'font-bold text-[#2D3A32]'
                : 'text-[#7A8E7E] hover:text-[#2D3A32]'
            }`}
          >
            娃物
            {currentTab === 'cabinet' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#5B7360] rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('ledger')}
            className={`text-lg font-serif-sc transition-colors whitespace-nowrap relative py-1 ${
              currentTab === 'ledger'
                ? 'font-bold text-[#2D3A32]'
                : 'text-[#7A8E7E] hover:text-[#2D3A32]'
            }`}
          >
            账本
            {currentTab === 'ledger' && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#5B7360] rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenBackup}
            className="text-lg font-serif-sc text-[#7A8E7E] hover:text-[#2D3A32] transition-colors whitespace-nowrap py-1"
          >
            备份
          </button>
        </div>
      </div>
    </header>
  );
};
