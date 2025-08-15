// app/sign-up/page.tsx  (NO "use client")
import MainLayout from "@/layouts/MainLayout";
import CartPage from "./ShoppingCart";

export default function Page() {
  return (
    <MainLayout>
      <CartPage />
    </MainLayout>
  );
}
