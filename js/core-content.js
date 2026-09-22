// Núcleo Condensado da Constituição PWOS — conteúdo para as superfícies
// "Consultar" e "Conversar" (ponte manual).
//
// ESTADO: disponível, versão adaptada.
//
// O texto abaixo é uma ADAPTAÇÃO do Núcleo Condensado v0.3 aprovado em
// 2026-09-22 (anexo a PWOS-DEV-HANDOFF-20260922-001): as duas
// referências nominais ao utilizador foram substituídas por "o
// utilizador", por decisão explícita do próprio em 2026-09-22, para
// reconciliar o texto aprovado com a declaração de "zero
// identificadores" do anexo (handoff, ponto 6). Fora dessa substituição,
// o texto — incluindo espaçamento e quebras de linha — é idêntico ao
// aprovado, carácter a carácter (ver AUDIT_HANDOFF.md, secção 4, para o
// comando `diff` que confirma isto contra docs/nucleo-condensado-v0.3-aprovado.md).
//
// O texto aprovado original (com a referência nominal) está preservado,
// sem alteração, em docs/nucleo-condensado-v0.3-aprovado.md — essa é a
// decisão registada, não uma edição silenciosa. Ver AUDIT_HANDOFF.md.

const CORE_TEXT = `NÚCLEO CONDENSADO DA CONSTITUIÇÃO PWOS
Para: PWOS Experience Shell / Iteração 0
Função: contexto experimental mínimo, teste de reconhecimento PWOS
Versão: v0.3
IDENTIDADE FUNCIONAL
Designação: PWOS — Personal Wisdom Operating System
Propósito: sistema operacional pessoal que integra discernimento pessoal, reflexão contínua e valores em cada decisão e ação.
PRINCÍPIOS OPERACIONAIS ESSENCIAIS
1. Autoridade pessoal
O utilizador decide. A IA oferece perspectiva e suporte; nunca substitui julgamento.
2. Reflexão antes de ação
Não agir sem explorar valores, consequências e contexto.
Capturar → Consultar → Avaliar → Agir.
3. Integração
Alinhar identidade (quem sou), contexto (onde estou) e decisão (o que faço) numa mesma linha de coerência.
4. Transparência
Registar pressupostos, trade-offs e evidência. Explicar o raciocínio.
5. Aprendizagem contínua
Iterar com base em feedback e ajustar continuamente a prática.
6. Privacidade
Proteger dados pessoais e limitar quem acede ao contexto privado.
ORDEM DE AUTORIDADE (operacional nesta Shell)

1. O utilizador — decisão e validação final
2. Experiência ativa (superfícies Capturar, Conversar, Consultar, Hoje) — suporte à reflexão
3. Contexto disponível — nunca substitui julgamento humano

ESTILO RELACIONAL
— Linguagem clara, precisa, sem jargão desnecessário
— Perguntas reflexivas sobre valores e consequências
— Validação de pressupostos antes de conclusões
— Espaço para ambiguidade e incerteza
— Respeito pela privacidade e agência pessoal
FIM DO NÚCLEO CONDENSADO`;

export const CORE_CONDENSADO = {
  version: '0.3',
  approvedByDisplay: 'utilizador',
  approvedAt: '2026-09-22',
  origin: 'Preparado por Claude-PWOS-App, revisto por ChatGPT-PWOS-App (parecer favorável com ajustes)',
  sensitiveContentAudit: 'zero dados pessoais, zero identificadores, zero memória histórica — declarado no anexo do handoff; referências nominais adaptadas em 2026-09-22 (ver docs/nucleo-condensado-v0.3-aprovado.md)',
  status: 'disponivel', // 'pendente' | 'disponivel'
  text: CORE_TEXT,
};

export function getCoreCondensado() {
  return { ...CORE_CONDENSADO };
}

export function formatCoreForClipboard(core = CORE_CONDENSADO) {
  const header = [
    'PWOS — Núcleo Condensado da Constituição (contexto para conversa externa)',
    `Versão: ${core.version} · Aprovado pelo ${core.approvedByDisplay} em ${core.approvedAt}`,
    '',
  ].join('\n');

  if (core.status !== 'disponivel' || !core.text) {
    return (
      header +
      'ESTADO: pendente — o texto do Núcleo Condensado ainda não foi fornecido a esta Shell.\n' +
      'Esta cópia não deve ser usada como contexto constitucional até ser substituída pelo texto aprovado.'
    );
  }

  return header + core.text;
}
