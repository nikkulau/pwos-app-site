// Formatação pura da avaliação de experiência (PWOS-RI v1.1, transitório).
// A Shell não escreve no PWOS-RI: apenas produz texto para copiar e colar
// onde o PWOS-RI é efetivamente mantido.

const LABELS = {
  reconhecimento: 'Reconhecimento da experiência PWOS',
  capacidadesEmFalta: 'Capacidades em falta',
  friccoes: 'Fricções',
  causasFalha: 'Causas de falha',
  correcoesObservacoes: 'Correções e observações',
};

export function formatAssessmentForClipboard(assessment, now = () => new Date()) {
  const lines = [
    'PWOS — Avaliação de experiência (transitória, base PWOS-RI v1.1)',
    `Registado em: ${now().toISOString()}`,
    '',
  ];
  for (const key of Object.keys(LABELS)) {
    const value = String(assessment?.[key] ?? '').trim();
    lines.push(`${LABELS[key]}:`);
    lines.push(value || '(sem resposta)');
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}
