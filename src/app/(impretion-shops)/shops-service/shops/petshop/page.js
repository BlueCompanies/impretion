import CashPaymentRequest from "../../_components/CashPaymentRequest";
import { getShopInfo } from "@/app/_lib/shop/getShop";
import PetFormList from "./_components/PetFormList";
import FieldDescription from "./_components/FieldDescription";
import CustomerDeliveryData from "../../_components/CustomerDeliveryData";

export const runtime = "edge";
export default async function Page({ searchParams }) {
  // Obtener parámetros de búsqueda del código QR escaneado para obtener la información actual de la tienda
  const { shopRef } = searchParams;
  const shopInfo = await getShopInfo(shopRef);
  console.log("daf: ", shopInfo);
  const { shopName } = shopInfo || "";
  console.log("daf: ", shopRef);
  //await fetch("http://localhost:3000/api/user/get-user-ip");

  if (shopInfo && shopRef) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <header
            style={{
              position: "relative",
              height: "100px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              backgroundColor: "#8C52FF",
              color: "#fff",
              width: "100%",
            }}
          >
            <p>Bienvenido a {shopName}</p>
            <p style={{ fontSize: "14px" }}>
              ¡Haz felices a tus mascotas con productos personalizados!
            </p>
          </header>
        </div>
        <PetFormList />

        <div style={{ margin: "10px" }}>
          <FieldDescription>
            Enviaremos tus articulos personalizados a la dirección que nos
            proporciones aquí.
          </FieldDescription>
          <CustomerDeliveryData />
        </div>
        <div style={{ marginBottom: "100px" }}></div>
        <div
          style={{
            position: "fixed",
            bottom: "0",
            width: "100%",
            marginTop: "100px",
            background: "red",
            height: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#8C52FF",
          }}
        >
          <CashPaymentRequest />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div>404 NOT FOUND</div>
      </>
    );
  }
}
