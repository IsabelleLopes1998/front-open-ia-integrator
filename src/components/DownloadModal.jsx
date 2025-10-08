import { useState } from "react";
import { downloadImage, generateFilenameFromPrompt } from "../services";

export default function DownloadModal({ 
  isOpen, 
  onClose, 
  imageData, 
  prompt 
}) {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !imageData) return null;

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      const filename = generateFilenameFromPrompt(prompt);
      
      // Usa o método principal de download com URL
      const result = await downloadImage(imageData.url, filename);
      
      if (result.success) {
        console.log(`Imagem baixada: ${result.filename}`);
        
        if (result.method === 'new-tab') {
          // Não mostra alert, apenas log - o usuário já viu a imagem abrir
          console.log('Imagem aberta em nova aba para download manual');
        } else {
          alert(`✅ Download concluído!\nArquivo: ${result.filename}`);
        }
        
        onClose(); // Fecha o modal após sucesso
      } else {
        console.error('Erro no download:', result.error);
        alert('⚠️ Download automático não funcionou.\n\nUse o botão "Abrir em Nova Aba" e pressione Ctrl+S para salvar manualmente.');
      }
    } catch (error) {
      console.error('Erro ao processar download:', error);
      alert('Erro ao processar download. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  };

  const handleClose = () => {
    // Não precisamos mais limpar URLs de objeto pois usamos URLs diretas da OpenAI
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#333]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Imagem Aprovada!</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Imagem */}
          <div className="mb-6">
            <img 
              src={imageData.url} 
              alt="Imagem aprovada" 
              className="w-full h-auto rounded-lg border border-[#333] max-h-96 object-contain mx-auto" 
            />
          </div>

          {/* Informações */}
          <div className="mb-6 text-center">
            <p className="text-gray-300 mb-2">
              <span className="font-medium text-white">Prompt:</span> {prompt}
            </p>
            <p className="text-sm text-gray-400">
              <span className="font-medium">Nome sugerido:</span> {generateFilenameFromPrompt(prompt)}
            </p>
          </div>

              {/* Instruções */}
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-blue-300 font-semibold mb-1">Como baixar sua imagem:</h3>
                    <p className="text-blue-200 text-sm">
                      Clique em "Baixar Imagem" para tentar o download automático. 
                      Se não funcionar, use "Abrir em Nova Aba" e pressione <kbd className="px-1 py-0.5 bg-blue-800 rounded text-xs">Ctrl+S</kbd> para salvar onde quiser.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="btn-primary px-8 py-3 rounded-lg font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2 order-1"
                >
                  {downloading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Tentando baixar...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Baixar Imagem
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => window.open(imageData.url, '_blank')}
                  className="px-8 py-3 rounded-lg font-semibold border border-blue-500 text-blue-400 hover:text-blue-300 hover:border-blue-400 transition-colors duration-200 inline-flex items-center justify-center gap-2 order-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir em Nova Aba
                </button>
                
                <button
                  onClick={handleClose}
                  className="px-6 py-3 rounded-lg font-semibold border border-[#333] text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200 order-3"
                >
                  Cancelar
                </button>
              </div>
        </div>
      </div>
    </div>
  );
}
