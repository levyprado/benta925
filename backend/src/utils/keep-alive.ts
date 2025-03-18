const backendUrl = process.env.BACKEND_URL || "https://benta925.onrender.com";

export const pingService = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/ping`);
    console.log(
      `Pinged service at ${new Date().toISOString()} - Status: ${
        response.status
      }`
    );
  } catch (err) {
    console.error("Error pingin service: ", err);
  }
};

if (process.env.NODE_ENV === "production") {
  // Ping every 14 minutes
  setInterval(pingService, 840000);
  console.log("Keep alive service started");
}
