// app/login/page.tsx

"use server"
import MainLayout from "@/layouts/MainLayout";
import LoginForm from "./LoginForm";

export default async function Page() {
  return (
    <MainLayout>
      <LoginForm />
    </MainLayout>
  );
}
