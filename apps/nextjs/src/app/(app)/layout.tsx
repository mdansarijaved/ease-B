import Footer from "~/app/_components/footer";
import Header from "~/app/_components/header";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <main>
      <Header />
      {props.children}
      <Footer />
    </main>
  );
}
