import MainHeader from "@/app/_components/Layouts/Header";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import NewPartner from "../_components/Partnership/NewPartner";
import Partnership from "../_components/Partnership";

export const runtime = "edge";

export default async function Page() {
  const session = await auth();

  const { user } = session;
  return (
    <>
      <title>impretion</title>
      <MainHeader />
      <div
        style={{
          background: "#dedede",
          width: "100%",
          height: "100vh",
          position: "fixed",
          display: "flex",
        }}
      >
        <div style={{ background: "#fff", width: "300px" }}>
          <button>Programa de socios</button>
        </div>
        <Partnership user={user} />
      </div>
    </>
  );
}
