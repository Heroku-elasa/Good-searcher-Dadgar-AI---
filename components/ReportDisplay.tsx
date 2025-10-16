import React, { useRef, useEffect, useState } from 'react';
import { marked } from 'marked';
import { useLanguage } from '../types';

interface DocumentDisplayProps {
  generatedDocument: string;
  isLoading: boolean;
  error: string | null;
}

const DocumentDisplay: React.FC<DocumentDisplayProps> = ({ generatedDocument, isLoading, error }) => {
  const { t } = useLanguage();
  const endOfReportRef = useRef<HTMLDivElement>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);
  const [reportHtml, setReportHtml] = useState('');

  const isComplete = !isLoading && generatedDocument.length > 0 && !error;

  useEffect(() => {
    if (isLoading) {
      endOfReportRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [generatedDocument, isLoading]);

  useEffect(() => {
    let isMounted = true;
    const parseMarkdown = () => {
      if (generatedDocument) {
        const html = marked.parse(generatedDocument) as string;
        if (isMounted) setReportHtml(html);
      } else {
        if (isMounted) setReportHtml('');
      }
    };
    parseMarkdown();
    return () => { isMounted = false; };
  }, [generatedDocument]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const downloadFile = (filename: string, content: string | Blob | ArrayBuffer, mimeType: string) => {
    const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedDocument);
    setIsExportMenuOpen(false);
  };
  
  const handleDownloadMD = () => {
    downloadFile('document.md', generatedDocument, 'text/markdown;charset=utf-8');
    setIsExportMenuOpen(false);
  };

  const handleDownloadDOCX = async () => {
    const reportHtmlString = marked.parse(generatedDocument) as string;
    try {
      const htmlToDocxModule = await import('html-to-docx');
      const htmlToDocx = htmlToDocxModule.default;
      
      if (typeof htmlToDocx !== 'function') {
        console.error('Failed to load html-to-docx function', htmlToDocxModule);
        throw new Error('Could not convert to DOCX. The library did not load correctly.');
      }

      const docxBlob = await htmlToDocx(reportHtmlString, '', {
        margins: { top: 720, right: 720, bottom: 720, left: 720 }
      });
      downloadFile('document.docx', docxBlob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } catch (e) {
      console.error("Error converting HTML to DOCX:", e);
      alert(e instanceof Error ? e.message : "An error occurred while trying to generate the DOCX file.");
    }
    setIsExportMenuOpen(false);
  };

  const createHtmlContent = (markdownContent: string) => {
    const parsedHtml = marked.parse(markdownContent) as string;
    return `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('reportDisplay.docTitle')}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.8; padding: 2rem; max-width: 800px; margin: 0 auto; color: #333; direction: rtl; text-align: right; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    h1 { border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    code { font-family: monospace; background-color: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
    pre { background-color: #f4f4f4; padding: 1em; border-radius: 5px; overflow-x: auto; text-align: left; direction: ltr; }
    pre code { background-color: transparent; padding: 0; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
    th { background-color: #f2f2f2; }
    blockquote { color: #666; margin: 0; padding-right: 1em; border-right: 0.25em solid #dfe2e5; border-left: 0; }
    ul { padding-right: 20px; }
  </style>
</head>
<body>
  ${parsedHtml}
</body>
</html>`;
  };
  
  const handleDownloadHTML = () => {
    const htmlContent = createHtmlContent(generatedDocument);
    downloadFile('document.html', htmlContent, 'text/html;charset=utf-8');
    setIsExportMenuOpen(false);
  };

  const handlePrint = () => {
    const htmlContent = createHtmlContent(generatedDocument);
    const printWindow = window.open('', '_blank');
    if(printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
    setIsExportMenuOpen(false);
  };

  return (
    <div className="min-h-[60vh] flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white flex items-center" key={isComplete ? 'complete' : 'pending'}>
          {isComplete && (
            <svg className="h-5 w-5 text-green-400 ml-2 animate-fade-in" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {t('reportDisplay.title')}
        </h3>
        {generatedDocument && !isLoading && (
          <div className="relative" ref={exportMenuRef}>
            <button
              onClick={() => setIsExportMenuOpen(prev => !prev)}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-md transition-colors flex items-center"
            >
              {t('reportDisplay.export')}
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isExportMenuOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg z-20 border border-gray-600">
                <ul className="py-1 text-white">
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer" onClick={handleCopy}>{t('reportDisplay.copy')}</li>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer" onClick={handleDownloadMD}>{t('reportDisplay.downloadMD')}</li>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer" onClick={handleDownloadDOCX}>{t('reportDisplay.downloadDOCX')}</li>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer" onClick={handleDownloadHTML}>{t('reportDisplay.downloadHTML')}</li>
                  <li className="px-4 py-2 hover:bg-gray-600 cursor-pointer" onClick={handlePrint}>{t('reportDisplay.printPDF')}</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="p-6 text-gray-300 flex-grow overflow-y-auto bg-gray-900">
        {error && <div className="text-red-400 p-4 bg-red-900/50 rounded-md">{error}</div>}
        
        {!error && reportHtml ? (
            <div className="judicial-letterhead">
                <div className="judicial-header">
                    <img src="data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjgwMHB4IiB3aWR0aD0iODAwcHgiIHZlcnNpb249IjEuMSIgaWQ9Im1hbiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmlld0JveD0iMCAwIDQ3MS4zOCA0NzEuMzgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxnPjxwYXRoIHN0eWxlPSJmaWxsOiMwMTAwMDI7IiBkPSJNMzU4LjgsMTY5LjE0Yy00MS4yMDksMC03OC44MDMsMTkuODg2LTExMC40NjgsNTAuOTY1Yy0zMS42NjUtMzEuMDc5LTY5LjI1OC01MC45NjUtMTEwLjQ2OC01MC45NjVDMTIuNTI4LDE2OS4xNCwwLDE4MC42MTMsMCwyMDEuMTMyYzAsMTMuMzg2LDguMTkzLDI0LjU3MywyMC4wMzIsMjguODIzYy0yLjYwNC04LjMxMS0yLjYwNC0xOS4zNjksMC0yNy42OGM1MTAuNTY4LDI1LjU1NywyMC4wMzIsNDYuNTIsMjAuMDMyLDQ2LjUycy04LjE5My0yMC45NjMtMjAuMDMyLTQ2LjUyYzIuNjA0LDguMzExLDIuNjA0LDE5LjM2OSwwLDI3LjY4Yy0xMS44MzktNC4yNS0yMC4wMzItMTUuNDM4LTIwLjAwOS0yOC44MjNjMC0xMC41MTgsMTIuNTI4LTIxLjk5MSwzNy44OTYtMjEuOTkxYzQwLjA2NSwwLDY5LjI1OCwyMC45NjMsOTIuNjUsNTMuNTcxYzIzLjM5MS0zMi42MDcsNTIuNTg2LTUzLjU3MSw5Mi42NS01My41NzFjMjUuMzY5LDAsMzcuODk2LDExLjQ3MywzNy44OTYsMjEuOTkxYzAsMTMuMzg2LTguMTcwLDI0LjU3My0xOS45OTIsMjguODIzYzIuNjA0LTguMzExLDIuNjA0LTE5LjM2OSwwLTI3LjY4Yy0xMC41NjgsMjUuNTU3LTIwLjAzMiw0Ni41Mi0yMC4wMzIsNDYuNTJzOC4xOTMtMjAuOTYzLDIwLjAzMi00Ni41MmMyLjYwNCw4LjMxMSwyLjYwNCwxOS4zNjksMCwyNy42OGMxMS44MzktNC4yNSwyMC4wMzItMTUuNDM4LDIwLjAzMi0yOC44MjNDNDcxLjM4LDE4MC42MTMsNDU4Ljg1MywxNjkuMTQsMzU4LjgsMTY5LjE0eiIvPjxwYXRoIHN0eWxlPSJmaWxsOiMwMTAwMDI7IiBkPSJNMjM1LjY5LDQyNC45MDRjLTcuMDQ5LDAtMTIuODEtNS43NjEtMTIuODEtMTIuODExVjEwMy45MjRjMC03LjA1LDUuNzYxLTEyLjgxMSwxMi44MS0xMi44MTFjNy4wNSwwLDEyLjgxMSw1LjcuMTIuODExdjMwOC4xN0M0OC41MDEsNDE5LjE0MywyNDIuNzM5LDQyNC45MDQsMjM1LjY5LDQyNC45MDR6IiBV9aCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCjwvZz48L3N2Zz4=" 
                         alt="Judicial Emblem" className="judicial-emblem" />
                    <p className="bismillah">بسمه تعالی</p>
                </div>
                <div 
                    className="judicial-letterhead-content prose max-w-none prose-sm sm:prose-base"
                    dangerouslySetInnerHTML={{ __html: reportHtml }} 
                />
            </div>
        ) : (
            <>
                {isLoading && (
                   <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-400"></div>
                    <span className="mr-2 text-gray-400">{t('reportDisplay.generating')}</span>
                  </div>
                )}

                {!isLoading && !generatedDocument && !error && (
                    <div className="text-center text-gray-500 py-16">
                        <p>{t('reportDisplay.placeholder1')}</p>
                        <p>{t('reportDisplay.placeholder2')}</p>
                    </div>
                )}
            </>
        )}
        <div ref={endOfReportRef} />
      </div>
    </div>
  );
};

export default DocumentDisplay;