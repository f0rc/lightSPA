import { postgresQuery } from "../src/server/db/db";
// import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

const SALTROUNDS = 10;

export async function handleSignup(req, res) {
  console.log("SIGN UP USER", req.url);

  let requestBody = "";
  req.on("data", (chunk) => {
    requestBody += chunk.toString();
  });

  req.on("end", async () => {
    const parsedBody = JSON.parse(requestBody);

    if (parsedBody.email && parsedBody.password) {
      const userExists = await postgresQuery(
        `SELECT 1 FROM "USER" WHERE email = $1`,
        [parsedBody.email]
      );

      if (userExists.rowCount > 0) {
        console.log("ACCOUNT ALREADY EXISTS");
        res.statusCode = 400;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            message: "Email already in use",
            code: "EMAIL_IN_USE",
          })
        );
        return;
      }

      const hashedPass = bcrypt.hashSync(parsedBody.password, SALTROUNDS);

      if (!hashedPass) return;
      const account = await postgresQuery(
        `INSERT INTO "USER" (id, email, password) VALUES ($1, $2, $3) RETURNING id`,
        ["LSKJDFLSKDJFSLKFJS", parsedBody.email, hashedPass]
      );

      if (account.rowCount > 0) {
        console.log("ACCOUNT SUCCESSFULLY MADE");
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({ message: "ACCOUNT CREATED", code: "SUCCESS" })
        );
      }
    } else {
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "FAIL", code: "FAIL" }));
    }
  });
}
