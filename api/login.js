import bcrypt from "bcrypt";
import Cookies from "cookies";
import jwt from "jsonwebtoken";

import { postgresQuery } from "../src/server/db/db.js";
import { sendUnauthorizedResponse } from "../src/server/utils.js";

export async function handleLogin(req, res) {
  console.log("LOGIN REQUEST", req.method);

  if (req.method != "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Method not allowed" }));
  }

  let requestBody = "";
  req.on("data", (chunk) => {
    requestBody += chunk.toString();
  });

  req.on("end", async () => {
    const parsedBody = JSON.parse(requestBody);
    if (!parsedBody.email || !parsedBody.password || !parsedBody.jit) {
      return sendUnauthorizedResponse(res);
    }

    const user = await postgresQuery(
      `SELECT * from "USER" WHERE "USER"."email" = $1 LIMIT 1;`,
      [parsedBody.email]
    );

    if (user.rowCount <= 0) {
      return sendUnauthorizedResponse(res);
    }


    function signJWT(uuid) {

      const secretKey = "VERYCOOLSECERET";


      const payload = {
        uuid: uuid,
      };


      const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

      return token;
    }

    const csrfToken = signJWT(parsedBody.jit);

    const userInfo = user.rows[0];
    const verifiedPass = bcrypt.compareSync(
      parsedBody.password,
      userInfo.password
    );

    if (!verifiedPass) {
      return sendUnauthorizedResponse(res);
    }

    console.log("PASSWORD MATCHES");


    const sessionMaxAge = 60 * 60 * 24 * 7; // 7 days
    const fromDate = (time, date = Date.now()) => new Date(date + time * 1000);
    const sessionExpires = fromDate(sessionMaxAge);

    const token = await postgresQuery(
      `INSERT INTO "SESSION" (id, user_id, csrf_token, expires_at) VALUES ($1, $2,$3, $4)
        RETURNING  id`,
      [randomUUID(), userInfo.id, csrfToken, sessionExpires]
    );

    if (token.rowCount <= 0) {
      return sendUnauthorizedResponse(res);
    }

    const cookies = new Cookies(req, res, { secure: true });
    const x = cookies.set("AUTH-SESSION-ID", token.rows[0].id, {
      expires: sessionExpires,
      sameSite: true,
      httpOnly: true,
      secure: true,
    });

    const y = cookies.set("XSRF-TOKEN", csrfToken, {
      expires: sessionExpires,
      sameSite: true,
      httpOnly: true,
      secure: true,
    });

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "LOGIN SUCCESS", code: "SUCCESS" }));
  });
}
