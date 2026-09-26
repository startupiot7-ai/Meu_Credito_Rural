import type { StatusTone } from '@/components/ui';
import type { SituacaoNoPainel } from '@/lib/institucional/tipos';

/**
 * Como cada situação da safra aparece no painel. É a mesma leitura em três
 * faixas que o produtor vê no resultado dele, com os mesmos tons do design
 * system, e os rótulos descrevem a safra, nunca a pessoa.
 */
export const aparenciaDaSituacaoNoPainel: Record<
  SituacaoNoPainel,
  { rotulo: string; tom: Exclude<StatusTone, 'info'>; corDaBarra: string }
> = {
  'cobre-com-folga': { rotulo: 'Cobre com folga', tom: 'healthy', corDaBarra: 'bg-healthy-solid' },
  'cobre-apertado': { rotulo: 'Cobre, mas apertado', tom: 'attention', corDaBarra: 'bg-attention-solid' },
  'nao-cobre': { rotulo: 'Não cobre', tom: 'risk', corDaBarra: 'bg-risk-solid' },
};
