import { MdAddAPhoto } from "react-icons/md";

export default function Page() {
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
                border: "1px solid red",
                height: "150px",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100%",
                  backgroundColor: "green",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <p>Foto de tu mascota</p>
                <MdAddAPhoto />
              </div>
              <div style={{}}>
                <img
                  src="/shops/icons/sammy-balto.webp"
                  style={{ width: "150px" }}
                ></img>
              </div>
            </div>
            <input type="text"></input>
          </div>
        </div>
      </div>
    </>
  );
}
