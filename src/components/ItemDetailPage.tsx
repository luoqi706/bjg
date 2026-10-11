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
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A5D4F] hover:text-[#2D3A32] bg-white/70 hover:bg-white rounded-xl border border-[#CBD7CE] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>
      </div>

      {/* 娃物核心信息卡片 */}
      <div className="glass-panel rounded-3xl p-4 sm:p-5 space-y-5 border border-white/80 shadow-md">
        {/* 上部分：正方形大图与标题信息 (点击图片查看完整图片) */}
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
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#5B7360] text-white">
                {item.tag}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-[#E8ECE8] text-[#3D4F42]">
                {STATUS_TEXT[item.status]}
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-serif-sc font-bold text-[#2D3A32] leading-snug">
              {item.name}
            </h1>

            {/* 娃柜属性模块 */}
            <div className="p-4 rounded-2xl bg-white/70 border border-[#CBD7CE]/60 space-y-2 text-sm">
              <h3 className="font-semibold text-[#5B7360] text-xs uppercase tracking-wider mb-2">
                娃柜信息
              </h3>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-sm text-[#4A5D4F]">
                <div>材质：<span className="text-[#2D3A32]">{item.material || '未填写'}</span></div>
                <div>尺寸：<span className="text-[#2D3A32]">{item.size || '未填写'}</span></div>
                <div>颜色：<span className="text-[#2D3A32]">{item.color || '未填写'}</span></div>
                <div>购买渠道：<span className="text-[#2D3A32]">{item.channel || '未填写'}</span></div>
                <div>娃柜价格：<span className="text-[#2D3A32] font-mono font-medium">{formatCurrency(item.cabinetPrice)}</span></div>
                <div>娃柜数量：<span className="text-[#2D3A32] font-mono font-medium">{item.cabinetQuantity || 1}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* 价格与账本明细 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/70 border border-[#CBD7CE] space-y-4">
          <div className="flex items-center justify-between border-b border-[#CBD7CE]/50 pb-2">
            <h3 className="text-sm font-semibold text-[#5B7360]">
              价格明细 ({item.paymentMode === 'full' ? '全款支付' : '定金支付'})
            </h3>
          </div>

          {item.paymentMode === 'full' ? (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#CBD7CE]/70 flex items-center justify-between">
                <div>
                  <div className="text-[#6F8873] text-[11px]">全款金额</div>
                  <div className="text-base font-bold font-mono text-[#233527] mt-0.5">
                    {formatCurrency(item.fullAmount)}
                  </div>
                </div>
                <div className="text-[11px] text-[#7A8E7E] font-mono text-right">
                  {item.fullDate || '未填写'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#CBD7CE]/70 flex items-center justify-between">
                <div>
                  <div className="text-[#6F8873] text-[11px]">邮费</div>
                  <div className="text-base font-bold font-mono text-[#233527] mt-0.5">
                    {formatCurrency(item.fullPostage)}
                  </div>
                </div>
                <div className="text-[11px] text-[#7A8E7E] font-mono text-right">
                  {item.fullPostageDate || item.fullDate || '未填写'}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#CBD7CE]/70 flex items-center justify-between">
                <div>
                  <div className="text-[#6F8873] text-[11px]">定金金额</div>
                  <div className="text-base font-bold font-mono text-[#233527] mt-0.5">
                    {formatCurrency(item.depositAmount)}
                  </div>
                </div>
                <div className="text-[11px] text-[#7A8E7E] font-mono text-right">
                  {item.depositDate || '未填写'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#CBD7CE]/70 flex items-center justify-between">
                <div>
                  <div className="text-[#6F8873] text-[11px]">尾款金额</div>
                  <div className="text-base font-bold font-mono text-[#233527] mt-0.5">
                    {formatCurrency(item.finalAmount)}
                  </div>
                </div>
                <div className="text-[11px] text-[#7A8E7E] font-mono text-right">
                  {item.finalDate || '未填写'}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#CBD7CE]/70 flex items-center justify-between">
                <div>
                  <div className="text-[#6F8873] text-[11px]">邮费</div>
                  <div className="text-base font-bold font-mono text-[#233527] mt-0.5">
                    {formatCurrency(item.depositPostage)}
                  </div>
                </div>
                <div className="text-[11px] text-[#7A8E7E] font-mono text-right">
                  {item.depositPostageDate || '未填写'}
                </div>
              </div>
            </div>
          )}

          {/* 转卖信息 (若已转卖) */}
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
          <div className="p-4 sm:p-5 rounded-2xl bg-white/60 border border-[#CBD7CE]/60 text-xs sm:text-sm space-y-1">
            <span className="text-xs text-[#7A8E7E] font-medium">备注：</span>
            <p className="text-[#2D3A32] whitespace-pre-wrap leading-relaxed">{item.notes}</p>
          </div>
        )}

        {/* 页面下方：只放一个编辑信息按钮 */}
        <div className="pt-4 border-t border-[#CBD7CE]/50 flex justify-end">
          <button
            onClick={() => onEdit(item)}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#5B7360] hover:bg-[#4D6352] active:scale-[0.98] rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            <span>编辑信息</span>
          </button>
        </div>
      </div>
    </div>
  );
};
