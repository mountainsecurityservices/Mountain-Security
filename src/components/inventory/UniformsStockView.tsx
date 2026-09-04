/**
 * Mountain Security Services (MSS) - ERP Platform
 * UniformsStockView.tsx (Phase 6 - Tactical Uniforms & Asset Inventory)
 */

import React, { useState } from 'react';
import {
  Shirt,
  Plus,
  Search,
  CheckCircle2,
  AlertTriangle,
  Package,
  DollarSign,
  X,
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UniformItem } from '../../types';
import { RowActionButtons } from '../common/RowActionButtons';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { RecordDetailModal } from '../common/RecordDetailModal';

export const UniformsStockView: React.FC = () => {
  const { company, uniformStock, guards, createUniformItem, updateUniformItem, deleteUniformItem, issueUniformToGuard, hasPermission, addToast } = useERP();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<UniformItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<UniformItem | null>(null);
  const [detailItem, setDetailItem] = useState<UniformItem | null>(null);
  const [issueModalItem, setIssueModalItem] = useState<UniformItem | null>(null);
  const [selectedGuardId, setSelectedGuardId] = useState(guards[0]?.id || '');
  const [issueQty, setIssueQty] = useState(1);

  const canEdit = hasPermission('INVENTORY_MANAGE') || hasPermission('ALL_ACCESS');
  const canDelete = hasPermission('INVENTORY_MANAGE') || hasPermission('ALL_ACCESS');

  const [formData, setFormData] = useState<Partial<UniformItem>>({
    itemCode: '',
    name: '',
    category: 'Uniform',
    size: 'Standard',
    inStockQuantity: 50,
    reorderLevel: 15,
    costPerUnit: 1200,
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      itemCode: '',
      name: '',
      category: 'Uniform',
      size: 'Standard',
      inStockQuantity: 50,
      reorderLevel: 15,
      costPerUnit: 1200,
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: UniformItem) => {
    setEditingItem(item);
    setFormData({
      itemCode: item.itemCode,
      name: item.name,
      category: item.category,
      size: item.size,
      inStockQuantity: item.inStockQuantity,
      reorderLevel: item.reorderLevel,
      costPerUnit: item.costPerUnit,
    });
    setIsAddModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingItem) {
      const res = updateUniformItem(editingItem.id, {
        itemCode: formData.itemCode || editingItem.itemCode,
        name: formData.name,
        category: formData.category || 'Uniform',
        size: formData.size || 'Standard',
        inStockQuantity: Number(formData.inStockQuantity) || 0,
        reorderLevel: Number(formData.reorderLevel) || 10,
        costPerUnit: Number(formData.costPerUnit) || 1000,
      });
      if (res.success) {
        addToast(`Uniform item ${formData.name} updated successfully`, 'success');
      } else {
        addToast(res.error || 'Failed to update item', 'error');
      }
    } else {
      const count = uniformStock.length + 1;
      const itemCode = formData.itemCode || `UNI-${String(count).padStart(3, '0')}`;

      createUniformItem({
        itemCode,
        name: formData.name || '',
        category: formData.category || 'Uniform',
        size: formData.size || 'Standard',
        inStockQuantity: Number(formData.inStockQuantity) || 20,
        reorderLevel: Number(formData.reorderLevel) || 10,
        costPerUnit: Number(formData.costPerUnit) || 1000,
      });
      addToast(`Item SKU ${itemCode} added to inventory`, 'success');
    }

    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    const res = deleteUniformItem(deletingItem.id);
    if (res.success) {
      setDeletingItem(null);
    } else {
      addToast(res.error || 'Failed to delete item', 'error');
    }
  };

  const handleConfirmIssue = () => {
    if (!issueModalItem || issueQty <= 0) return;
    const selectedGuard = guards.find((g) => g.id === selectedGuardId) || guards[0];
    issueUniformToGuard(issueModalItem.id, selectedGuard.id, issueQty);
    setIssueModalItem(null);
  };

  const filteredStock = uniformStock.filter((u) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.itemCode.toLowerCase().includes(q) || u.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 font-['Space_Grotesk'] tracking-tight">
            Uniforms, Tactical Gear & Inventory Store
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Security uniforms, insignia berets, steel-toe boots, duty belts, and guard issuance logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Inventory Item</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search uniform item, size, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-72 focus:outline-hidden focus:ring-2 focus:ring-red-500 focus:bg-white"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          <strong>{filteredStock.length}</strong> Stock SKUs Registered
        </span>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStock.map((item) => {
          const isLowStock = item.inStockQuantity <= item.reorderLevel;
          return (
            <div
              key={item.id}
              className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {item.itemCode} • {item.category}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">{item.name}</h3>
                  <p className="text-xs text-slate-500 font-mono">Size: {item.size}</p>
                </div>
                {isLowStock ? (
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-rose-100 text-rose-800">
                    LOW STOCK
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-emerald-100 text-emerald-800">
                    IN STOCK
                  </span>
                )}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase">Available</span>
                  <p className="text-xl font-black text-slate-900">{item.inStockQuantity}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase">Cost / Unit</span>
                  <p className="text-xs font-bold text-slate-700">
                    {company.currencySymbol} {item.costPerUnit.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">
                  Reorder at &le; {item.reorderLevel}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIssueModalItem(item);
                      setSelectedGuardId(guards[0]?.id || '');
                      setIssueQty(1);
                    }}
                    disabled={item.inStockQuantity <= 0}
                    className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Issue
                  </button>
                  <RowActionButtons
                    size="sm"
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onView={() => setDetailItem(item)}
                    onEdit={() => handleOpenEdit(item)}
                    onDelete={() => setDeletingItem(item)}
                    viewTooltip="View SKU details"
                    editTooltip="Edit inventory item"
                    deleteTooltip="Delete item SKU"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Item Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base tracking-tight font-['Space_Grotesk']">
                {editingItem ? `Edit Item SKU (${editingItem.itemCode})` : 'Add Uniform / Tactical Equipment SKU'}
              </h3>
              <button onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item SKU / Code</label>
                  <input
                    type="text"
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                    placeholder="e.g. UNI-SHIRT-M"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  >
                    <option value="Uniform">Uniform (Shirt/Trousers)</option>
                    <option value="Footwear">Footwear (Tactical Boots)</option>
                    <option value="Headwear">Headwear (MSS Beret & Insignia)</option>
                    <option value="Gear">Gear (Duty Belts & Holsters)</option>
                    <option value="Comms">Comms (Walkie Talkie Radio)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Description / Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Tactical Combat Boots"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Size Specification</label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="e.g. Size 42 / XL / One Size"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Initial Stock Qty</label>
                  <input
                    type="number"
                    value={formData.inStockQuantity}
                    onChange={(e) => setFormData({ ...formData, inStockQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Reorder Threshold</label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Cost / Unit ({company.currencySymbol})</label>
                  <input
                    type="number"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingItem(null); }}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Save Item SKU'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Issue Modal */}
      {issueModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
            <h3 className="font-extrabold text-base text-slate-900 font-['Space_Grotesk']">
              Issue Uniform / Equipment to Guard
            </h3>
            <p className="text-xs text-slate-600">
              Item: <strong>{issueModalItem.name}</strong> (Available: {issueModalItem.inStockQuantity} units)
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Guard Personnel *</label>
                <select
                  value={selectedGuardId}
                  onChange={(e) => setSelectedGuardId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  {guards.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.guardCode} - {g.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Issue Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={issueModalItem.inStockQuantity}
                  value={issueQty}
                  onChange={(e) => setIssueQty(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setIssueModalItem(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmIssue}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-all text-xs"
              >
                Confirm Issue & Deduct Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Item Confirmation Modal */}
      {deletingItem && (
        <DeleteConfirmationModal
          isOpen={!!deletingItem}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
          recordTitle={`${deletingItem.itemCode} - ${deletingItem.name}`}
          recordId={deletingItem.itemCode}
          moduleName="Uniforms & Gear Inventory"
          warningMessage="Deleting this SKU will remove its inventory record and tracking history from the system."
        />
      )}

      {/* Record Detail Modal */}
      {detailItem && (
        <RecordDetailModal
          isOpen={!!detailItem}
          onClose={() => setDetailItem(null)}
          title={detailItem.name}
          subtitle={`SKU: ${detailItem.itemCode} • Category: ${detailItem.category}`}
          badge={{
            text: detailItem.inStockQuantity <= detailItem.reorderLevel ? 'LOW STOCK' : 'IN STOCK',
            variant: detailItem.inStockQuantity <= detailItem.reorderLevel ? 'rose' : 'emerald',
          }}
          onEdit={() => {
            const item = detailItem;
            setDetailItem(null);
            handleOpenEdit(item);
          }}
          onDelete={() => {
            const item = detailItem;
            setDetailItem(null);
            setDeletingItem(item);
          }}
          canEdit={canEdit}
          canDelete={canDelete}
          fields={[
            { label: 'Item Code / SKU', value: detailItem.itemCode, isMono: true },
            { label: 'Item Name', value: detailItem.name },
            { label: 'Inventory Category', value: detailItem.category },
            { label: 'Standard Size', value: detailItem.size },
            { label: 'Current In-Stock', value: `${detailItem.inStockQuantity} units`, isMono: true },
            { label: 'Reorder Alert Threshold', value: `${detailItem.reorderLevel} units`, isMono: true },
            { label: 'Unit Purchase Cost', value: `${company.currencySymbol} ${detailItem.costPerUnit.toLocaleString()}`, isMono: true },
            { label: 'Total Inventory Valuation', value: `${company.currencySymbol} ${(detailItem.inStockQuantity * detailItem.costPerUnit).toLocaleString()}`, isMono: true, fullWidth: true },
          ]}
        />
      )}
    </div>
  );
};
