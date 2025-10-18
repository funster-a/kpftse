import "./App.css";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Advantages from "./components/Advantages/Advantages";
import Products from "./components/Products/Products";
import Certificates from "./components/Certificates/Certificates";
import Testimonials from "./components/Testimonials/Testimonials";
import Partners from "./components/Partners/Partners";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Hero />
        <Services />
        <Advantages />
        <Products />
        <Certificates />
        <Testimonials />
        <Partners />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
