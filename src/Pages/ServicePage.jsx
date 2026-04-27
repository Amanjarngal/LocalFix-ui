import Services from "./Services";
import ServiceHero from "../components/services/ServiceHero"
import HowItWorks from "../components/services/HowItWorks"

export const ServicePage = () => {
    return (
        <div className="bg-white min-h-screen">
            <ServiceHero />
            <HowItWorks />
            <Services />

        </div>
    )
}