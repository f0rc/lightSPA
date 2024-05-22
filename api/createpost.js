import randomUUID from "crypto";
import { postgresQuery } from "../src/server/db/db";

async function handleCreatePost(req, res) {
  console.log("Incoming request: CREATING POST", req.url);


  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const parsedBody = JSON.parse(body);

    console.log("MONEY", parsedBody);

    if (!parsedBody.title || !parsedBody.body) {
      console.log("ERROR: BODY OR TITLE IS MISSING");
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Missing title or comment" }));
      return;
    }

    const makePost = await postgresQuery(
      `INSERT INTO "POST" (id, title, body, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [randomUUID(), parsedBody.title, parsedBody.body, req.user]
    );

    if (makePost.rowCount > 0) {
      console.log("POST CREATED", makePost.rows[0]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "postcreated" }));
    } else {
      console.log("ERROR: POST CREATION FAIL DATABASE ROWS === 0");
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "POST CREATE FAIL DB" }));
    }
  });
}
