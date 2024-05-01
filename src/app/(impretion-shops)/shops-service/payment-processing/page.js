import AcceptPayment from "../_components/PaymentStatus/AcceptPayment";
import DenyPayment from "../_components/PaymentStatus/DenyPayment";
import FieldDescription from "../shops/petshop/_components/FieldDescription";

export default async function Page({ searchParams }) {
  const { payoutId, clientData } = searchParams;
  const parsedClientData = JSON.parse(clientData);
  console.log(parsedClientData);

  const findPaymentSession = await fetch(
    "https://sa-east-1.aws.data.mongodb-api.com/app/data-lqpho/endpoint/data/v1/action/findOne",
    {
      method: "POST",
      headers: {
        apiKey:
          "jUlBvV4q0boUTjyw4bCWXKEVnzPg0YnHdFM8xeqtJQO0pGjLFewwWpu3gpOKBKbj",
        contentType: "application/json",
      },
      body: JSON.stringify({
        dataSource: "Impretion",
        database: "orders",
        collection: "temporal-link-session",
        filter: {
          linkSessionId: payoutId,
        },
      }),
    }
  );

  const { document } = await findPaymentSession.json();
  const { expirationDateInMilliseconds } = document;
  const currentDate = new Date().getTime();

  if (currentDate > expirationDateInMilliseconds) {
    return <>404 Página no encontrada. Esta página ha caducado.</>;
  } else {
    return (
      <div
        style={{
          height: "100vh",
          position: "fixed",
          overflowY: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ margin: "10px" }}>
          <FieldDescription>
            Recuerda solo aceptar una vez el cliente te haya dado el dinero
            total en efectivo.
          </FieldDescription>
        </div>

        <div
          style={{
            border: "1px solid #dedede",
            margin: "10px",
            borderRadius: "4px",
            padding: "5px",
            boxShadow: "1px 1px 3px #dedede",
            color: "#555",
          }}
        >
          <p>
            El cliente con código{" "}
            <span style={{ textDecoration: "underline" }}>
              {payoutId.toLowerCase()}
            </span>{" "}
            esta pendiente por aceptación de tranferencia. ¿Deseas aceptar o
            rechazar esta transaccion?
          </p>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "60px",
          }}
        >
          <AcceptPayment
            payoutId={payoutId}
            expirationDateInMilliseconds={expirationDateInMilliseconds}
          />
          <DenyPayment
            payoutId={payoutId}
            expirationDateInMilliseconds={expirationDateInMilliseconds}
          />
        </div>

        <p>Costo total: $</p>
      </div>
    );
  }
}

export const runtime = "edge";
