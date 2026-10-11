import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Sparkles, AlertCircle, Trash2, Plus } from 'lucide-react';
import { DollItem, ItemStatus, PaymentMode, DollTag } from '../types';
import { getTodayDateString, roundToTwoDecimals } from '../utils/formatters';
import { PRESET_AVATARS, getStoredTags, saveStoredTags } from '../utils/storage';

interface ItemFormPageProps {
  initialItem?: DollItem | null;
  onBack: () => void;
  onSave: (item: DollItem) => void;
  onDelete?: (itemId: string) => void;
}

const STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: 'owned', label: '已拥有' },
  { value: 'pending_final', label: '待付尾款' },
  { value: 'pending_shipment', label: '待发货' },
  { value: 'resold', label: '已转卖' },
];

export const ItemFormPage: React.FC<ItemFormPageProps> = ({
  initialItem,
  onBack,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(initialItem);
  const today = getTodayDateString();

  // 基础信息
  const [name, setName] = useState('');
  const [tag, setTag] = useState<string>('整娃');
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState<ItemStatus>('owned');

  // Tag 列表
  const [allTags, setAllTags] = useState<string[]>(() => getStoredTags());
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const handleAddNewTag = () => {
    const trimmed = newTagInput.trim();
    if (!trimmed) return;
    if (!allTags.includes(trimmed)) {
      const updated = [...allTags, trimmed];
      setAllTags(updated);
      saveStoredTags(updated);
      setTag(trimmed);
    }
    setNewTagInput('');
    setIsAddingTag(false);
  };

  // 支付方式
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('full');

  // 全款支付：每一项金额与时间都在同一行 (左边金额，右边时间)
  const [fullAmount, setFullAmount] = useState('');
  const [fullDate, setFullDate] = useState(today);
  const [fullPostage, setFullPostage] = useState('');
  const [fullPostageDate, setFullPostageDate] = useState(today);

  // 定金支付：每一项金额与时间都在同一行 (左边金额，右边时间)
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDate, setDepositDate] = useState(today);
  const [finalAmount, setFinalAmount] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const [depositPostage, setDepositPostage] = useState('');
  const [depositPostageDate, setDepositPostageDate] = useState(today);

  // 是否转卖
  const [isResold, setIsResold] = useState(false);
  const [resaleAmount, setResaleAmount] = useState('');
  const [resaleDate, setResaleDate] = useState(today);

  // 娃柜信息
  const [material, setMaterial] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [channel, setChannel] = useState('');
  const [cabinetPrice, setCabinetPrice] = useState('');
  const [cabinetQuantity, setCabinetQuantity] = useState('1');

  // 备注
  const [notes, setNotes] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialItem) {
      setName(initialItem.name || '');
      setTag(initialItem.tag || '整娃');
      setPhotoUrl(initialItem.photoUrl || '');
      setStatus(initialItem.status || 'owned');
      setPaymentMode(initialItem.paymentMode || 'full');

      setFullAmount(initialItem.fullAmount !== null ? String(initialItem.fullAmount) : '');
      setFullDate(initialItem.fullDate || today);
      setFullPostage(initialItem.fullPostage !== null ? String(initialItem.fullPostage) : '');
      setFullPostageDate(initialItem.fullPostageDate || today);

      setDepositAmount(initialItem.depositAmount !== null ? String(initialItem.depositAmount) : '');
      setDepositDate(initialItem.depositDate || today);
      setFinalAmount(initialItem.finalAmount !== null ? String(initialItem.finalAmount) : '');
      setFinalDate(initialItem.finalDate || '');
      setDepositPostage(initialItem.depositPostage !== null ? String(initialItem.depositPostage) : '');
      setDepositPostageDate(initialItem.depositPostageDate || today);

      setIsResold(Boolean(initialItem.isResold));
      setResaleAmount(initialItem.resaleAmount !== null ? String(initialItem.resaleAmount) : '');
      setResaleDate(initialItem.resaleDate || today);

      setMaterial(initialItem.material || '');
      setSize(initialItem.size || '');
      setColor(initialItem.color || '');
      setChannel(initialItem.channel || '');
      setCabinetPrice(initialItem.cabinetPrice !== null ? String(initialItem.cabinetPrice) : '');
      setCabinetQuantity(String(initialItem.cabinetQuantity || 1));

      setNotes(initialItem.notes || '');
    } else {
      setName('');
      setTag('整娃');
      setPhotoUrl(PRESET_AVATARS[0].svgData);
      setStatus('owned');
      setPaymentMode('full');

      setFullAmount('');
      setFullDate(today);
      setFullPostage('');
      setFullPostageDate(today);

      setDepositAmount('');
      setDepositDate(today);
      setFinalAmount('');
      setFinalDate('');
      setDepositPostage('');
      setDepositPostageDate(today);

      setIsResold(false);
      setResaleAmount('');
      setResaleDate(today);

      setMaterial('');
      setSize('');
      setColor('');
      setChannel('');
      setCabinetPrice('');
      setCabinetQuantity('1');

      setNotes('');
    }
  }, [initialItem]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAmountBlur = (value: string, setter: (val: string) => void) => {
    if (!value || value.trim() === '') return;
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      setter(num.toFixed(2));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('请填写物品名称');
      return;
    }

    const now = new Date().toISOString();
    const parsedFullAmt = fullAmount ? roundToTwoDecimals(fullAmount) : null;
    const parsedFullPost = fullPostage ? roundToTwoDecimals(fullPostage) : null;
    const parsedDepAmt = depositAmount ? roundToTwoDecimals(depositAmount) : null;
    const parsedFinAmt = finalAmount ? roundToTwoDecimals(finalAmount) : null;
    const parsedDepPost = depositPostage ? roundToTwoDecimals(depositPostage) : null;
    const parsedResaleAmt = isResold && resaleAmount ? roundToTwoDecimals(resaleAmount) : null;
    const parsedCabinetPrice = cabinetPrice ? roundToTwoDecimals(cabinetPrice) : null;
    const parsedCabinetQty = parseInt(cabinetQuantity, 10) || 1;

    const savedItem: DollItem = {
      id: initialItem?.id || `bjd-${Date.now()}`,
      name: name.trim(),
      tag,
      photoUrl: photoUrl || PRESET_AVATARS[0].svgData,
      status,
      paymentMode,

      fullAmount: parsedFullAmt,
      fullDate,
      fullPostage: parsedFullPost,
      fullPostageDate,

      depositAmount: parsedDepAmt,
      depositDate,
      finalAmount: parsedFinAmt,
      finalDate,
      depositPostage: parsedDepPost,
      depositPostageDate,

      isResold,
      resaleAmount: parsedResaleAmt,
      resaleDate: isResold ? resaleDate : '',

      material: material.trim(),
      size: size.trim(),
      color: color.trim(),
      channel: channel.trim(),
      cabinetPrice: parsedCabinetPrice,
      cabinetQuantity: parsedCabinetQty,

      notes: notes.trim(),

      createdAt: initialItem?.createdAt || now,
      updatedAt: now,
    };

    onSave(savedItem);
  };

  return (
    <div className="space-y-4 max-w-md mx-auto pb-12 animate-fade-in">
      {/* 顶部左上角返回按键 */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          type="button"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A5D4F] hover:text-[#2D3A32] bg-white/70 hover:bg-white rounded-xl border border-[#CBD7CE] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <h2 className="text-xl font-serif-sc font-bold text-[#2D3A32]">
          {isEditing ? '编辑娃物信息' : '创建新娃物'}
        </h2>

        {isEditing && onDelete ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`确定删除娃物「${name || '此娃物'}」吗？`)) {
                onDelete(initialItem!.id);
              }
            }}
            className="p-2 text-red-600/80 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : <div className="w-10" />}
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 信息修改表单 */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 space-y-7 border border-white/80 shadow-md">
        {/* 1. Tag 选择 (选1) */}
        <div>
          <label className="block text-xs font-semibold text-[#4A5D4F] mb-2">
            物品 Tag
          </label>
          <div className="flex flex-wrap gap-1.5 items-center">
            {allTags.map((itemTag) => (
              <button
                key={itemTag}
                type="button"
                onClick={() => setTag(itemTag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all ${
                  tag === itemTag
                    ? 'bg-[#5B7360] text-white shadow-xs'
                    : 'bg-white/80 hover:bg-white text-[#4A5D4F] border border-[#CBD7CE]'
                }`}
              >
                {itemTag}
              </button>
            ))}

            {/* 在所有tag标签后面增加一个SVG图标的小小的加号，点击可以自定义新建tag */}
            <button
              type="button"
              onClick={() => setIsAddingTag(!isAddingTag)}
              className="px-2 py-1.5 rounded-xl border border-dashed border-[#5B7360] text-[#5B7360] hover:bg-[#EAF1EC] text-xs font-medium flex items-center gap-0.5 transition-colors"
              title="新建自定义Tag"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {isAddingTag && (
            <div className="flex items-center gap-2 mt-2 pt-1 animate-fade-in">
              <input
                type="text"
                autoFocus
                value={newTagInput}
                onChange={(e) => setNewTagInput(e.target.value)}
                placeholder="输入新 Tag 名称..."
                className="px-3 py-1.5 text-xs glass-input rounded-xl text-[#2D3A32]"
              />
              <button
                type="button"
                onClick={handleAddNewTag}
                className="px-3 py-1.5 text-xs font-medium bg-[#5B7360] text-white rounded-xl"
              >
                添加
              </button>
            </div>
          )}
        </div>

        {/* 2. 照片上传与名称 */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
          <div className="sm:col-span-4 flex flex-col items-center">
            <div className="relative w-36 h-36 aspect-square rounded-2xl overflow-hidden border border-[#CBD7CE] bg-[#E8ECE8] shadow-inner group flex items-center justify-center">
              <img
                src={photoUrl || PRESET_AVATARS[0].svgData}
                alt="预览"
                className="w-full h-full aspect-square object-cover"
                referrerPolicy="no-referrer"
              />
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="w-5 h-5 mb-1" />
                <span>更换照片</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto max-w-full pb-1">
              {PRESET_AVATARS.map((pr) => (
                <button
                  key={pr.id}
                  type="button"
                  onClick={() => setPhotoUrl(pr.svgData)}
                  className={`w-6 h-6 rounded-md overflow-hidden border shrink-0 ${photoUrl === pr.svgData ? 'border-[#5B7360]' : 'border-transparent'}`}
                >
                  <img src={pr.svgData} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A5D4F] mb-1">
                物品名称
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="物品名称"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm glass-input text-[#2D3A32]"
              />
            </div>

            {/* 当前状态 */}
            <div>
              <label className="block text-xs font-semibold text-[#4A5D4F] mb-1.5">
                当前状态
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st.value}
                    type="button"
                    onClick={() => {
                      setStatus(st.value);
                      if (st.value === 'resold') setIsResold(true);
                    }}
                    className={`py-2 px-3 text-xs font-medium rounded-xl border text-center transition-all ${
                      status === st.value
                        ? 'bg-[#5B7360] text-white border-[#5B7360] shadow-xs'
                        : 'bg-white/70 hover:bg-white text-[#3D4F42] border-[#CBD7CE]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 价格与支付方式 */}
        <div className="p-5 rounded-2xl bg-white/70 border border-[#CBD7CE] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#CBD7CE]/50">
            <span className="text-sm font-semibold text-[#5B7360]">
              价格与支付
            </span>
            <div className="inline-flex p-1 bg-[#E8ECE8] rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMode('full')}
                className={`px-3.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  paymentMode === 'full' ? 'bg-white text-[#2D3A32] shadow-xs font-semibold' : 'text-[#5B7360]'
                }`}
              >
                全款支付
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode('deposit')}
                className={`px-3.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  paymentMode === 'deposit' ? 'bg-white text-[#2D3A32] shadow-xs font-semibold' : 'text-[#5B7360]'
                }`}
              >
                定金支付
              </button>
            </div>
          </div>

          {/* 
            严格遵循用户要求：
            每一个金额和支付时间都放在同一行，一一对应。
            左边金额，右边时间。
            一列一列这个方向只显示不同的选项（如第1行全款，第2行邮费）。
          */}
          {paymentMode === 'full' ? (
            <div className="space-y-3">
              {/* 第1行：全款金额 (左) + 全款支付时间 (右) */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    全款金额
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#7A8E7E]">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fullAmount}
                      onChange={(e) => setFullAmount(e.target.value)}
                      onBlur={(e) => handleAmountBlur(e.target.value, setFullAmount)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm glass-input font-mono tabular-nums text-[#2D3A32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    全款支付时间
                  </label>
                  <input
                    type="date"
                    value={fullDate}
                    onChange={(e) => setFullDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm glass-input text-[#2D3A32]"
                  />
                </div>
              </div>

              {/* 第2行：邮费 (左) + 邮费支付时间 (右) */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    邮费
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#7A8E7E]">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={fullPostage}
                      onChange={(e) => setFullPostage(e.target.value)}
                      onBlur={(e) => handleAmountBlur(e.target.value, setFullPostage)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm glass-input font-mono tabular-nums text-[#2D3A32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    邮费支付时间
                  </label>
                  <input
                    type="date"
                    value={fullPostageDate}
                    onChange={(e) => setFullPostageDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm glass-input text-[#2D3A32]"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 第1行：定金金额 (左) + 定金支付时间 (右) */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    定金金额
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#7A8E7E]">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      onBlur={(e) => handleAmountBlur(e.target.value, setDepositAmount)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm glass-input font-mono tabular-nums text-[#2D3A32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    定金支付时间
                  </label>
                  <input
                    type="date"
                    value={depositDate}
                    onChange={(e) => setDepositDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm glass-input text-[#2D3A32]"
                  />
                </div>
              </div>

              {/* 第2行：尾款金额 (左) + 尾款支付时间 (右) */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    尾款金额
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#7A8E7E]">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(e.target.value)}
                      onBlur={(e) => handleAmountBlur(e.target.value, setFinalAmount)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm glass-input font-mono tabular-nums text-[#2D3A32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    尾款支付时间
                  </label>
                  <input
                    type="date"
                    value={finalDate}
                    onChange={(e) => setFinalDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm glass-input text-[#2D3A32]"
                  />
                </div>
              </div>

              {/* 第3行：邮费 (左) + 邮费支付时间 (右) */}
              <div className="grid grid-cols-2 gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    邮费
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#7A8E7E]">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={depositPostage}
                      onChange={(e) => setDepositPostage(e.target.value)}
                      onBlur={(e) => handleAmountBlur(e.target.value, setDepositPostage)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm glass-input font-mono tabular-nums text-[#2D3A32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                    邮费支付时间
                  </label>
                  <input
                    type="date"
                    value={depositPostageDate}
                    onChange={(e) => setDepositPostageDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm glass-input text-[#2D3A32]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 是否转卖：无冗余文案，纯粹控件 */}
          <div className="pt-3 border-t border-[#CBD7CE]/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#4A5D4F]">
                是否转卖
              </span>
              <div className="inline-flex p-1 bg-[#E8ECE8] rounded-xl">
                <button
                  type="button"
                  onClick={() => setIsResold(false)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    !isResold ? 'bg-white text-[#2D3A32] shadow-xs font-semibold' : 'text-[#5B7360]'
                  }`}
                >
                  否
                </button>
                <button
                  type="button"
                  onClick={() => setIsResold(true)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                    isResold ? 'bg-[#B86B53] text-white shadow-xs font-semibold' : 'text-[#5B7360]'
                  }`}
                >
                  是
                </button>
              </div>
            </div>

            {/* 当选择“是”时，同一行：左边转卖金额，右边转卖时间 */}
            {isResold && (
              <div className="grid grid-cols-2 gap-3 items-end mt-3 p-3 bg-[#FAF3F0] rounded-xl border border-[#E8C5B8]">
                <div>
                  <label className="block text-xs font-medium text-[#8D4B38] mb-1">
                    转卖金额
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-[#B86B53]">¥</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={resaleAmount}
                      onChange={(e) => setResaleAmount(e.target.value)}
                      onBlur={(e) => handleAmountBlur(e.target.value, setResaleAmount)}
                      placeholder="0.00"
                      className="w-full pl-7 pr-3 py-2 rounded-xl text-sm bg-white border border-[#E8C5B8] font-mono tabular-nums text-[#2D3A32]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#8D4B38] mb-1">
                    转卖时间
                  </label>
                  <input
                    type="date"
                    value={resaleDate}
                    onChange={(e) => setResaleDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-white border border-[#E8C5B8] text-[#2D3A32]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. 娃柜信息填写模块 (无多余教学说教文案) */}
        <div className="p-5 rounded-2xl bg-white/60 border border-[#CBD7CE] space-y-3">
          <h3 className="text-sm font-semibold text-[#5B7360]">
            娃柜信息
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                材质
              </label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="材质"
                className="w-full px-3 py-2 rounded-xl text-xs glass-input text-[#2D3A32]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                尺寸
              </label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="尺寸"
                className="w-full px-3 py-2 rounded-xl text-xs glass-input text-[#2D3A32]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                颜色
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="颜色"
                className="w-full px-3 py-2 rounded-xl text-xs glass-input text-[#2D3A32]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                购买渠道
              </label>
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="购买渠道"
                className="w-full px-3 py-2 rounded-xl text-xs glass-input text-[#2D3A32]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                娃柜价格
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-[#7A8E7E]">¥</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={cabinetPrice}
                  onChange={(e) => setCabinetPrice(e.target.value)}
                  onBlur={(e) => handleAmountBlur(e.target.value, setCabinetPrice)}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 rounded-xl text-xs glass-input font-mono tabular-nums text-[#2D3A32]"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#4A5D4F] mb-1">
                娃柜数量
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={cabinetQuantity}
                onChange={(e) => setCabinetQuantity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-xs glass-input font-mono tabular-nums text-[#2D3A32]"
              />
            </div>
          </div>
        </div>

        {/* 5. 备注栏 */}
        <div>
          <label className="block text-xs font-semibold text-[#4A5D4F] mb-1">
            备注
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="自定义内容备注..."
            className="w-full px-3.5 py-2.5 rounded-xl text-sm glass-input text-[#2D3A32] resize-y"
          />
        </div>

        {/* 底部按钮 */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#CBD7CE]/50">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2 text-sm font-medium text-[#5B7360] hover:text-[#2D3A32] rounded-xl transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-semibold text-white bg-[#5B7360] hover:bg-[#4D6352] active:scale-[0.98] rounded-xl shadow-xs transition-all"
          >
            确认保存
          </button>
        </div>
      </form>
    </div>
  );
};
