import React from 'react';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { DollItem, ItemStatus } from '../types';
import { formatCurrency } from '../utils/formatters';

interface ItemDetailPageProps {
  item: DollItem;
  onBack: () => void;
  onEdit: (item: DollItem) => void;
}

const STATUS_TEXT: Record<ItemStatus, string> = {
  owned: '已拥有',
  pending_final: '待付尾款',
  pending_shipment: '待发货',
  resold: '已转卖',
};

export const ItemDetailPage: React.FC<ItemDetailPageProps> = ({
  item,
  onBack,
  onEdit,
}) => {
  const [isViewingFullImage, setIsViewingFullImage] = React.useState(false);

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12 animate-fade-in">
      {/* 全屏完整大图展示弹窗：再点关闭图片显示 */}
      {isViewingFullImage && (
        <div 
          onClick={() => setIsViewingFullImage(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-3 cursor-pointer animate-fade-in"
          title="点击关闭完整图片"
        >
          <img
            src={item.photoUrl}
            alt={item.name}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl transition-transform"
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* 左上角返回按键 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] hover:opacity-80 bg-white/70 hover:bg-white rounded-xl border border-[var(--theme-border)] transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>
      </div>

      {/* 娃物核心信息卡片 */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 space-y-5 border border-white/80 shadow-md">
        {/* 上部分：正方形大图与标题状态 (点击图片查看完整图片) */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div 
            onClick={() => setIsViewingFullImage(true)}
            className="w-48 h-48 aspect-square rounded-2xl overflow-hidden bg-[#E8ECE8] border-2 border-white shadow-sm cursor-pointer group relative"
            title="点击查看完整图片"
          >
            <img
              src={item.photoUrl}
              alt={item.name}
              className="w-full h-full aspect-square object-cover group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="w-full space-y-2 text-left">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[var(--theme-primary)] text-white">
                {(item.tag || '').replace(/^BJD\s*[\/\-]\s*/i, '')}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-white/80 text-[var(--theme-text)] border border-[var(--theme-border)]">
                {STATUS_TEXT[item.status]}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-serif-sc font-bold text-[var(--theme-text)] leading-snug">
              {item.name}
            </h1>
          </div>
        </div>

        {/* 
          娃柜信息模块：
          一行一条不要挤在一起，具体内容信息和标题做好区分（标题加粗、Noto Serif衬线字体、主色调），
          每一行之间做微妙隔断（微妙底部分隔线，隔断不明显）。
        */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/75 border border-[var(--theme-border)]/70 shadow-2xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[var(--theme-border)]/40">
            <h3 className="font-serif-sc font-bold text-xs text-[var(--theme-primary)] tracking-wider">
              娃柜信息
            </h3>
          </div>

          <div className="divide-y divide-[var(--theme-border)]/35 text-xs sm:text-sm">
            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="font-serif-sc font-bold text-xs sm:text-[13px] text-[var(--theme-primary)] shrink-0">
                材质
              </span>
              <span className="text-[var(--theme-text)] text-right font-normal break-words">
                {item.material || '未填写'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="font-serif-sc font-bold text-xs sm:text-[13px] text-[var(--theme-primary)] shrink-0">
                尺寸
              </span>
              <span className="text-[var(--theme-text)] text-right font-normal break-words">
                {item.size || '未填写'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="font-serif-sc font-bold text-xs sm:text-[13px] text-[var(--theme-primary)] shrink-0">
                颜色
              </span>
              <span className="text-[var(--theme-text)] text-right font-normal break-words">
                {item.color || '未填写'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="font-serif-sc font-bold text-xs sm:text-[13px] text-[var(--theme-primary)] shrink-0">
                购买渠道
              </span>
              <span className="text-[var(--theme-text)] text-right font-normal break-words">
                {item.channel || '未填写'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="font-serif-sc font-bold text-xs sm:text-[13px] text-[var(--theme-primary)] shrink-0">
                娃柜价格
              </span>
              <span className="text-[var(--theme-text)] text-right font-mono font-medium">
                {item.cabinetPrice !== null ? formatCurrency(item.cabinetPrice) : '¥ 0.00'}
              </span>
            </div>

            <div className="py-2.5 flex items-center justify-between gap-4">
              <span className="font-serif-sc font-bold text-xs sm:text-[13px] text-[var(--theme-primary)] shrink-0">
                娃柜数量
              </span>
              <span className="text-[var(--theme-text)] text-right font-mono font-medium">
                {item.cabinetQuantity || 1}
              </span>
            </div>
          </div>
        </div>

        {/* 价格与账本明细 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/75 border border-[var(--theme-border)]/70 space-y-4 shadow-2xs">
          <div className="flex items-center justify-between border-b border-[var(--theme-border)]/40 pb-2">
            <h3 className="text-xs font-serif-sc font-bold text-[var(--theme-primary)]">
              价格明细 ({item.paymentMode === 'full' ? '全款支付' : '定金支付'})
            </h3>
          </div>

          {item.paymentMode === 'full' ? (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[var(--theme-border)]/60 flex items-center justify-between">
                <div>
                  <div className="text-[var(--theme-text-muted)] text-[11px]">全款金额</div>
                  <div className="text-base font-bold font-mono text-[var(--theme-text)] mt-0.5">
                    {formatCurrency(item.fullAmount)}
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-text-muted)] font-mono text-right">
                  {item.fullDate || '未填写'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[var(--theme-border)]/60 flex items-center justify-between">
                <div>
                  <div className="text-[var(--theme-text-muted)] text-[11px]">邮费</div>
                  <div className="text-base font-bold font-mono text-[var(--theme-text)] mt-0.5">
                    {formatCurrency(item.fullPostage)}
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-text-muted)] font-mono text-right">
                  {item.fullPostageDate || item.fullDate || '未填写'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[var(--theme-border)]/60 flex items-center justify-between">
                <div>
                  <div className="text-[var(--theme-text-muted)] text-[11px]">定金金额</div>
                  <div className="text-base font-bold font-mono text-[var(--theme-text)] mt-0.5">
                    {formatCurrency(item.depositAmount)}
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-text-muted)] font-mono text-right">
                  {item.depositDate || '未填写'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[var(--theme-border)]/60 flex items-center justify-between">
                <div>
                  <div className="text-[var(--theme-text-muted)] text-[11px]">尾款金额</div>
                  <div className="text-base font-bold font-mono text-[var(--theme-text)] mt-0.5">
                    {formatCurrency(item.finalAmount)}
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-text-muted)] font-mono text-right">
                  {item.finalDate || '未填写'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[var(--theme-border)]/60 flex items-center justify-between">
                <div>
                  <div className="text-[var(--theme-text-muted)] text-[11px]">邮费</div>
                  <div className="text-base font-bold font-mono text-[var(--theme-text)] mt-0.5">
                    {formatCurrency(item.depositPostage)}
                  </div>
                </div>
                <div className="text-[11px] text-[var(--theme-text-muted)] font-mono text-right">
                  {item.depositPostageDate || '未填写'}
                </div>
              </div>
            </div>
          )}

          {/* 转卖信息 (若已转卖，已删去“转卖时间：”) */}
          {item.isResold && (
            <div className="p-3 rounded-xl bg-[#FAF3F0] border border-[#E8C5B8] flex items-center justify-between text-xs">
              <div>
                <div className="text-[#8D4B38] text-[11px]">转卖金额</div>
                <div className="text-base font-bold font-mono text-[#B86B53] mt-0.5">
                  {formatCurrency(item.resaleAmount)}
                </div>
              </div>
              <div className="text-[#8D4B38] font-mono text-[11px] whitespace-nowrap text-right">
                {item.resaleDate || '未填写'}
              </div>
            </div>
          )}
        </div>

        {/* 备注 */}
        {item.notes && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/60 border border-[var(--theme-border)]/60 text-xs sm:text-sm space-y-1">
            <span className="text-xs text-[var(--theme-text-muted)] font-medium">备注：</span>
            <p className="text-[var(--theme-text)] whitespace-pre-wrap leading-relaxed">{item.notes}</p>
          </div>
        )}

        {/* 页面下方：只放一个编辑信息按钮 */}
        <div className="pt-4 border-t border-[var(--theme-border)]/50 flex justify-end">
          <button
            onClick={() => onEdit(item)}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[var(--theme-primary)] hover:bg-[var(--theme-primary-hover)] active:scale-[0.98] rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4" />
            <span>编辑信息</span>
          </button>
        </div>
      </div>
    </div>
  );
};
