"use client";

export default function MobileTest() {
  const messageToAPI = async () => {
    await fetch("/api/send-call-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <>
      <button onClick={messageToAPI}>MOBILE TEST</button>
    </>
  );
}
