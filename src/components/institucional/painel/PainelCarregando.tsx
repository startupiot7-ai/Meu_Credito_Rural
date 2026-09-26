import { Skeleton, SkeletonCard, SkeletonRegion } from '@/components/ui';

/**
 * Esqueleto do painel enquanto os números chegam. Tem o mesmo desenho do
 * painel pronto, para a página não "pular" quando os dados aparecem.
 */
export function PainelCarregando() {
  return (
    <SkeletonRegion label="Carregando os números da carteira" className="flex flex-col gap-6">
      <div>
        <Skeleton className="h-9 w-80 max-w-full" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, posicao) => (
          <div key={posicao} className="rounded-2xl border border-sand-200 bg-sand-50 p-5">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="mt-3 h-9 w-2/5" />
            <Skeleton className="mt-3 h-4 w-4/5" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <SkeletonCard className="lg:col-span-7" />
        <SkeletonCard className="lg:col-span-5" />
      </div>
      <SkeletonCard />
    </SkeletonRegion>
  );
}
