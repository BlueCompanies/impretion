"use client";
export default function DenyPayment({ payoutId }) {
  const denyPaymentHandler = async () => {
    await fetch(`/api/shop-system/cash-payment-processing/${payoutId}`, {
      method: "POST",
      headers: {
        ContentType: "application/json",
      },
      body: JSON.stringify({ payout: false }),
    });
  };

  return (
    <>
      <button onClick={denyPaymentHandler}>DENEGAR</button>
    </>
  );
}
