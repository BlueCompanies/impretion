import MainHeader from "@/app/_components/Layouts/Header";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import GenerateAffiliateLink from "../_components/GenerateAffiliateLink";

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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            background: "blue",
            width: "100%",
            margin: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "60px",
              background: "red",
              borderRadius: "4px",
              padding: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            BIENVENIDO AL PANEL DE SOCIOS {user.name}
          </div>
          <div
            style={{
              display: "flex",
              background: "skyblue",
              width: "100%",
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              padding: "20px",
            }}
          >
            <p>
              Con nuestro programa de socios lo unico que debes hacer es generar
              tu link
            </p>
            <GenerateAffiliateLink />

            <p>
              Cada ves que algun usuario compre algo con tu link tu billetera se
              actualizara
            </p>
            <span>Billetera</span>
            <p>Dinero total: $0</p>

            <hr style={{ width: "100%", height: "1px" }} />
            <p>
              *La comision que ganas por la venta de cada producto es del 50%*
            </p>
            <p>
              Puedes retirar el dinero hasta 3 veces por mes, actualmente
              utilizamos nequi y bancolombia para transferir tu dinero, la
              transferencia es completamente automatica, sin embargo, si hay
              fallos en los sitemas de nequi/bancolombia, el envio se hara
              manual.
            </p>

            <p>
              Enviaremos tu dinero por medio de nequi, pon tu numero de
              telefono, enviaremos un mensaje para verificar que si eres tú.
            </p>
            <input type="number" placeholder="Tu numero de telefono"></input>

            <p>
              En caso de que nequi no funcione, agrega tu numero de bancolombia
              activo al cual podamos enviar transferencias.
            </p>
            <input type="number" placeholder="Numero bancolombia"></input>

            {/*
            
            <p>
              Para que sea mas facil para ti te proporcionamos algunas
              platillas, las puedes publicar en tus estados de whatsapp,
              instagram, facebook o la red social que prefieras!
            </p>
            <div
              style={{
                height: "70%",
                background: "lightgreen",
                width: "100%",
                padding: "10px",
                overflowY: "auto",
              }}
            >
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              ></div>
            </div>
            */}
          </div>
        </div>
      </div>
    </>
  );
}
