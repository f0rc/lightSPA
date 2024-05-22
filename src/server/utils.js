export const sendUnauthorizedResponse = (res) => {
  res.statusCode = 401;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ message: "NOT FOUND", code: "UNAUTHORIZED" }));
};
