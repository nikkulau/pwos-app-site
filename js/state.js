// Estado exclusivamente volátil: existe apenas em memória do processo JS.
// Nenhuma função deste módulo lê ou escreve localStorage, sessionStorage,
// IndexedDB, cookies ou qualquer mecanismo de persistência do browser.
// Ao recarregar a página, uma nova instância é criada e tudo desaparece.

function emptyAssessment() {
  return {
    reconhecimento: '',
    capacidadesEmFalta: '',
    friccoes: '',
    causasFalha: '',
    correcoesObservacoes: '',
  };
}

export function createInMemoryStore(now = () => new Date()) {
  let captures = [];
  let assessment = emptyAssessment();
  const sessionStartedAt = now().toISOString();

  return {
    sessionStartedAt,

    listCaptures() {
      return captures.slice();
    },

    addCapture(text) {
      const trimmed = String(text ?? '').trim();
      if (!trimmed) {
        return null;
      }
      const capture = {
        id: cryptoRandomId(),
        text: trimmed,
        createdAt: now().toISOString(),
      };
      captures = [...captures, capture];
      return capture;
    },

    removeCapture(id) {
      const before = captures.length;
      captures = captures.filter((c) => c.id !== id);
      return captures.length !== before;
    },

    clearCaptures() {
      captures = [];
    },

    captureCount() {
      return captures.length;
    },

    getAssessment() {
      return { ...assessment };
    },

    updateAssessment(patch) {
      assessment = { ...assessment, ...patch };
      return { ...assessment };
    },

    resetAssessment() {
      assessment = emptyAssessment();
    },
  };
}

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Recurso alternativo apenas para ambientes sem crypto.randomUUID.
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
