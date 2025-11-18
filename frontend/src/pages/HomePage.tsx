import Advantages from "../components/Advantages/Advantages";
import Certificates from "../components/Certificates/Certificates";
import Contact from "../components/Contact/Contact";
import Hero from "../components/Hero/Hero";
import Partners from "../components/Partners/Partners";
import ProductsPreview from "../components/ProductsPreview/ProductsPreview";
import Services from "../components/Services/Services";
import Testimonials from "../components/Testimonials/Testimonials";

export const HomePage = () => {
  return (
    <>
      <Hero />
      <Services />
      <Advantages />
      <ProductsPreview />
      <Certificates />
      <Testimonials />
      <Partners />
      <Contact />
    </>
  );
};
