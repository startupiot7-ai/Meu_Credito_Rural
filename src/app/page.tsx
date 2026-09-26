import { ActionPlan } from '@/components/landing/ActionPlan';
import { DiagnosticPreview } from '@/components/landing/DiagnosticPreview';
import { Faq } from '@/components/landing/Faq';
import { FinalCta } from '@/components/landing/FinalCta';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Problem } from '@/components/landing/Problem';
import { QuandoADividaJaApertou } from '@/components/landing/QuandoADividaJaApertou';
import { Simulator } from '@/components/landing/Simulator';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { Trust } from '@/components/landing/Trust';

/**
 * The landing page.
 *
 * Section order is the product's own journey — o problema, como funciona, a
 * prévia do resultado, a simulação rápida e, só depois, o caminho para quem já
 * está com dificuldade — wrapped in the reasons to trust it and the reason to
 * start. It is deliberately a long scroll rather than a tabbed interface:
 * one linear path, no navigation to learn.
 */
export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main id="conteudo">
        <Hero />
        <Problem />
        <HowItWorks />
        <DiagnosticPreview />
        <Simulator />
        <QuandoADividaJaApertou />
        <ActionPlan />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
