import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Plus, Trash2 } from 'lucide-react';
import { Customer, User, SharedMember } from '../../types';
import { Badge } from '../common/Badge';
import { Drawer } from '../common/Drawer';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui';

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
    const [editForm, setEditForm] = useState<{ name: string, phone: string, tags: string }>({ name: '', phone: '', tags: '' });
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    useEffect(() => {
        if (customer) {
            setIsEditing(false);
            setEditForm({ name: '', phone: '', tags: '' });
        }
    }, [customer]);

    const startEditing = () => {
        if (!customer) return;
        setEditForm({
            name: customer.name,
            phone: customer.phone,
            tags: customer.tags.join(', ')
        });
        setIsEditing(true);
    };

    const saveEditing = () => {
        if (!customer) return;
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
                                    className="text-2xl font-bold text-primary border-b border-gray-300 outline-none focus:border-primary w-full"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder={t('crm.detail.placeholder_name')}
                                />
                                <input
                                    className="text-sm text-muted border-b border-gray-300 outline-none focus:border-primary w-full font-mono"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                    placeholder={t('crm.detail.placeholder_phone')}
                                />
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-primary">{customer.name}</h2>
                                <div className="text-muted text-sm mt-1">{customer.phone}</div>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        {canEdit && !isEditing && (
                            <button onClick={startEditing} className="text-gray-400 hover:text-primary p-2 rounded hover:bg-gray-50 transition-colors">
                                <Edit3 size={20} />
                            </button>
                        )}
                        {isEditing && (
                            <button onClick={saveEditing} className="text-success hover:text-success p-2 rounded hover:bg-success-light transition-colors">
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
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{t('crm.detail.tags_title')}</h3>
                        {isEditing ? (
                            <div className="space-y-1">
                                <input
                                    className="w-full border p-2 rounded text-sm text-gray-700"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                                    placeholder={t('crm.detail.placeholder_tags')}
                                />
                                <div className="text-[10px] text-muted">{t('crm.detail.placeholder_tags')}</div>
                            </div>
                        ) : (
                            <div className="flex gap-2 flex-wrap">
                                {customer.tags.map(tag => (
                                    <Badge key={tag} variant="neutral">{tag}</Badge>
                                ))}
                                {canEdit && (
                                    <Button variant="link" size="sm" onClick={startEditing}>
                                        {t('crm.detail.edit_tags')}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sharing Management */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{t('crm.detail.shared_title')}</h3>
                            {canShare && (
                                <Button variant="link" size="sm" onClick={() => setIsShareModalOpen(true)}>
                                    <Plus size={14} className="mr-1" /> {t('crm.detail.add_member')}
                                </Button>
                            )}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                            {customer.sharedWith.length === 0 && (
                                <div className="text-xs text-muted text-center py-2">{t('crm.detail.no_shared')}</div>
                            )}
                            {customer.sharedWith.map(share => {
                                const u = users.find(u => u.id === share.userId);
                                return (
                                    <div key={share.userId} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-muted">
                                                {u?.name.charAt(0)}
                                            </div>
                                            <span>{u?.name}</span>
                                            <span className="text-xs text-muted">({t(`consts.shared_role.${share.role}`)})</span>
                                        </div>
                                        {canShare && (
                                            <button
                                                onClick={() => onRemoveShared(customer.id, share.userId)}
                                                className="text-gray-400 hover:text-danger"
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
                        <h3 className="text-sm font-bold text-primary uppercase tracking-wide">{t('crm.detail.activity_title')}</h3>
                        <div className="border-l-2 border-gray-100 pl-4 space-y-6">
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-info border-2 border-white"></div>
                                <div className="text-sm text-primary font-medium">{t('crm.detail.last_interaction')}</div>
                                <div className="text-xs text-muted mt-1">{customer.lastInteraction}</div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Customer visited store and inquired about the Minimalist Chair collection.
                                </p>
                            </div>
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"></div>
                                <div className="text-sm text-primary font-medium">{t('crm.detail.created')}</div>
                                <div className="text-xs text-muted mt-1">3 months ago</div>
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
                                    <Plus size={16} className="text-gray-400 group-hover:text-primary" />
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" fullWidth onClick={() => setIsShareModalOpen(false)}>{t('common.cancel')}</Button>
                    </div>
                </div>
            )}
        </>
    );
};