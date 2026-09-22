import { createInMemoryStore } from './state.js';
import { getCoreCondensado, formatCoreForClipboard } from './core-content.js';
import { formatAssessmentForClipboard } from './assessment.js';

const store = createInMemoryStore();
const core = getCoreCondensado();

const VIEWS = ['conversar', 'capturar', 'consultar', 'hoje', 'avaliar'];

function $(id) {
  return document.getElementById(id);
}

function switchView(name) {
  for (const v of VIEWS) {
    $(`view-${v}`).classList.toggle('active', v === name);
  }
  document.querySelectorAll('nav.tabbar button').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.view === name);
  });
  if (name === 'hoje') {
    renderHoje();
  }
}

document.querySelectorAll('nav.tabbar button').forEach((btn) => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// --- Conversar / Consultar: núcleo condensado ---
function renderCore() {
  const badgeText = core.status === 'disponivel' ? 'aprovado · disponível' : 'pendente — texto ainda não fornecido';
  const badgeClass = core.status === 'disponivel' ? 'badge' : 'badge pending';
  const metaText = `v${core.version} · aprovado pelo ${core.approvedByDisplay} em ${core.approvedAt}`;

  for (const badgeId of ['core-status-badge', 'core-status-badge-2']) {
    const el = $(badgeId);
    el.textContent = badgeText;
    el.className = badgeClass;
  }
  $('core-meta-line').textContent = metaText;
  $('core-meta-line-2').textContent = metaText;

  const previewText =
    core.status === 'disponivel' && core.text
      ? core.text
      : 'O texto do Núcleo Condensado v0.3 ainda não foi fornecido a esta Shell. Este espaço mostrará o conteúdo aprovado assim que for adicionado e verificado.';

  $('core-text-preview').textContent = previewText;
  $('core-text-full').textContent = previewText;
}

$('btn-copy-core').addEventListener('click', async () => {
  const text = formatCoreForClipboard(core);
  const ok = await copyToClipboard(text);
  $('copy-status').textContent = ok ? 'Copiado para a área de transferência.' : 'Não foi possível copiar automaticamente — seleciona e copia o texto manualmente.';
});

// --- Capturar ---
function renderCaptures() {
  const list = $('capture-list');
  const captures = store.listCaptures();
  list.innerHTML = '';

  $('capture-empty').style.display = captures.length ? 'none' : 'block';
  $('capture-count-line').textContent = captures.length
    ? `${captures.length} captura(s) nesta sessão`
    : '';

  for (const c of captures) {
    const li = document.createElement('li');
    const meta = document.createElement('div');
    meta.className = 'capture-meta';
    meta.textContent = new Date(c.createdAt).toLocaleTimeString('pt-PT');
    const text = document.createElement('div');
    text.className = 'capture-text';
    text.textContent = c.text;
    const removeBtn = document.createElement('button');
    removeBtn.className = 'secondary';
    removeBtn.type = 'button';
    removeBtn.style.marginTop = '6px';
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => {
      store.removeCapture(c.id);
      renderCaptures();
    });
    li.append(meta, text, removeBtn);
    list.appendChild(li);
  }
}

$('btn-add-capture').addEventListener('click', () => {
  const input = $('capture-input');
  const added = store.addCapture(input.value);
  if (added) {
    input.value = '';
    renderCaptures();
  }
});

$('btn-clear-captures').addEventListener('click', () => {
  store.clearCaptures();
  renderCaptures();
});

// --- Hoje ---
function renderHoje() {
  $('hoje-datetime').textContent = new Date().toLocaleString('pt-PT', {
    dateStyle: 'full',
    timeStyle: 'short',
  });
  $('hoje-session-start').textContent = new Date(store.sessionStartedAt).toLocaleString('pt-PT', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  $('hoje-capture-count').textContent = String(store.captureCount());
}

// --- Avaliar ---
const assessmentFields = {
  'assess-reconhecimento': 'reconhecimento',
  'assess-capacidades': 'capacidadesEmFalta',
  'assess-friccoes': 'friccoes',
  'assess-causas': 'causasFalha',
  'assess-correcoes': 'correcoesObservacoes',
};

for (const [elementId, key] of Object.entries(assessmentFields)) {
  const el = $(elementId);
  el.addEventListener('input', () => store.updateAssessment({ [key]: el.value }));
  el.addEventListener('change', () => store.updateAssessment({ [key]: el.value }));
}

$('btn-copy-assessment').addEventListener('click', async () => {
  const text = formatAssessmentForClipboard(store.getAssessment());
  const ok = await copyToClipboard(text);
  $('assessment-status').textContent = ok
    ? 'Avaliação copiada. Cola-a onde o PWOS-RI é mantido.'
    : 'Não foi possível copiar automaticamente — seleciona e copia manualmente.';
});

$('btn-reset-assessment').addEventListener('click', () => {
  store.resetAssessment();
  for (const elementId of Object.keys(assessmentFields)) {
    $(elementId).value = '';
  }
  $('assessment-status').textContent = '';
});

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (err) {
    // segue para o fallback
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch (err) {
    return false;
  }
}

// Inicialização
renderCore();
renderCaptures();
renderHoje();
switchView('conversar');
setInterval(() => {
  if ($('view-hoje').classList.contains('active')) {
    renderHoje();
  }
}, 30000);
