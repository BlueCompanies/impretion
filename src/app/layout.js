import "./globals.css";

export default function MainLayout({ params, children }) {
  console.log(params);
  return (
    <html>
      <body style={params.section === "designs" ? { overflow: "hidden" } : {}}>
        {children}
      </body>
    </html>
  );
}
