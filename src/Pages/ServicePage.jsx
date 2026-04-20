import Services from "./Services";
import ServiceHero from "../components/services/ServiceHero";
import { HowItWorks } from '../components/Home Page/HowItWorks';
import { HouseRenovation } from '../components/Home Page/HouseRenovation';
import { Testimonials } from '../components/Home Page/Testimonials';
import { FAQ } from '../components/Home Page/FAQ';

export const ServicePage = () => {
    return (
        <div className="bg-white">
            <ServiceHero />
            <Services />
            <HouseRenovation />
            <HowItWorks />
            <Testimonials />
            <FAQ />
        </div>
    )
}