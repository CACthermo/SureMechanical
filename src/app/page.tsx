import ThermalProgress from '@/components/sure/ThermalProgress';
import Header from '@/components/sure/Header';
import CompanyStory from '@/components/sure/CompanyStory';
import ServiceDepartment from '@/components/sure/ServiceDepartment';
import Engineering from '@/components/sure/Engineering';
import HeatingCooling from '@/components/sure/HeatingCooling';
import FieldInstallation from '@/components/sure/FieldInstallation';
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
        <HeatingCooling />
        <FieldInstallation />
        <Engineering />
        <ServiceDepartment />
        <CompanyStory />
        <Projects />
        <SureSystem />
        <SafetyWorkforce />
        <FinalCTA />
      </main>
      <Footer />
      <ThermalProgress />
    </>
  );
}
