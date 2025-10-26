import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import Services from "./components/Services/Services";
import Advantages from "./components/Advantages/Advantages";
import Certificates from "./components/Certificates/Certificates";
import Testimonials from "./components/Testimonials/Testimonials";
import Partners from "./components/Partners/Partners";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";
import CatalogPage from "./pages/CatalogPage";
import ProductsPreview from "./components/ProductsPreview/ProductsPreview";

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={
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
            } />
            
            {/* Отдельная страница каталога */}
            <Route path="/catalog" element={<CatalogPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;