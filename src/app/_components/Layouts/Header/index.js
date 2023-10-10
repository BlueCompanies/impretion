import Link from "next/link";

export default function MainHeader() {
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    height: "70px",
    background: "#fff",
    margin: "auto",
    zIndex: 100,
    position: "sticky",
    overflow: "hidden",
    borderBottom: "2px solid #e9e9e9",
  };

  const navBarStyle = {
    display: "flex",
    width: "50%",
    margin: "auto",
  };

  const titleStyle = {
    fontWeight: 800,
    fontSize: "32px",
  };

  return (
    <header style={headerStyle}>
      <div style={navBarStyle}>
        <Link href="/" style={titleStyle}>
          IMPRETION
        </Link>
      </div>
    </header>
  );
}
