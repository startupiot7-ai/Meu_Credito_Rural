import { ActionPlan } from '@/components/landing/ActionPlan';
import { Comparison } from '@/components/landing/Comparison';
import { DiagnosticPreview } from '@/components/landing/DiagnosticPreview';
import { Faq } from '@/components/landing/Faq';
import { FinalCta } from '@/components/landing/FinalCta';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Problem } from '@/components/landing/Problem';
import { Simulator } from '@/components/landing/Simulator';
import { SiteFooter } from '@/components/landing/SiteFooter';
import { SiteHeader } from '@/components/landing/SiteHeader';
import { Trust } from '@/components/landing/Trust';

/**
 * The landing page.
 *
 * Section order is the product's own journey — Entender → Diagnosticar →
 * Medir → Comparar → Agir — wrapped in the reasons to trust it and the reason
 * to start. It is deliberately a long scroll rather than a tabbed interface:
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
        <Comparison />
        <ActionPlan />
        <Trust />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
