import AcceptPayment from "../_components/PaymentStatus/AcceptPayment";
import DenyPayment from "../_components/PaymentStatus/DenyPayment";

export default async function Page({ searchParams }) {
  const { payoutId } = searchParams;
  console.log(payoutId);
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
    console.log("The current date is higher than the expiration date.");
  } else {
    console.log("The current date is lower than the expiration date.");
  }

  if (currentDate > expirationDateInMilliseconds) {
    return <>404 Página no encontrada. Esta página ha caducado.</>;
  } else {
    return (
      <>
        <p>
          El comprador quiere realizar el pago. ¿Deseas aceptarlo o rechazarlo?
        </p>
        <AcceptPayment payoutId={payoutId} />
        <DenyPayment payoutId={payoutId} />
      </>
    );
  }
}

export const runtime = "edge";
