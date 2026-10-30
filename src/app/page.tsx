import Header from '@/components/sure/Header';
import Hero from '@/components/sure/Hero';
import Capabilities from '@/components/sure/Capabilities';
import Projects from '@/components/sure/Projects';
import SureSystem from '@/components/sure/SureSystem';
import SafetyWorkforce from '@/components/sure/SafetyWorkforce';
import FinalCTA from '@/components/sure/FinalCTA';
import Footer from '@/components/sure/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" className="relative min-h-screen bg-mech-navy" role="main">
        <Hero />
        <Capabilities />
        <Projects />
        <SureSystem />
        <SafetyWorkforce />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
