// app/shopping-cart/page.tsx
import MainLayout from "@/layouts/MainLayout";
import CartPage from "./ShoppingCart";

export default function Page() {
  return (
    <MainLayout>
      <CartPage />
    </MainLayout>
  );
}
