import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router tidak mereset scroll saat pindah halaman. Komponen ini
// mengembalikan scroll ke atas setiap kali path berubah (hash/anchor tidak terpengaruh).
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
