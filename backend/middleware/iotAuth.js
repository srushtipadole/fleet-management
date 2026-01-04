export const iotAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== process.env.IOT_API_KEY) {
    return res.status(401).json({ message: "Invalid IoT API Key" });
  }
  next();
};
