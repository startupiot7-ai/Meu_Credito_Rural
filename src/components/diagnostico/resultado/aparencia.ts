import type { StatusTone } from '@/components/ui';
import type { SituacaoDaSafra } from '@/lib/diagnostico/tipos';

/**
 * Como cada situação da safra aparece na tela, usando os tons que o design
 * system já tem. Nada de cor nova: três faixas de risco, e "faltam dados" com
 * o tom informativo, porque não é um nível de risco. O selo sempre leva ícone
 * e texto, então a cor nunca é a única informação.
 */
export const aparenciaDaSituacao: Record<SituacaoDaSafra, StatusTone> = {
  'cobre-com-folga': 'healthy',
  'cobre-apertado': 'attention',
  'nao-cobre': 'risk',
  'dados-insuficientes': 'info',
};
