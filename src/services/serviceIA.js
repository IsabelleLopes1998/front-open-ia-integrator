/**
 * Serviço para funcionalidades relacionadas à IA
 * Especializado para integração com OpenAI Image Generation API
 */

/**
 * Baixa uma imagem localmente a partir de base64 ou URL
 * @param {string} imageData - Base64 string ou URL da imagem
 * @param {string} filename - Nome do arquivo (opcional)
 */
export async function downloadImage(imageData, filename = null) {
  try {
    let blob;
    
    // Detecta automaticamente se é base64 ou URL
    const isBase64 = imageData.startsWith('data:image/') || 
                     (imageData.length > 100 && !imageData.startsWith('http'));
    
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
      // Busca a imagem por URL com configurações específicas para CORS
      console.log('🔄 Baixando imagem da URL:', imageData);
      
      try {
        const response = await fetch(imageData, {
          method: 'GET',
          mode: 'cors',
          credentials: 'omit',
          headers: {
            'Accept': 'image/*',
          }
        });
        
        if (!response.ok) {
          console.error('❌ Erro na resposta:', response.status, response.statusText);
          throw new Error(`Erro ao buscar a imagem: ${response.status} ${response.statusText}`);
        }
        
        blob = await response.blob();
        console.log('✅ Blob criado com sucesso:', blob.size, 'bytes');
      } catch (fetchError) {
        console.warn('⚠️ Fetch falhou por CORS, usando método alternativo:', fetchError.message);
        
        // Método alternativo: Abrir em nova aba
        const newWindow = window.open(imageData, '_blank');
        if (newWindow) {
          console.log('✅ Imagem aberta em nova aba');
          return { 
            success: true, 
            filename: filename || generateFilenameFromPrompt('imagem'),
            method: 'new-tab',
            message: 'Imagem aberta em nova aba. Use Ctrl+S para salvar.'
          };
        } else {
          throw new Error('Não foi possível abrir a imagem');
        }
      }
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
 * Função alternativa de download que abre a imagem em nova aba
 * @param {string} imageUrl - URL da imagem
 * @param {string} filename - Nome do arquivo (opcional)
 */
export function downloadImageAlternative(imageUrl, filename = null) {
  try {
    // Abre a imagem em uma nova aba para o usuário salvar manualmente
    const newWindow = window.open(imageUrl, '_blank');
    
    if (!newWindow) {
      // Se popup foi bloqueado, cria um link temporário
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    return { success: true, method: 'new_tab' };
  } catch (error) {
    console.error('Erro no download alternativo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Baixa uma imagem através do proxy do backend (contorna CORS)
 * @param {string} imageUrl - URL da imagem da OpenAI
 * @param {string} filename - Nome do arquivo (opcional)
 */
export async function downloadImageViaProxy(imageUrl, filename = null) {
  try {
    console.log('🔄 Baixando via proxy:', imageUrl);
    
    const response = await fetch('/api/image/download-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl })
    });
    
    if (!response.ok) {
      throw new Error(`Erro no proxy: ${response.status} ${response.statusText}`);
    }
    
    // Converte a resposta para blob
    const blob = await response.blob();
    console.log('✅ Blob recebido via proxy:', blob.size, 'bytes');
    
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
    link.style.display = 'none';
    
    // Adiciona ao DOM temporariamente e clica
    document.body.appendChild(link);
    console.log('📥 Iniciando download via proxy:', filename);
    link.click();
    
    // Remove do DOM e limpa URL após um pequeno delay
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      console.log('🧹 Limpeza concluída');
    }, 100);
    
    return { success: true, filename, method: 'proxy' };
  } catch (error) {
    console.error('❌ Erro no download via proxy:', error);
    return { success: false, error: error.message };
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
