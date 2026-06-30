import express, { type NextFunction, type Request, type Response } from "express";
import { type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { db } from "./db.ts";

const PORT = Number(process.env.PORT ?? 3001);
const TABLE_NAME = process.env.STUDENT_TABLE ?? "student";
const SCORE_TABLE_NAME = process.env.SCORE_TABLE ?? "score";

type SaveRequestBody = {
  num?: string;
  student_no?: string;
  name?: string;
};

type StudentUpdateRequestBody = {
  student_no?: string;
  name?: string;
};

type ScoreSaveRequestBody = {
  student_no?: string;
  name?: string;
  korean?: string;
  english?: string;
  math?: string;
};

type ScoreUpdateRequestBody = {
  student_no?: string;
  name?: string;
  korean?: string;
  english?: string;
  math?: string;
};

type ScoreSearchQuery = {
  q?: string;
  student_no?: string;
  name?: string;
};

type StudentRow = {
  id: number;
  student_no: string;
  name: string;
};

type ScoreRow = {
  id: number;
  student_no: string;
  name: string;
  korean: string;
  english: string;
  math: string;
  total: number;
  average: number;
};

type ApiErrorResponse = { ok: false; message: string };
type HealthResponse = { ok: true };
type SaveResponse = { ok: true; insertedId: number };
type UpdateResponse = { ok: true };
type StudentsResponse = { ok: true; students: StudentRow[] };
type ScoresResponse = { ok: true; scores: ScoreRow[] };
type JsonResponse =
  | HealthResponse
  | SaveResponse
  | UpdateResponse
  | StudentsResponse
  | ScoresResponse
  | ApiErrorResponse;

const app = express();

const toNumber = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toScoreRow = (row: RowDataPacket): ScoreRow => {
  const korean = toNumber(row.korean);
  const english = toNumber(row.english);
  const math = toNumber(row.math);
  const total = korean + english + math;

  return {
    id: Number(row.id),
    student_no: String(row.student_no),
    name: String(row.name),
    korean: String(row.korean),
    english: String(row.english),
    math: String(row.math),
    total,
    average: Number((total / 3).toFixed(2)),
  };
};

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

app.get("/scores", async (_req, res, next) => {
  try {
    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id, student_no, name, korean, english, math FROM \`${SCORE_TABLE_NAME}\` ORDER BY id DESC`,
    );

    const scores = rows.map(toScoreRow);

    res.status(200).json({
      ok: true,
      scores,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/scores/search", async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    const [rows] = await db.execute<RowDataPacket[]>(
      q.length > 0
        ? `SELECT id, student_no, name, korean, english, math FROM \`${SCORE_TABLE_NAME}\` WHERE student_no LIKE ? OR name LIKE ? ORDER BY id DESC`
        : `SELECT id, student_no, name, korean, english, math FROM \`${SCORE_TABLE_NAME}\` ORDER BY id DESC`,
      q.length > 0 ? [`%${q}%`, `%${q}%`] : [],
    );

    const scores = rows.map(toScoreRow);

    res.status(200).json({
      ok: true,
      scores,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/scores/conditional-search", async (
  req: Request<Record<string, never>, JsonResponse, never, ScoreSearchQuery>,
  res,
  next,
) => {
  try {
    const conditions: string[] = [];
    const values: Array<string> = [];

    const studentNo =
      typeof req.query.student_no === "string" ? req.query.student_no.trim() : "";
    const name = typeof req.query.name === "string" ? req.query.name.trim() : "";

    if (studentNo) {
      conditions.push("student_no LIKE ?");
      values.push(`%${studentNo}%`);
    }

    if (name) {
      conditions.push("name LIKE ?");
      values.push(`%${name}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [rows] = await db.execute<RowDataPacket[]>(
      `SELECT id, student_no, name, korean, english, math FROM \`${SCORE_TABLE_NAME}\` ${whereClause} ORDER BY id DESC`,
      values,
    );

    const scores = rows.map(toScoreRow);

    res.status(200).json({
      ok: true,
      scores,
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

app.put(
  "/students/:id",
  async (
    req: Request<{ id: string }, JsonResponse, StudentUpdateRequestBody>,
    res: Response<JsonResponse>,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const studentNo = req.body.student_no;
      const name = req.body.name;

      if (!Number.isFinite(id)) {
        res.status(400).json({
          ok: false,
          message: "Invalid student id.",
        });
        return;
      }

      if (typeof studentNo !== "string" || typeof name !== "string") {
        res.status(400).json({
          ok: false,
          message: "`student_no` and `name` must be strings.",
        });
        return;
      }

      if (!studentNo.trim() || !name.trim()) {
        res.status(400).json({
          ok: false,
          message: "`student_no` and `name` are required.",
        });
        return;
      }

      await db.execute(
        `UPDATE \`${TABLE_NAME}\` SET student_no = ?, name = ? WHERE id = ?`,
        [studentNo, name, id],
      );

      res.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

app.post(
  "/scores",
  async (
    req: Request<Record<string, never>, JsonResponse, ScoreSaveRequestBody>,
    res: Response<JsonResponse>,
    next: NextFunction,
  ) => {
    try {
      const studentNo = req.body.student_no;
      const name = req.body.name;
      const korean = req.body.korean;
      const english = req.body.english;
      const math = req.body.math;

      if (
        typeof studentNo !== "string" ||
        typeof name !== "string" ||
        typeof korean !== "string" ||
        typeof english !== "string" ||
        typeof math !== "string"
      ) {
        res.status(400).json({
          ok: false,
          message: "`student_no`, `name`, `korean`, `english`, and `math` must be strings.",
        });
        return;
      }

      if (
        !studentNo.trim() ||
        !name.trim() ||
        !korean.trim() ||
        !english.trim() ||
        !math.trim()
      ) {
        res.status(400).json({
          ok: false,
          message: "`student_no`, `name`, `korean`, `english`, and `math` are required.",
        });
        return;
      }

      const [result] = await db.execute<ResultSetHeader>(
        `INSERT INTO \`${SCORE_TABLE_NAME}\` (student_no, name, korean, english, math) VALUES (?, ?, ?, ?, ?)`,
        [studentNo, name, korean, english, math],
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

app.put(
  "/scores/:id",
  async (
    req: Request<{ id: string }, JsonResponse, ScoreUpdateRequestBody>,
    res: Response<JsonResponse>,
    next: NextFunction,
  ) => {
    try {
      const id = Number(req.params.id);
      const studentNo = req.body.student_no;
      const name = req.body.name;
      const korean = req.body.korean;
      const english = req.body.english;
      const math = req.body.math;

      if (!Number.isFinite(id)) {
        res.status(400).json({
          ok: false,
          message: "Invalid score id.",
        });
        return;
      }

      if (
        typeof studentNo !== "string" ||
        typeof name !== "string" ||
        typeof korean !== "string" ||
        typeof english !== "string" ||
        typeof math !== "string"
      ) {
        res.status(400).json({
          ok: false,
          message: "`student_no`, `name`, `korean`, `english`, and `math` must be strings.",
        });
        return;
      }

      if (
        !studentNo.trim() ||
        !name.trim() ||
        !korean.trim() ||
        !english.trim() ||
        !math.trim()
      ) {
        res.status(400).json({
          ok: false,
          message: "`student_no`, `name`, `korean`, `english`, and `math` are required.",
        });
        return;
      }

      await db.execute(
        `UPDATE \`${SCORE_TABLE_NAME}\` SET student_no = ?, name = ?, korean = ?, english = ?, math = ? WHERE id = ?`,
        [studentNo, name, korean, english, math, id],
      );

      res.status(200).json({ ok: true });
    } catch (error) {
      next(error);
    }
  },
);

app.post("/admin/reset-db", async (_req, res, next) => {
  try {
    await db.execute(`DROP TABLE IF EXISTS \`${SCORE_TABLE_NAME}\``);
    await db.execute(`DROP TABLE IF EXISTS \`${TABLE_NAME}\``);

    await db.execute(`
      CREATE TABLE \`${TABLE_NAME}\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`student_no\` VARCHAR(50) NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        PRIMARY KEY (\`id\`)
      )
    `);

    await db.execute(`
      CREATE TABLE \`${SCORE_TABLE_NAME}\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`student_no\` VARCHAR(50) NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`korean\` VARCHAR(20) NOT NULL,
        \`english\` VARCHAR(20) NOT NULL,
        \`math\` VARCHAR(20) NOT NULL,
        PRIMARY KEY (\`id\`)
      )
    `);

    res.status(200).json({
      ok: true,
    });
  } catch (error) {
    next(error);
  }
});

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
