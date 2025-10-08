import { useState, useEffect, useRef } from "react";
import MainLayout from "../../layouts/MainLayout";
import { downloadImage, generateFilenameFromPrompt } from "../../services";
import DownloadModal from "../../components/DownloadModal";
import { api } from "../../lib/api";

export default function IA() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const messagesEndRef = useRef(null);

  // Não precisamos mais de limpeza de memória pois usamos URLs diretas da OpenAI

  // Scroll automático para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: prompt,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    const currentPrompt = prompt;
    setPrompt("");

    try {
      // Chamada real para o backend usando o endpoint com URL
      const response = await api.post('/api/image/generate', {
        prompt: currentPrompt,
        model: "dall-e-3",
        size: "1024x1024",
        quality: "standard",
        style: "vivid"
      });

      if (response.success && response.data && response.data.url) {
        const imageMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: currentPrompt,
          image: {
            url: response.data.url,
            prompt: currentPrompt,
            id: Date.now(),
            created: response.data.created,
            model: response.data.model,
            size: response.data.size,
            quality: response.data.quality,
            style: response.data.style
          },
          timestamp: new Date(),
          status: 'pending' // Aguardando aprovação
        };
        
        setMessages(prev => [...prev, imageMessage]);
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: `Erro ao gerar imagem: ${error.message}`,
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleConfirmImage(messageId) {
    setCurrentImage(messages.find(m => m.id === messageId)?.image);
    setShowDownloadModal(true);
  }

  function handleCloseDownloadModal() {
    setShowDownloadModal(false);
    setCurrentImage(null);
    
    // Atualiza a mensagem para aprovada
    setMessages(prev => prev.map(msg => 
      msg.id === currentImage?.id 
        ? { ...msg, status: 'approved' }
        : msg
    ));
  }

  function handleAlterImage(messageId) {
    const message = messages.find(m => m.id === messageId);
    if (message?.image) {
      setPrompt(message.image.prompt);
    }
  }


      return (
        <MainLayout>
          <div className="h-dvh overflow-hidden flex items-center justify-center p-6">
            <div className="max-w-5xl w-full h-[90vh] flex flex-col bg-[#0f0f0f] rounded-2xl border border-[#333] overflow-hidden">
              {/* Header do Chat */}
              <div className="bg-[#0b0b0b] border-b border-[#333] px-6 py-4 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">Gerador de Imagens IA</h1>
                    <p className="text-gray-400 text-sm">Descreva sua tatuagem ideal</p>
                  </div>
                </div>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 hover:scrollbar-thumb-gray-500">
                <div className="px-6 py-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-semibold text-white mb-3">Bem-vindo ao Gerador de Imagens IA!</h2>
                      <p className="text-gray-400 mb-8 max-w-lg mx-auto">Descreva a tatuagem que você gostaria de gerar e eu criarei uma imagem única para você.</p>
                      <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-6 max-w-lg mx-auto">
                        <p className="text-gray-300 text-sm leading-relaxed">
                          <strong className="text-blue-400">Exemplo:</strong> "Tatuagem de dragão oriental em estilo tradicional japonês, com cores vibrantes e detalhes em preto"
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                            {message.type === 'user' ? (
                              <div className="bg-blue-600 text-white p-4 rounded-lg rounded-br-sm">
                                <p>{message.content}</p>
                              </div>
                            ) : message.isError ? (
                              <div className="bg-red-900/50 border border-red-500/30 text-red-200 p-4 rounded-lg rounded-bl-sm">
                                <p>{message.content}</p>
                              </div>
                            ) : (
                              <div className="bg-[#1a1a1a] border border-[#333] p-5 rounded-lg rounded-bl-sm">
                                <div className="mb-4">
                                  <p className="text-gray-300 text-sm mb-3">
                                    <strong>Prompt:</strong> {message.content}
                                  </p>
                                  <div className="relative group cursor-pointer" onClick={() => window.open(message.image.url, '_blank')}>
                                    <img
                                      src={message.image.url}
                                      alt="Imagem gerada"
                                      className="w-full max-w-md h-auto rounded-lg border border-[#333] transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                                      <div className="text-white text-center p-4">
                                        <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <p className="text-xs font-medium">Clique para ver em tamanho real</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {message.status === 'pending' && (
                                  <div className="flex gap-3">
                                    <button
                                      onClick={() => handleConfirmImage(message.id)}
                                      className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                      </svg>
                                      Aprovar & Baixar
                                    </button>
                                    <button
                                      onClick={() => handleAlterImage(message.id)}
                                      className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-lg text-sm font-semibold inline-flex items-center gap-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                      Gerar Nova
                                    </button>
                                  </div>
                                )}

                                {message.status === 'approved' && (
                                  <div className="text-green-400 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Imagem aprovada e baixada
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-[#1a1a1a] border border-[#333] p-5 rounded-lg rounded-bl-sm">
                            <div className="flex items-center gap-4">
                              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </div>
                              <p className="text-gray-300 font-medium">Gerando sua imagem...</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-[#0b0b0b] border-t border-[#333] px-6 py-4 shrink-0">
                <div className="flex gap-3">
                  <textarea
                    className="flex-1 input-field px-4 py-3 rounded-lg resize-none"
                    placeholder="Descreva a tatuagem que você gostaria de gerar..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleGenerate();
                      }
                    }}
                    rows={1}
                    style={{ minHeight: '48px', maxHeight: '120px' }}
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="btn-primary px-6 py-3 rounded-lg font-semibold disabled:opacity-60 inline-flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>

      {/* Modal de Download */}
      <DownloadModal
        isOpen={showDownloadModal}
        onClose={handleCloseDownloadModal}
        imageData={currentImage}
        prompt={currentImage?.prompt || ""}
      />
    </MainLayout>
  );
}
