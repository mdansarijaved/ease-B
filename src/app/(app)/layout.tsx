import { Suspense } from "react";
import Footer from "~/components/footer";
import Header from "~/components/header";
import Loading from "../loading";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <main className="w-screen">
      <Suspense fallback={<Loading />}>
        <Header />
        {props.children}
        <Footer />
      </Suspense>
    </main>
  );
}
