import type { StatusTone } from '@/components/ui';
import type { FaixaDeRisco } from '@/lib/institucional/tipos';

/**
 * Como cada faixa de risco aparece na tela. É a mesma leitura
 * verde / amarelo / vermelho que o produtor vê no diagnóstico dele.
 */
export const aparenciaDaFaixa: Record<
  FaixaDeRisco,
  { rotulo: string; tom: Exclude<StatusTone, 'info'>; corDaBarra: string }
> = {
  saudavel: { rotulo: 'Situação saudável', tom: 'healthy', corDaBarra: 'bg-healthy-solid' },
  atencao: { rotulo: 'Atenção', tom: 'attention', corDaBarra: 'bg-attention-solid' },
  risco: { rotulo: 'Risco elevado', tom: 'risk', corDaBarra: 'bg-risk-solid' },
};
