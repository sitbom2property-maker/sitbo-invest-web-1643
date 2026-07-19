import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { createDb } from "../database";
import { adminSessions } from "../database/schema";

type Env = {
	Bindings: {
		DB: D1Database;
		ADMIN_PASSWORD: string;
	};
};

const authRouter = new Hono<Env>();

const SESSION_DAYS = 7;

function sessionExpiry(): string {
	const d = new Date();
	d.setDate(d.getDate() + SESSION_DAYS);
	return d.toISOString();
}

authRouter.post("/login", async (c) => {
	try {
		const { password } = await c.req.json<{ password?: string }>();
		if (!password || password !== c.env.ADMIN_PASSWORD) {
			return c.json({ error: "Invalid password" }, 401);
		}

		const token = crypto.randomUUID();
		const now = new Date().toISOString();
		const db = createDb(c.env.DB);

		await db.insert(adminSessions).values({
			token,
			createdAt: now,
			expiresAt: sessionExpiry(),
		});

		return c.json({ token });
	} catch {
		return c.json({ error: "Invalid request" }, 400);
	}
});

authRouter.post("/logout", async (c) => {
	const token = c.req.header("x-admin-token");
	if (!token) {
		return c.json({ success: true });
	}

	const db = createDb(c.env.DB);
	await db.delete(adminSessions).where(eq(adminSessions.token, token));

	return c.json({ success: true });
});

authRouter.get("/verify", async (c) => {
	const token = c.req.header("x-admin-token");
	if (!token) {
		return c.json({ valid: false }, 401);
	}

	const db = createDb(c.env.DB);
	const rows = await db
		.select()
		.from(adminSessions)
		.where(eq(adminSessions.token, token))
		.limit(1);

	const session = rows[0];
	if (!session || new Date(session.expiresAt) < new Date()) {
		if (session) {
			await db.delete(adminSessions).where(eq(adminSessions.token, token));
		}
		return c.json({ valid: false }, 401);
	}

	return c.json({ valid: true });
});

export default authRouter;
