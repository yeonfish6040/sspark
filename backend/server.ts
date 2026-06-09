import http, { type IncomingMessage, type ServerResponse } from "node:http";
import { type ResultSetHeader } from "mysql2/promise";
import { db } from "./db.ts";

const PORT = Number(process.env.PORT ?? 3001);
const TABLE_NAME = process.env.STUDENT_TABLE ?? "student";

type SaveRequestBody = {
  num?: unknown;
  student_no?: unknown;
  name?: unknown;
};

type JsonResponse =
  | { ok: true; insertedId?: number }
  | { ok: false; message: string };

const writeJson = (
  res: ServerResponse,
  statusCode: number,
  payload: JsonResponse,
) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(payload));
};

const readBody = async (req: IncomingMessage): Promise<SaveRequestBody> => {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  if (chunks.length === 0) {
    return {};
  }

  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) {
    return {};
  }

  return JSON.parse(raw) as SaveRequestBody;
};

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (req.method === "GET" && url.pathname === "/health") {
    writeJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "POST" && url.pathname === "/save") {
    try {
      const body = await readBody(req);
      const studentNo = body.num ?? body.student_no;
      const name = body.name;

      if (typeof studentNo !== "string" || typeof name !== "string") {
        writeJson(res, 400, {
          ok: false,
          message: "`num` and `name` must be strings.",
        });
        return;
      }

      if (!studentNo.trim() || !name.trim()) {
        writeJson(res, 400, {
          ok: false,
          message: "`num` and `name` are required.",
        });
        return;
      }

      const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO \`${TABLE_NAME}\` (student_no, name) VALUES (?, ?)`,
        [studentNo, name],
      );

      writeJson(res, 201, {
        ok: true,
        insertedId: result.insertId,
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        writeJson(res, 400, {
          ok: false,
          message: "Invalid JSON payload.",
        });
        return;
      }

      console.error("POST /save failed:", error);
      writeJson(res, 500, {
        ok: false,
        message: "Failed to save record.",
      });
    }
    return;
  }

  writeJson(res, 404, {
    ok: false,
    message: "Not found",
  });
});

server.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
