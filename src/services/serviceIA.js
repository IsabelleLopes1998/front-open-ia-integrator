/**
 * Serviço para funcionalidades relacionadas à IA
 * Especializado para integração com OpenAI Image Generation API
 */

/**
 * Baixa uma imagem a partir de uma URL
 * @param {string} imageUrl - URL da imagem
 * @param {string} filename - Nome do arquivo (opcional)
 */
export async function downloadImage(imageUrl, filename = null) {
  try {
    // Busca a imagem por URL com configurações específicas para CORS
    console.log('🔄 Baixando imagem da URL:', imageUrl);

    let blob;
    try {
      const response = await fetch(imageUrl, {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Accept': 'image/*' }
      });

      if (!response.ok) {
        console.error('❌ Erro na resposta:', response.status, response.statusText);
        throw new Error(`Erro ao buscar a imagem: ${response.status} ${response.statusText}`);
      }

      blob = await response.blob();
      console.log('✅ Blob criado com sucesso:', blob.size, 'bytes');
    } catch (fetchError) {
      console.warn('⚠️ Fetch falhou por CORS, usando método alternativo:', fetchError.message);
      const newWindow = window.open(imageUrl, '_blank');
      if (newWindow) {
        console.log('✅ Imagem aberta em nova aba');
        return {
          success: true,
          filename: filename || generateFilenameFromPrompt('imagem'),
          method: 'new-tab',
          message: 'Imagem aberta em nova aba. Use Ctrl+S para salvar.'
        };
      }
      throw fetchError;
    }
    
    // Cria URL temporária para o blob
    const blobUrl = window.URL.createObjectURL(blob);
    console.log('🔗 Blob URL criada:', blobUrl);
    
    // Cria elemento de download temporário
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Define nome do arquivo
    if (!filename) {
      filename = `imagem-ia-${Date.now()}.png`;
    }
    
    link.download = filename;
    link.style.display = 'none'; // Esconde o link
    
    // Adiciona ao DOM temporariamente e clica
    document.body.appendChild(link);
    console.log('📥 Iniciando download:', filename);
    link.click();
    
    // Remove do DOM e limpa URL após um pequeno delay
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      console.log('🧹 Limpeza concluída');
    }, 100);
    
    return { success: true, filename };
  } catch (error) {
    console.error('❌ Erro ao baixar imagem:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Gera nome de arquivo baseado no prompt
 * @param {string} prompt - Prompt usado para gerar a imagem
 * @returns {string} Nome do arquivo sanitizado
 */
export function generateFilenameFromPrompt(prompt) {
  if (!prompt) return `imagem-ia-${Date.now()}.png`;
  
  // Remove caracteres especiais e espaços
  const sanitized = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50); // Limita tamanho
  
  return `${sanitized}-${Date.now()}.png`;
}
