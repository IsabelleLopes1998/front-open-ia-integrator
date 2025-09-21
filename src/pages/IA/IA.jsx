import { useState, useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import { downloadImage, generateFilenameFromPrompt, base64ToObjectURL, revokeObjectURL } from "../../services";
import DownloadModal from "../../components/DownloadModal";

export default function IA() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null); // Imagem atual sendo avaliada
  const [isEvaluating, setIsEvaluating] = useState(false); // Se está na fase de avaliação
  const [showDownloadModal, setShowDownloadModal] = useState(false); // Controla o modal de download

  // Limpeza de memória quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (currentImage?.url) {
        revokeObjectURL(currentImage.url);
      }
    };
  }, [currentImage]);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);
    setIsEvaluating(false);
    setCurrentImage(null);

    // Simulação de resposta da OpenAI (substitua pela chamada real da API)
    setTimeout(() => {
      const id = Date.now();
      // Simulando base64 de uma imagem (em produção, viria da OpenAI)
      const mockBase64 = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
      
      // Converte base64 para URL de objeto para exibição
      const objectURL = base64ToObjectURL(mockBase64);
      
      if (objectURL) {
        const newImage = { 
          url: objectURL, 
          base64: mockBase64,
          prompt: prompt,
          id: id,
          approved: false,
          status: 'pending' // pending, approved, rejected
        };
        
        setCurrentImage(newImage);
        setIsEvaluating(true);
      }
      
      setLoading(false);
    }, 700);
  }

  function handleConfirmImage() {
    if (!currentImage) return;
    
    // Mostra o modal de download
    setShowDownloadModal(true);
  }

  function handleCloseDownloadModal() {
    setShowDownloadModal(false);
    
    // Limpa o estado de avaliação
    setCurrentImage(null);
    setIsEvaluating(false);
    setPrompt(""); // Limpa o prompt para nova geração
  }

  function handleAlterImage() {
    if (!currentImage) return;
    
    // Limpa a URL do objeto da memória
    if (currentImage.url) {
      revokeObjectURL(currentImage.url);
    }
    
    // Limpa o estado de avaliação mas mantém o prompt para alteração
    setCurrentImage(null);
    setIsEvaluating(false);
    // Não limpa o prompt para permitir alterações
  }


  return (
    <MainLayout><div div className="max-w-6xl mx-auto">
        
        <div className="lg:ml-64 p-6">
            <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Gerar Imagens com IA</h1>
            <p className="text-gray-400"></p>
            </div>

            <div className="card p-8 rounded-2xl mb-8">
            <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-3">
                Descreva a tatuagem desejada
                </label>
                <textarea
                className="input-field w-full px-4 py-4 rounded-lg h-32 resize-none"
                placeholder="Ex: Tatuagem de dragão oriental em estilo tradicional japonês, com cores vibrantes e detalhes em preto..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                />
            </div>

            <div className="text-center">
                <button
                onClick={handleGenerate}
                disabled={loading || isEvaluating}
                className="btn-primary px-8 py-4 rounded-lg font-semibold text-lg disabled:opacity-60 inline-flex items-center"
                >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
                {loading ? "Gerando..." : isEvaluating ? "Avaliando..." : "Gerar Imagem"}
                </button>
            </div>
            </div>

            {/* Área de avaliação da imagem atual */}
            {isEvaluating && currentImage && (
                <div className="card p-8 rounded-2xl mb-8">
                    <h2 className="text-xl font-bold text-white mb-4 text-center">Avalie a imagem gerada</h2>
                    <div className="max-w-md mx-auto mb-6">
                        <img 
                            src={currentImage.url} 
                            alt="Imagem para avaliação" 
                            className="w-full h-auto rounded-lg border border-[#333]" 
                        />
                    </div>
                    <div className="text-center space-x-4">
                        <button
                            onClick={handleConfirmImage}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Aprovar & Baixar
                        </button>
                        <button
                            onClick={handleAlterImage}
                            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Gerar Nova
                        </button>
                    </div>
                </div>
            )}
            </div>
        </div> 
    </div>

    {/* Modal de Download */}
    <DownloadModal
      isOpen={showDownloadModal}
      onClose={handleCloseDownloadModal}
      imageData={currentImage}
      prompt={prompt}
    />
    </MainLayout>
  );
}
