import '@testing-library/jest-dom/vitest';

// Trava de rede: o axios usa XMLHttpRequest no jsdom. Se algum teste tentar
// falar com a API de verdade, ele falha na hora. Os testes que precisam de
// resposta trocam o adapter do axios (veja __tests__/integration/collectionApi.test.tsx).
class BlockedXMLHttpRequest {
  constructor() {
    throw new Error('Chamada de rede real bloqueada nos testes. Use um adapter ou um mock.');
  }
}

vi.stubGlobal('XMLHttpRequest', BlockedXMLHttpRequest);
