import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import CatalogPage from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductPage from "./pages/ProductPage";
import type { Product } from "./components/Catalog/Catalog";

function App() {
  // 1. Создаем состояние для хранения выбранных товаров (корзина/заявка)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // 2. Функции для управления состоянием
  const addToSelection = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  const removeFromSelection = (productId: number) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Дополнительная функция для очистки корзины, если нужно (например, при отправке заявки)
  const clearSelection = () => {
    setSelectedProducts([]);
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* 3. Передаем состояние и функции в CatalogPage */}
            <Route
              path="/catalog"
              element={
                <CatalogPage
                  selectedProducts={selectedProducts}
                  addToSelection={addToSelection}
                  removeFromSelection={removeFromSelection}
                  clearSelection={clearSelection}
                />
              }
            />

            {/* 4. Передаем состояние и функции в ProductPage */}
            <Route
              path="/catalog/:id"
              element={
                <ProductPage
                  selectedProducts={selectedProducts}
                  addToSelection={addToSelection}
                  removeFromSelection={removeFromSelection}
                />
              }
            />

            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<h1>404 - Страница не найдена</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
