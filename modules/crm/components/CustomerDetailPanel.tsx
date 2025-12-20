import React, { useState, useEffect } from 'react';
import { Edit3, Save, X, Plus, Trash2, Send } from 'lucide-react';
import { Customer, SharedMember, Interaction } from '../types';
import { User } from '../../../types'; // Cross-domain reference
import { Badge } from '../../../components/common/Badge';
import { Drawer } from '../../../components/common/Drawer';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../lib/toast';
import { Button } from '../../../components/ui';

interface CustomerDetailPanelProps {
    customer: Customer | null;
    currentUser: User;
    onClose: () => void;
    canEdit: boolean; // 是否有权编辑基本信息
    canShare: boolean; // 是否有权管理共享成员
    users: User[];
    onUpdate: (id: string, updates: Partial<Customer>) => void;
    onAddShared: (customerId: string, member: SharedMember) => void;
    onRemoveShared: (customerId: string, userId: string) => void;
}

/**
 * 客户详情面板 (CustomerDetailPanel)
 * 职责:
 * 1. 以抽屉形式展示客户全貌
 * 2. 提供基本信息的“查看/编辑”模式切换
 * 3. 记录客户互动日志 (Interaction Log)
 * 4. 管理客户的协作共享成员 (Shared Access)
 */
export const CustomerDetailPanel: React.FC<CustomerDetailPanelProps> = ({
    customer, currentUser, onClose, canEdit, canShare, users, onUpdate, onAddShared, onRemoveShared
}) => {
    const { t } = useTranslation();
    const toast = useToast();

    // UI 状态
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<{ name: string, phone: string, tags: string }>({ name: '', phone: '', tags: '' });
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    // 互动记录表单状态
    const [newNote, setNewNote] = useState('');
    const [nextFollowUpDate, setNextFollowUpDate] = useState('');

    // 共享角色选择状态
    const [selectedRole, setSelectedRole] = useState<'VIEWER' | 'EDITOR' | 'MANAGER'>('VIEWER');

    // 当选中的客户变更时，重置所有内部状态
    useEffect(() => {
        if (customer) {
            setIsEditing(false);
            setEditForm({ name: '', phone: '', tags: '' });
            setNewNote('');
            setNextFollowUpDate('');
        }
    }, [customer]);

    // --- 编辑模式逻辑 ---
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

    // --- 添加互动记录 ---
    const handleAddNote = () => {
        if (!customer || !newNote.trim()) return;

        const newInteraction: Interaction = {
            id: Math.random().toString(36).substr(2, 9),
            type: 'NOTE',
            content: newNote,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
            createdBy: currentUser.id
        };

        const updates: Partial<Customer> = {
            interactions: [newInteraction, ...(customer.interactions || [])],
            lastInteraction: 'Just now' // 简化显示，实际应存储 ISO 时间
        };

        if (nextFollowUpDate) {
            updates.nextFollowUp = nextFollowUpDate;
        }

        onUpdate(customer.id, updates);

        setNewNote('');
        setNextFollowUpDate('');
        toast.success(t('alerts.crm.note_added'));
    };

    // --- 添加共享成员 ---
    const handleAddMember = (userId: string) => {
        if (!customer) return;
        onAddShared(customer.id, { userId, role: selectedRole, addedAt: new Date().toISOString() });
        toast.success(t('alerts.crm.shared_success', { role: t(`consts.shared_role.${selectedRole}`) }));
        setIsShareModalOpen(false);
    };

    if (!customer) return null;

    return (
        <>
            <Drawer isOpen={!!customer} onClose={onClose} className="max-w-xl">
                {/* 顶部 Header: 包含姓名、电话和操作按钮 */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div className="flex-1 mr-4">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    className="text-2xl font-bold text-gray-900 border-b border-gray-300 outline-none focus:border-blue-500 w-full"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    placeholder={t('crm.detail.placeholder_name')}
                                />
                                <input
                                    className="text-sm text-gray-500 border-b border-gray-300 outline-none focus:border-blue-500 w-full font-mono"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
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

                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                    {/* 标签管理区域 (Tags) */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('crm.detail.tags_title')}</h3>
                        {isEditing ? (
                            <div className="space-y-1">
                                <input
                                    className="w-full border p-2 rounded text-sm text-gray-700"
                                    value={editForm.tags}
                                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
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

                    {/* 共享协作管理 (Sharing) */}
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

                    {/* 活动时间轴 (Timeline) */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{t('crm.detail.activity_title')}</h3>

                        {/* 新增记录输入框 */}
                        {canEdit && (
                            <div className="flex flex-col gap-2">
                                <textarea
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-blue-500 outline-none resize-none h-20"
                                    placeholder={t('crm.detail.add_note_placeholder')}
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleAddNote();
                                        }
                                    }}
                                />
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">{t('crm.detail.set_followup')}:</span>
                                        <input
                                            type="date"
                                            className="text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 outline-none focus:border-blue-500"
                                            value={nextFollowUpDate}
                                            onChange={(e) => setNextFollowUpDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={handleAddNote}
                                    >
                                        <Send size={12} className="mr-1" /> {t('crm.detail.post')}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* 历史记录列表 */}
                        <div className="border-l-2 border-gray-100 pl-4 space-y-6 mt-4">
                            {(customer.interactions || []).map(interaction => {
                                const user = users.find(u => u.id === interaction.createdBy);
                                return (
                                    <div key={interaction.id} className="relative">
                                        <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${interaction.type === 'NOTE' ? 'bg-blue-500' : 'bg-purple-500'}`}></div>
                                        <div className="flex justify-between items-start">
                                            <div className="text-sm text-gray-900 font-medium">
                                                {t(`consts.interaction_type.${interaction.type}`)}
                                                <span className="font-normal text-gray-500 ml-2">by {user?.name || 'Unknown'}</span>
                                            </div>
                                            <div className="text-[10px] text-gray-400">{interaction.timestamp}</div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-2 rounded whitespace-pre-wrap">
                                            {interaction.content}
                                        </p>
                                    </div>
                                );
                            })}

                            {/* 初始记录 */}
                            <div className="relative">
                                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300 border-2 border-white"></div>
                                <div className="text-sm text-gray-900 font-medium">{t('crm.detail.created')}</div>
                                <div className="text-xs text-gray-500 mt-1">3 months ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Drawer>

            {/* 共享成员选择模态框 */}
            {isShareModalOpen && (
                <div className="fixed inset-0 bg-black/20 z-[60] flex items-center justify-center backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm animate-in slide-in-from-bottom-2">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{t('crm.detail.share_modal_title')}</h3>

                            {/* 权限等级选择器 */}
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium">{t('crm.detail.select_role')}:</span>
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value as any)}
                                    className="bg-gray-50 border border-gray-200 rounded text-xs p-1 outline-none"
                                >
                                    <option value="VIEWER">{t('consts.shared_role.VIEWER')}</option>
                                    <option value="EDITOR">{t('consts.shared_role.EDITOR')}</option>
                                    <option value="MANAGER">{t('consts.shared_role.MANAGER')}</option>
                                </select>
                            </div>
                        </div>

                        {/* 可添加用户列表 (过滤掉已添加的) */}
                        <div className="space-y-2 mb-6 max-h-60 overflow-y-auto">
                            {users.filter(u => u.id !== customer.ownerUserId && !customer.sharedWith.some(s => s.userId === u.id)).map(u => (
                                <div key={u.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer group" onClick={() => handleAddMember(u.id)}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium">{u.name}</div>
                                            <div className="text-[10px] text-gray-400">{u.role}</div>
                                        </div>
                                    </div>
                                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        <Plus size={14} />
                                    </div>
                                </div>
                            ))}
                            {users.filter(u => u.id !== customer.ownerUserId && !customer.sharedWith.some(s => s.userId === u.id)).length === 0 && (
                                <div className="text-center text-sm text-gray-400 py-4">No users available to add.</div>
                            )}
                        </div>
                        <Button variant="ghost" fullWidth onClick={() => setIsShareModalOpen(false)}>{t('common.cancel')}</Button>
                    </div>
                </div>
            )}
        </>
    );
};