import { postgresQuery } from "../src/server/db/db";

export async function handleAuth(req, res) {
  console.log("AUTHENTICATION REQUEST", req.url);

  const token = req.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("AUTH-SESSION-ID="))
    ?.split("=")[1];

  const csrf = req.headers.cookie
    ?.split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (!token || !csrf) {
    res.statusCode = 403;
    res.end("UNAUTHORIZED");
    return false;
  }

  const session = await postgresQuery(
    `SELECT s."id", s."user_id", s."csrf_token"  from "SESSION" s WHERE s."id" = $1 LIMIT 1;`,
    [token]
  );
  if (session.rowCount > 0) {
    req.user = session.rows[0].user_id;
    req.csrf = session.rows[0].csrf_token;

    return true;
  } else {
    res.statusCode = 403;

    res.end("Access denied. Invalid token.");
    return false;
  }
}
