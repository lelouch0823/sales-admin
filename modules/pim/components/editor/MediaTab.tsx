import React from 'react';
import { UploadCloud, ArrowLeft, ArrowRight, FileText, Star, Trash2 } from 'lucide-react';
import { MediaAsset } from '../../types';
import { Badge } from '../../../../components/common/Badge';
import { useTranslation } from 'react-i18next';

interface MediaTabProps {
  mediaAssets: MediaAsset[];
  onChange: (assets: MediaAsset[]) => void;
}

export const MediaTab: React.FC<MediaTabProps> = ({ mediaAssets, onChange }) => {
  const { t } = useTranslation();

  const moveMedia = (index: number, direction: 'left' | 'right') => {
      const newMedia = [...mediaAssets];
      const targetIndex = direction === 'left' ? index - 1 : index + 1;
      
      if (targetIndex >= 0 && targetIndex < newMedia.length) {
          [newMedia[index], newMedia[targetIndex]] = [newMedia[targetIndex], newMedia[index]];
          onChange(newMedia);
      }
  };

  const setMainMedia = (index: number) => {
      const newMedia = mediaAssets.map((m, i) => ({
          ...m, isMain: i === index
      }));
      onChange(newMedia);
  };

  const removeMedia = (index: number) => {
      const newMedia = mediaAssets.filter((_, i) => i !== index);
      onChange(newMedia);
  };

  return (
      <div className="space-y-6">
           <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
              <UploadCloud size={32} className="mb-2 group-hover:text-primary transition-colors" />
              <span className="text-sm font-medium">{t('pim.editor.upload_hint')}</span>
              <span className="text-xs text-gray-400 mt-1">{t('pim.editor.simulated_upload')}</span>
           </div>

           <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
               {mediaAssets.map((media, idx) => (
                   <div key={idx} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group border border-gray-200">
                       {/* Image / Content */}
                       {media.type === 'IMAGE' ? (
                           <img src={media.url} className="w-full h-full object-cover" />
                       ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-400">
                               <FileText size={32} />
                           </div>
                       )}

                       {/* Main Label */}
                       {media.isMain && (
                           <div className="absolute top-2 left-2 z-10">
                               <Badge variant="success">{t('common.main')}</Badge>
                           </div>
                       )}

                       {/* Hover Overlay Controls */}
                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                           <div className="flex items-center gap-2">
                                {!media.isMain && media.type === 'IMAGE' && (
                                    <button 
                                        onClick={() => setMainMedia(idx)} 
                                        className="p-1.5 bg-white rounded-full text-gray-600 hover:text-brand"
                                        title={t('pim.editor.make_main')}
                                    >
                                        <Star size={14} />
                                    </button>
                                )}
                                <button 
                                    onClick={() => removeMedia(idx)} 
                                    className="p-1.5 bg-white rounded-full text-gray-600 hover:text-red-600"
                                    title={t('pim.editor.remove')}
                                >
                                    <Trash2 size={14} />
                                </button>
                           </div>
                           
                           {/* Sort Controls */}
                           <div className="flex items-center gap-1 mt-1">
                                <button 
                                    onClick={() => moveMedia(idx, 'left')} 
                                    disabled={idx === 0}
                                    className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                                >
                                    <ArrowLeft size={16} />
                                </button>
                                <button 
                                    onClick={() => moveMedia(idx, 'right')} 
                                    disabled={idx === (mediaAssets.length || 0) - 1}
                                    className="p-1 text-white/70 hover:text-white disabled:opacity-30"
                                >
                                    <ArrowRight size={16} />
                                </button>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
           
           {(!mediaAssets || mediaAssets.length === 0) && (
               <div className="text-center text-sm text-gray-400 py-4">{t('pim.editor.no_media')}</div>
           )}
      </div>
  );
};