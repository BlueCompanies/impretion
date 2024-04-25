import { MdAddAPhoto } from "react-icons/md";
import CashPaymentRequest from "../../_components/CashPaymentRequest";

export const runtime = "edge";
export default async function Page({ searchParams }) {
  console.log(searchParams);

  return (
    <>
      <header
        style={{
          position: "relative",
          height: "100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p>visita nuestra pagina web IMPRETION</p>
        <span>Personalización de productos!</span>
      </header>
      <div
        style={{
          width: "100vw",
          display: "flex",
          overflowX: "hidden",
          marginBottom: "100px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div style={{ margin: "10px" }}>
            <h1>Haremos el diseño para tu mascota que siempre soñaste!</h1>
            ¿Tienes alguna imagen de tu mascota?
            <p>
              Sube una foto de tu mascota y nosotros nos encargaremos de
              plasmarla en el producto que selecciones!
            </p>
            <p>
              No importa si la foto se ve mal, nosotros nos encargamos de
              arreglarla!
            </p>
            <input type="file" style={{ display: "none" }}></input>
            <div
              style={{
                border: "2px dotted #8C52FF",
                height: "150px",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#E7DAFF",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <p
                  style={{
                    color: "#555555",
                    fontWeight: 700,
                  }}
                >
                  Foto de tu mascota
                </p>
                <MdAddAPhoto style={{ color: "#555555", fontSize: "24px" }} />
              </div>
              <div style={{}}>
                <img
                  src="/shops/icons/upload-image-example.webp"
                  style={{ width: "150px" }}
                ></img>
              </div>
            </div>
            <p>Si asi lo prefieres, puedes darnos el nombre de tu mascota</p>
            <input type="text" placeholder="Nombre de tu mascota"></input>
            <CashPaymentRequest />
          </div>
        </div>
      </div>
    </>
  );
}
