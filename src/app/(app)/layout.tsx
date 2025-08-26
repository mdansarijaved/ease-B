import Footer from "~/components/footer";
import Header from "~/components/header";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <main className="w-screen">
      <Header />
      {props.children}
      <Footer />
    </main>
  );
}
