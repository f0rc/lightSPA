import { postgresQuery } from "../src/server/db/db";

async function handleUpdatePost(req, res, id) {
  console.log("UPDATE POST REQ", req.url, id);

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    const parsedBody = JSON.parse(body);

    if (!parsedBody.title || !parsedBody.body || !parsedBody.postId) {
      console.log("ERROR: BODY OR TITLE IS MISSING");
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "Missing title or comment" }));
      return;
    }

    console.log("UPDATE ID", id, "UPDATE USER", req.user);

    const updatePost = await postgresQuery(
      `UPDATE "POST" SET "title" = $1, "body" = $2 WHERE "id" = $3 AND "user_id" = $4 RETURNING *;`,
      [parsedBody.title, parsedBody.body, parsedBody.postId, req.user]
    );

    console.log(updatePost.rows[0]);

    if (updatePost.rowCount > 0) {
      console.log("POST UPDATED", updatePost.rows[0]);
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "post created" }));
    } else {
      console.log("ERROR: POST CREATION FAIL DATABASE ROWS === 0");
      res.statusCode = 500;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ message: "POST CREATE FAIL DB" }));
    }
  });
}
