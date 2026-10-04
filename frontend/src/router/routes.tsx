import { Route, Routes } from "react-router-dom";
import { Container } from "@/components/ui";
import LandingPage from "@/pages/LandingPage";

// Sementara, hapus satu per satu saat halaman aslinya jadi.
function Placeholder({ title }: { title: string }) {
  return (
    <Container className="py-24">
      <h1 className="text-[28px] font-bold">{title}</h1>
    </Container>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/rooms" element={<Placeholder title="Rooms" />} />
      <Route path="/rooms/:slug" element={<Placeholder title="Room detail" />} />
      <Route path="/login" element={<Placeholder title="Login" />} />
      <Route path="/register" element={<Placeholder title="Register" />} />
    </Routes>
  );
}
