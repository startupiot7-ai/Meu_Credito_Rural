import { ButtonLink, StateView } from '@/components/ui';
import { formatNumber } from '@/lib/format';
import { TAMANHO_MINIMO_DO_GRUPO } from '@/lib/institucional/privacidade';

/**
 * Painel de uma instituição que ainda não tem diagnósticos suficientes.
 *
 * Vale tanto para zero diagnósticos quanto para poucos: abaixo do tamanho
 * mínimo do grupo, até o total da carteira poderia identificar alguém.
 */
export function PainelVazio({
  produtoresAcompanhados,
  produtoresComDiagnostico,
}: {
  produtoresAcompanhados: number;
  produtoresComDiagnostico: number;
}) {
  const nenhumDiagnostico = produtoresComDiagnostico === 0;

  return (
    <StateView
      variant="empty"
      title={
        nenhumDiagnostico
          ? 'Nenhum associado concluiu o diagnóstico ainda'
          : 'Ainda são poucos diagnósticos para mostrar a carteira'
      }
      description={
        nenhumDiagnostico
          ? `Sua instituição já tem ${formatNumber(produtoresAcompanhados)} associados cadastrados. Os números aparecem aqui assim que pelo menos ${TAMANHO_MINIMO_DO_GRUPO} deles concluírem o diagnóstico gratuito.`
          : `São ${formatNumber(produtoresComDiagnostico)} de ${TAMANHO_MINIMO_DO_GRUPO} diagnósticos necessários. Abaixo disso, até o total da carteira poderia identificar produtores individualmente.`
      }
      action={
        <ButtonLink href="/diagnostico" variant="secondary">
          Ver o diagnóstico que os associados recebem
        </ButtonLink>
      }
    />
  );
}
