import { useState } from "react";
import { downloadImage, generateFilenameFromPrompt, revokeObjectURL } from "../services";

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
      const result = await downloadImage(
        imageData.base64 || imageData.url, 
        filename, 
        !!imageData.base64
      );
      
      if (result.success) {
        console.log(`Imagem baixada: ${result.filename}`);
        alert(`Imagem baixada com sucesso: ${result.filename}`);
        onClose(); // Fecha o modal após sucesso
      } else {
        console.error('Erro ao baixar imagem:', result.error);
        alert('Erro ao baixar imagem. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao processar download:', error);
      alert('Erro ao processar download. Tente novamente.');
    } finally {
      setDownloading(false);
    }
  };

  const handleClose = () => {
    // Limpa a URL do objeto da memória ao fechar
    if (imageData.url) {
      revokeObjectURL(imageData.url);
    }
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

          {/* Botões */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleClose}
              className="px-6 py-3 rounded-lg font-semibold border border-[#333] text-gray-300 hover:text-white hover:border-gray-500 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="btn-primary px-6 py-3 rounded-lg font-semibold disabled:opacity-60 inline-flex items-center gap-2"
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Baixando...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Baixar Imagem
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
