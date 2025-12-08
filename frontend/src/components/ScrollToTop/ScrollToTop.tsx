import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Если есть hash в URL, не сбрасываем скролл - даем возможность обработать якорную ссылку
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  // Обработка скролла к якорной ссылке после навигации
  useEffect(() => {
    if (hash) {
      // Небольшая задержка, чтобы дать время странице отрендериться
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [hash, pathname]);

  return null;
};

export default ScrollToTop;

