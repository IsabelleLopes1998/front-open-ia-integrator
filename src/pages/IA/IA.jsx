import { useState } from "react";
import MainLayout from "../../layouts/MainLayout";

export default function IA() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const id = Date.now();
      const placeholder = `https://picsum.photos/seed/${encodeURIComponent(
        prompt + "-" + id
      )}/600/400`;
      setImages((prev) => [placeholder, ...prev]);
      setLoading(false);
    }, 700);
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
                disabled={loading}
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
                {loading ? "Gerando..." : "Gerar Imagem"}
                </button>
            </div>
            </div>

            {/* Área de imagens geradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((src) => (
                <div key={src} className="rounded-xl overflow-hidden border border-[#222]">
                <img src={src} alt="Imagem gerada" className="w-full h-auto block" />
                </div>
            ))}
            </div>
            </div>
        </div> 
    </div>
    </MainLayout>
  );
}
