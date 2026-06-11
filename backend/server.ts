import express, { type NextFunction, type Request, type Response } from "express";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { db } from "./db.ts";

const PORT = Number(process.env.PORT ?? 3001);
const TABLE_NAME = process.env.STUDENT_TABLE ?? "student";

type SaveRequestBody = {
  num?: string;
  student_no?: string;
  name?: string;
};

type StudentRow = {
  id: number;
  student_no: string;
  name: string;
};

type ApiErrorResponse = { ok: false; message: string };
type HealthResponse = { ok: true };
type SaveResponse = { ok: true; insertedId: number };
type StudentsResponse = { ok: true; students: StudentRow[] };
type JsonResponse = HealthResponse | SaveResponse | StudentsResponse | ApiErrorResponse;

const app = express();

app.use(express.json());
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.options("*", (_, res) => {
  res.sendStatus(204);
});

app.get("/health", (_req, res) => {
  const payload: JsonResponse = { ok: true };
  res.status(200).json(payload);
});

app.get("/students", async (_req, res, next) => {
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id, student_no, name FROM \`${TABLE_NAME}\` ORDER BY id DESC`,
    );

    const students: StudentRow[] = rows.map((row) => ({
      id: Number(row.id),
      student_no: String(row.student_no),
      name: String(row.name),
    }));

    res.status(200).json({
      ok: true,
      students,
    });
  } catch (error) {
    next(error);
  }
});

app.post(
  "/save",
  async (
    req: Request<Record<string, never>, JsonResponse, SaveRequestBody>,
    res: Response<JsonResponse>,
    next: NextFunction,
  ) => {
    try {
      const studentNo = req.body.num ?? req.body.student_no;
      const name = req.body.name;

      if (typeof studentNo !== "string" || typeof name !== "string") {
        res.status(400).json({
          ok: false,
          message: "`num` and `name` must be strings.",
        });
        return;
      }

      if (!studentNo.trim() || !name.trim()) {
        res.status(400).json({
          ok: false,
          message: "`num` and `name` are required.",
        });
        return;
      }

      const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO \`${TABLE_NAME}\` (student_no, name) VALUES (?, ?)`,
        [studentNo, name],
      );

      res.status(201).json({
        ok: true,
        insertedId: result.insertId,
      });
    } catch (error) {
      next(error);
    }
  },
);

app.use(
  (
    error: unknown,
    _req: Request,
    res: Response<JsonResponse>,
    _next: NextFunction,
  ) => {
    if (
      error instanceof SyntaxError &&
      "status" in error &&
      (error as { status?: unknown }).status === 400
    ) {
      res.status(400).json({
        ok: false,
        message: "Invalid JSON payload.",
      });
      return;
    }

    console.error("Backend error:", error);
    res.status(500).json({
      ok: false,
      message: "Failed to save record.",
    });
  },
);

app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
