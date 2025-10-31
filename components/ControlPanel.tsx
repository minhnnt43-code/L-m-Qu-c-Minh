
import React from 'react';
import { TextElement } from '../types';
import { UploadIcon } from './icons';

interface ControlPanelProps {
  onTemplateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFontChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  namesList: string;
  onNamesListChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  textElements: TextElement[];
  onTextElementChange: (id: number, newText: string) => void;
  onTextElementPropChange: <K extends keyof TextElement>(id: number, prop: K, value: TextElement[K]) => void;
}

const FileInput: React.FC<{ id: string; label: string; accept: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ id, label, accept, onChange }) => (
  <div className="w-full">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 border border-gray-300 px-4 py-2 flex items-center justify-center text-sm">
      <UploadIcon className="w-5 h-5 mr-2"/>
      <span>Chọn tệp</span>
      <input id={id} name={id} type="file" className="sr-only" accept={accept} onChange={onChange} />
    </label>
  </div>
);

export const ControlPanel: React.FC<ControlPanelProps> = ({
  onTemplateChange,
  onFontChange,
  namesList,
  onNamesListChange,
  textElements,
  onTextElementChange,
  onTextElementPropChange,
}) => {
  return (
    <div className="w-full lg:w-1/3 xl:w-1/4 p-6 bg-gray-50 h-full overflow-y-auto space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Bảng điều khiển</h2>
      
      <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">1. Tải lên</h3>
        <FileInput id="template-upload" label="Mẫu chứng chỉ" accept="image/*" onChange={onTemplateChange} />
        <FileInput id="font-upload" label="Phông chữ tùy chỉnh" accept=".ttf,.otf,.woff,.woff2" onChange={onFontChange} />
      </div>

      <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">2. Nhập nội dung</h3>
        <div>
          <label htmlFor="names-list" className="block text-sm font-medium text-gray-700">
            Danh sách tên (mỗi tên một dòng)
          </label>
          <textarea
            id="names-list"
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nguyễn Văn A&#10;Trần Thị B&#10;Lê Văn C"
            value={namesList}
            onChange={onNamesListChange}
          />
        </div>
      </div>

      <div className="space-y-6 p-4 border rounded-lg bg-white shadow-sm">
        <h3 className="font-semibold text-lg text-gray-700 border-b pb-2">3. Tùy chỉnh văn bản</h3>
        {textElements.map(el => (
          <div key={el.id} className="space-y-3 pt-2">
            <h4 className="font-medium text-gray-600">{el.name}</h4>
            { el.name !== 'Tên người nhận' && (
               <div>
                <label htmlFor={`text-${el.id}`} className="block text-xs font-medium text-gray-500">Nội dung</label>
                <input
                  type="text"
                  id={`text-${el.id}`}
                  value={el.text}
                  onChange={(e) => onTextElementChange(el.id, e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor={`size-${el.id}`} className="block text-xs font-medium text-gray-500">Cỡ chữ (px)</label>
                <input
                  type="number"
                  id={`size-${el.id}`}
                  value={el.fontSize}
                  onChange={(e) => onTextElementPropChange(el.id, 'fontSize', parseInt(e.target.value, 10))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor={`color-${el.id}`} className="block text-xs font-medium text-gray-500">Màu chữ</label>
                <input
                  type="color"
                  id={`color-${el.id}`}
                  value={el.color}
                  onChange={(e) => onTextElementPropChange(el.id, 'color', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm h-[38px]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
