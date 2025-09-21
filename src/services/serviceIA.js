/**
 * Serviço para funcionalidades relacionadas à IA
 * Especializado para integração com OpenAI Image Generation API
 */

/**
 * Baixa uma imagem localmente a partir de base64 ou URL
 * @param {string} imageData - Base64 string ou URL da imagem
 * @param {string} filename - Nome do arquivo (opcional)
 * @param {boolean} isBase64 - Se true, trata imageData como base64
 */
export async function downloadImage(imageData, filename = null, isBase64 = false) {
  try {
    let blob;
    
    if (isBase64) {
      // Converte base64 para blob
      const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'image/png' });
    } else {
      // Busca a imagem por URL
      const response = await fetch(imageData);
      if (!response.ok) {
        throw new Error('Erro ao buscar a imagem');
      }
      blob = await response.blob();
    }
    
    // Cria URL temporária para o blob
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Cria elemento de download temporário
    const link = document.createElement('a');
    link.href = blobUrl;
    
    // Define nome do arquivo
    if (!filename) {
      filename = `imagem-ia-${Date.now()}.png`;
    }
    
    link.download = filename;
    
    // Adiciona ao DOM temporariamente e clica
    document.body.appendChild(link);
    link.click();
    
    // Remove do DOM e limpa URL
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    
    return { success: true, filename };
  } catch (error) {
    console.error('Erro ao baixar imagem:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Converte base64 para URL de objeto para exibição
 * @param {string} base64Data - String base64 da imagem
 * @returns {string} URL do objeto para usar em <img src>
 */
export function base64ToObjectURL(base64Data) {
  try {
    const byteCharacters = atob(base64Data.replace(/^data:image\/[a-z]+;base64,/, ''));
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    return window.URL.createObjectURL(blob);
  } catch (error) {
    console.error('Erro ao converter base64:', error);
    return null;
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

/**
 * Valida se uma string é base64 válida
 * @param {string} str - String para validar
 * @returns {boolean} True se for base64 válido
 */
export function isValidBase64(str) {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

/**
 * Limpa URLs de objeto da memória
 * @param {string} objectURL - URL do objeto para limpar
 */
export function revokeObjectURL(objectURL) {
  if (objectURL && objectURL.startsWith('blob:')) {
    window.URL.revokeObjectURL(objectURL);
  }
}
