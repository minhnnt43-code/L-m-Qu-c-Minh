
import React from 'react';
import { GeneratedCertificate } from '../types';
import { DownloadIcon, ZipIcon, Spinner } from './icons';

interface GeneratedCertificatesProps {
  certificates: GeneratedCertificate[];
  isGenerating: boolean;
  onDownloadAll: () => void;
}

export const GeneratedCertificates: React.FC<GeneratedCertificatesProps> = ({ certificates, isGenerating, onDownloadAll }) => {
  if (isGenerating) {
    return (
      <div className="w-full text-center p-10">
        <div className="flex justify-center items-center">
            <Spinner className="w-8 h-8 mr-3 text-indigo-600"/>
            <p className="text-lg text-gray-700">Đang tạo chứng chỉ, vui lòng đợi...</p>
        </div>
      </div>
    );
  }

  if (certificates.length === 0) {
    return null;
  }

  return (
    <div className="w-full p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Kết quả ({certificates.length})</h2>
        <button
          onClick={onDownloadAll}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ZipIcon className="w-5 h-5 mr-2" />
          Tải tất cả (.zip)
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {certificates.map((cert) => (
          <div key={cert.name} className="group relative border rounded-lg shadow-sm overflow-hidden bg-white">
            <img src={cert.dataUrl} alt={`Certificate for ${cert.name}`} className="w-full h-auto" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col items-center justify-center p-2">
              <p className="text-white font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">{cert.name}</p>
              <a
                href={cert.dataUrl}
                download={`chung-chi-${cert.name.replace(/\s+/g, '-')}.png`}
                className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <DownloadIcon className="w-4 h-4 mr-1" />
                Tải xuống
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
