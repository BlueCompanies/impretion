// server.js (API Route)
import { insertPaymentLinkSession } from "@/app/_lib/shop/insertPaymentLinkSession";
import { NextResponse } from "next/server";

// Store connected clients and their response streams
const connectedClients = new Map();

// This represents the total time id passed to each user.
let intervalId;

let clientId;

let responseStream;
let writer;
let encoder;
let close = false;

export const runtime = "edge";

export async function POST(req, res) {
  try {
    // When POST the countdown is canceled, it means there is already a response from the seller.
    cancelCountdown();
    const urlParts = req.url.split("?");
    const queryParams = new URLSearchParams(urlParts[1]);
    const sellerId = queryParams.get("payoutId");

    if (connectedClients.get(sellerId)) {
      // TO-DO: Handle the connected client case
      return NextResponse.json(
        {
          data: "Transaccion realizada con exito, Impretion se encargara del resto.",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          data: "El usuario se ha desconectado o cancelado la compra, por favor pidele si quiere volver a realizar la transaccion.",
        },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        data:
          `Ha ocurrido un error al procesar el pago. Porfavor comunicate con Impretion y pasale el error, si este error ha ocurrido durante una transaccion, pidele al cliente que se ponga en contacto al numero 3123123 directamente con Impretion para proceder a realizar la transaccion sin problema` +
          error,
      },
      { status: 404 }
    );
  }
}

export async function GET(req, res) {
  try {
    // Create a new response stream for this client
    responseStream = new TransformStream();
    writer = responseStream.writable.getWriter();
    encoder = new TextEncoder();

    const urlParts = req.url.split("?");
    const queryParams = new URLSearchParams(urlParts[1]);
    clientId = queryParams.get("payoutId");

    // LabsMobile SMS data sender
    console.log(
      `http://localhost:3000/shops-service/payment-processing?payoutId=${clientId}`
    );
    await insertPaymentLinkSession(clientId);

    if (!clientId) {
      return new NextResponse("Invalid request. Client ID is required.", {
        status: 400,
      });
    }

    // Add the client's response stream and interval to the map
    connectedClients.set(clientId, { writer, encoder, intervalId: null });

    // Add a cleanup function to remove the client from the map when disconnected
    req.signal.addEventListener("abort", () => {
      console.log(`Client ${clientId} disconnected from abort.`);
      cleanupClientConnection(clientId, "cancel");
    });

    // Starts countdown for the user to be approved/denied payment.
    const intervalId = startCountdown(clientId);
    connectedClients.get(clientId).intervalId = intervalId;

    // Return the response connected to the client's readable stream
    return new NextResponse(responseStream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return new NextResponse(
      "Ha ocurrido un error al comenzar a procesar tu transaccion.",
      {
        status: 400,
      }
    );
  }
}

// Cleans and close all the writer and client data.
function cleanupClientConnection(clientId, eventType) {
  const { writer, encoder, intervalId } = connectedClients.get(clientId) || {};

  if (writer) {
    // Close the writer
    const sseMessage = `event: ${eventType}\n` + `data: ""\n\n`;
    writer.write(encoder.encode(sseMessage));
    writer.close();
  }

  // Cancel the countdown interval
  if (intervalId) {
    clearInterval(intervalId);
  }

  // Remove the client from the connectedClients map
  connectedClients.delete(clientId);
  console.log(`Client ${clientId} disconnected from cleanup.`);
}

function sendDataToClient(clientId, data) {
  const { writer, encoder } = connectedClients.get(clientId) || {};

  if (writer && encoder) {
    const sseMessage = `id: ${data}\n` + `event: timer\n` + `data: ${data}\n\n`;
    writer.write(encoder.encode(sseMessage));
  } else {
    console.error(`Client ${clientId} not found or disconnected.`);
  }
}

// Cancels and deletes everything when the timer reachs 00:01
function cancelByTimeout(clientId) {
  cleanupClientConnection(clientId, "cancelByTimeout");
}

// COUNTDOWN SYSTEM
// Define the countdown duration in milliseconds
const countdownDuration = 5 * 60 * 1000; // 5 minutes in milliseconds
const countdownDurationTest = 10000; // 5 minutes in milliseconds

// Function to format the time as "mm:ss"
function formatTime(time) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${minutes < 10 ? "0" : ""}${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;
}

function cancelCountdown() {
  clearInterval(intervalId); // Clear the interval timer
}

function startCountdown(clientId) {
  let remainingTime = countdownDurationTest;
  const intervalId = setInterval(() => {
    remainingTime -= 1000; // Decrease remaining time by 1 second
    if (remainingTime <= 0) {
      cancelByTimeout(clientId);
    } else {
      sendDataToClient(clientId, formatTime(remainingTime));
    }
  }, 1000);

  return intervalId;
}
