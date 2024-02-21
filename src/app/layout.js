import MainHeader from "./_components/Layouts/Header";
import "./globals.css";

export default function MainLayout({ params, children }) {
  console.log("pr: ", params);
  return (
    <html>
      <body style={params.section === "designs" ? { overflow: "hidden" } : {}}>
        {children}
      </body>
    </html>
  );
}
