import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { Customer, User, SharedMember } from '../../types';
import { Badge } from '../common/Badge';
import { Drawer } from '../common/Drawer';
import { useTranslation } from 'react-i18next';

interface CustomerDetailPanelProps {
  customer: Customer | null;
  onClose: () => void;
  canEdit: boolean;
  canShare: boolean;
  users: User[];
  onUpdate: (id: string, updates: Partial<Customer>) => void;
  onAddShared: (customerId: string, member: SharedMember) => void;
  onRemoveShared: (customerId: string, userId: string) => void;
}

export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({ 
    customer, onClose, canEdit, canShare, users, onUpdate, onAddShared, onRemoveShared 
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{name: string, phone: string, tags: string}>({name: '', phone: '', tags: ''});
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (customer) {
        setIsEditing(false);
        setEditForm({ name: '', phone: '', tags: '' });
    }
  }, [customer]);

  const startEditing = () => {
    if(!customer) return;
    setEditForm({
      name: customer.name,
      phone: customer.phone,
      tags: customer.tags.join(', ')
    });
    setIsEditing(true);
  };

  const saveEditing = () => {
    if(!customer) return;
    onUpdate(customer.id, {
      name: editForm.name,
      phone: editForm.phone,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean)
    });
    setIsEditing(false);
  };

  if (!customer) return null;

  return (
    <>
    <Drawer isOpen={!!customer} onClose={onClose} className="max-w-xl">
        <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
            <div className="flex-1 mr-4">
                {isEditing ? (
                    <div className="space-y-2">
                        <input 
                        className="text-2xl font-bold text-gray-900 border-b border-gray-300 outline-none focus:border-blue-500 w-full"
                        value={editForm.name}
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                        placeholder={t('crm.detail.placeholder_name')}
                        />
                        <input 
                        className="text-sm text-gray-500 border-b border-gray-300 outline-none focus:border-blue-500 w-full font-mono"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                        placeholder={t('crm.detail.placeholder_phone')}
                        />
                    </div>
                ) : (
                    <>
                    <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
                    <div className="text-gray-500 text-sm mt-1">{customer.phone}</div>
                    </>
                )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                {canEdit && !isEditing && (
                    <button onClick={startEditing} className="text-gray-400 hover:text-blue-600 p-2 rounded hover:bg-gray-50 transition-colors">
                        <Edit3 size={20} />
                    </button>
                )}
                    {isEditing && (
                    <button onClick={saveEditing} className="text-green-600 hover:text-green-700 p-2 rounded hover:bg-green-50 transition-colors">
                        <Save size={20} />
                    </button>
                )}
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded hover:bg-gray-50">
                    <X size={24} />
                </button>
            </div>
        </div>

        <div className="p-6 space-y-8">
            {/* Tags */}
            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('crm.detail.tags_title')}</h3>
                {isEditing ? (
                    <div className="space-y-1">
                        <input 
                        className="w-full border p-2 rounded text-sm text-gray-700"
                        value={editForm.tags}
                        onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                        placeholder={t('crm.detail.placeholder_tags')}
                        />
                        <div className="text-[10px] text-gray-400">{t('crm.detail.placeholder_tags')}</div>
                    </div>
                ) : (
                    <div className="flex gap-2 flex-wrap">
                    {customer.tags.map(tag => (
                        <Badge key={tag} variant="neutral">{tag}</Badge>
                    ))}
                    {canEdit && (
                        <button 
                            onClick={startEditing}
                            className="text-xs border border-dashed border-gray-300 rounded px-2 py-0.5 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                        >
                            {t('crm.detail.edit_tags')}
                        </button>
                    )}
                    </div>
                )}
            </div>

            {/* Sharing Management */}
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('crm.detail.shared_title')}</h3>
                {canShare && (
                    <button 
                        onClick={() => setIsShareModalOpen(true)}
                        className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <Plus size={14} /> {t('crm.detail.add_member')}
                    </button>
                )}
                </div>
                <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                {customer.sharedWith.length === 0 && (
                    <div className="text-xs text-gray-400 text-center py-2">{t('crm.detail.no_shared')}</div>
                )}
                {customer.sharedWith.map(share => {
                    const u = users.find(u => u.id === share.userId);
                    return (
                        <div key={share.userId} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                    {u?.name.charAt(0)}
                                </div>
                                <span>{u?.name}</span>
                                <span className="text-xs text-gray-400">({t(`consts.shared_role.${share.role}`)})</span>
                            </div>
                            {canShare && (
                                <button 
                                    onClick={() => onRemoveShared(customer.id, share.userId)}
                                    className="text-gray-400 hover:text-red-500"
                                    >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    )
                })}
                </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('crm.detail.activity_title')}</h3>
                <div className="border-l-2 border-gray-100 pl-4 space-y-6">
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white"></div>
                        <div className="text-sm text-gray-900 font-medium">{t('crm.detail.last_interaction')}</div>
                        <div className="text-xs text-gray-500 mt-1">{customer.lastInteraction}</div>
                        <p className="text-sm text-gray-600 mt-2">
                            Customer visited store and inquired about the Minimalist Chair collection.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"></div>
                        <div className="text-sm text-gray-900 font-medium">{t('crm.detail.created')}</div>
                        <div className="text-xs text-gray-500 mt-1">3 months ago</div>
                    </div>
                </div>
            </div>
        </div>
    </Drawer>

    {/* Share Modal */}
    {isShareModalOpen && (
        <div className="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold mb-4">{t('crm.detail.share_modal_title')}</h3>
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    {users.filter(u => u.id !== customer.ownerUserId && !customer.sharedWith.some(s => s.userId === u.id)).map(u => (
                        <div key={u.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group" onClick={() => {
                            onAddShared(customer.id, { userId: u.id, role: 'VIEWER', addedAt: new Date().toISOString() });
                            setIsShareModalOpen(false);
                        }}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                                <div className="text-sm font-medium">{u.name}</div>
                            </div>
                            <Plus size={16} className="text-gray-400 group-hover:text-gray-900" />
                        </div>
                    ))}
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="w-full py-2 text-sm text-gray-500 hover:text-gray-700">{t('common.cancel')}</button>
            </div>
        </div>
    )}
    </>
  );
};