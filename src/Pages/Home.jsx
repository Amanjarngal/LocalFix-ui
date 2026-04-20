import Hero from '../components/Home Page/Hero';
import { ServicesShowcase } from '../components/Home Page/ServicesShowcase';
import { LocalFixAbout } from '../components/Home Page/LocalFixAbout';
import { HouseRenovation } from '../components/Home Page/HouseRenovation';
import { HowItWorks } from '../components/Home Page/HowItWorks';
import { Testimonials } from '../components/Home Page/Testimonials';
import { BecomeProvider } from '../components/Home Page/BecomeProvider';
import { FAQ } from '../components/Home Page/FAQ';

const Home = () => {
  return (
    <>
      <Hero />
      <ServicesShowcase />
      <LocalFixAbout />
      <HouseRenovation />
      <HowItWorks />
      <Testimonials />
      <BecomeProvider />
      <FAQ />
    </>
  );
};

export default Home;
