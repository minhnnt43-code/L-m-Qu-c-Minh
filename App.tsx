// Fix: Corrected the React import to ensure hooks like useState, useRef, and useCallback are available. The original line likely had a syntax error causing multiple subsequent errors.
import React, { useState, useRef, useCallback } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { CertificatePreview } from './components/CertificatePreview';
import { GeneratedCertificates } from './components/GeneratedCertificates';
// Fix: Imported the Spinner component to resolve the 'Cannot find name 'Spinner'' error.
import { Spinner } from './components/icons';
import { TextElement, GeneratedCertificate } from './types';

const INITIAL_TEXT_ELEMENTS: TextElement[] = [
  {
    id: 1,
    name: 'Tên người nhận',
    text: 'Nguyễn Văn A',
    fontSize: 48,
    color: '#333333',
    position: { x: 200, y: 250 },
    fontFamily: 'serif',
  },
  {
    id: 2,
    name: 'Tên khóa học',
    text: 'Hoàn thành xuất sắc khóa học',
    fontSize: 24,
    color: '#555555',
    position: { x: 230, y: 320 },
    fontFamily: 'serif',
  },
    {
    id: 3,
    name: 'Ngày cấp',
    text: new Date().toLocaleDateString('vi-VN'),
    fontSize: 18,
    color: '#555555',
    position: { x: 350, y: 400 },
    fontFamily: 'serif',
  },
];

const App: React.FC = () => {
  const [templateUrl, setTemplateUrl] = useState<string | null>(null);
  const [customFontFamily, setCustomFontFamily] = useState<string | null>(null);
  const [namesList, setNamesList] = useState<string>('');
  const [textElements, setTextElements] = useState<TextElement[]>(INITIAL_TEXT_ELEMENTS);
  const [generatedCertificates, setGeneratedCertificates] = useState<GeneratedCertificate[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const previewRef = useRef<HTMLDivElement>(null);
  const styleTagRef = useRef<HTMLStyleElement | null>(null);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTemplateUrl(URL.createObjectURL(file));
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fontUrl = URL.createObjectURL(file);
      const newFontFamily = `customFont-${Date.now()}`;
      
      if (!styleTagRef.current) {
        const styleTag = document.createElement('style');
        document.head.appendChild(styleTag);
        styleTagRef.current = styleTag;
      }
      
      const fontFaceRule = `@font-face { font-family: '${newFontFamily}'; src: url('${fontUrl}'); }`;
      styleTagRef.current.innerHTML = fontFaceRule;

      setCustomFontFamily(newFontFamily);
      setTextElements(prev => prev.map(el => ({ ...el, fontFamily: newFontFamily })));
    }
  };

  const handleTextElementChange = (id: number, newText: string) => {
    setTextElements(prev => prev.map(el => el.id === id ? { ...el, text: newText } : el));
  };
  
  const handleTextElementPropChange = useCallback(<K extends keyof TextElement>(id: number, prop: K, value: TextElement[K]) => {
     setTextElements(prev => prev.map(el => el.id === id ? { ...el, [prop]: value } : el));
  }, []);

  const handleTextPositionChange = useCallback((id: number, position: { x: number; y: number }) => {
    setTextElements(prev => prev.map(el => el.id === id ? { ...el, position } : el));
  }, []);

  const generateCertificates = async () => {
    if (!templateUrl) {
      alert('Vui lòng tải lên mẫu chứng chỉ trước.');
      return;
    }
    const names = namesList.split('\n').filter(name => name.trim() !== '');
    if (names.length === 0) {
      alert('Vui lòng nhập ít nhất một tên vào danh sách.');
      return;
    }

    setIsGenerating(true);
    setGeneratedCertificates([]);
    
    const html2canvas = (window as any).html2canvas;
    const certs: GeneratedCertificate[] = [];

    const originalNameElement = textElements.find(el => el.name === 'Tên người nhận');

    for (const name of names) {
      const trimmedName = name.trim();
      setTextElements(prev => prev.map(el => el.name === 'Tên người nhận' ? { ...el, text: trimmedName } : el));
      
      await new Promise(resolve => setTimeout(resolve, 50));

      if (previewRef.current) {
        try {
            const canvas = await html2canvas(previewRef.current, { useCORS: true, backgroundColor: null });
            const dataUrl = canvas.toDataURL('image/png');
            certs.push({ name: trimmedName, dataUrl });
        } catch(err) {
            console.error("Lỗi khi tạo chứng chỉ:", err);
            alert("Đã xảy ra lỗi khi tạo chứng chỉ. Vui lòng kiểm tra console.");
        }
      }
    }
    
    // Restore original text
    if (originalNameElement) {
        setTextElements(prev => prev.map(el => el.id === originalNameElement.id ? originalNameElement : el));
    }

    setGeneratedCertificates(certs);
    setIsGenerating(false);
  };

  const handleDownloadAll = () => {
    const JSZip = (window as any).JSZip;
    const zip = new JSZip();
    
    generatedCertificates.forEach(cert => {
      const imgData = cert.dataUrl.split(',')[1];
      zip.file(`chung-chi-${cert.name.replace(/\s+/g, '-')}.png`, imgData, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'chung-chi.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      <header className="w-full bg-white shadow-md p-4 z-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center">Trình tạo chứng chỉ hàng loạt</h1>
      </header>
      <div className="flex flex-grow overflow-hidden">
        <ControlPanel
          onTemplateChange={handleTemplateChange}
          onFontChange={handleFontChange}
          namesList={namesList}
          onNamesListChange={(e) => setNamesList(e.target.value)}
          textElements={textElements}
          onTextElementChange={handleTextElementChange}
          onTextElementPropChange={handleTextElementPropChange}
        />
        <div className="flex-grow flex flex-col items-center justify-start h-full overflow-y-auto">
            <div className="w-full">
                <CertificatePreview
                  templateUrl={templateUrl}
                  textElements={textElements}
                  onTextPositionChange={handleTextPositionChange}
                  previewRef={previewRef}
                />
            </div>
            <div className="w-full sticky bottom-0 bg-white p-4 border-t shadow-md">
                <button
                    onClick={generateCertificates}
                    disabled={isGenerating || !templateUrl || namesList.trim() === ''}
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isGenerating && <Spinner className="w-5 h-5 mr-3"/>}
                    {isGenerating ? 'Đang xử lý...' : `Tạo ${namesList.split('\n').filter(n=>n.trim()).length || 0} chứng chỉ`}
                </button>
            </div>
             <div className="w-full">
                <GeneratedCertificates
                    certificates={generatedCertificates}
                    isGenerating={isGenerating}
                    onDownloadAll={handleDownloadAll}
                />
             </div>
        </div>
      </div>
    </div>
  );
};

export default App;
