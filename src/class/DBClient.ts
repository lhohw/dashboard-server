import { Pool } from "pg";
import { db } from "@vercel/postgres";

export type Client = {
  connect: () => void;
  query: <T = unknown>(
    sql: { text: string; values: any[] } | string
  ) => Promise<{ rows: T[] }>;
};
class DBPool {
  private static uniqueInstance: Client | null = null;
  private constructor() {}
  static async getInstance() {
    if (!DBPool.uniqueInstance) {
      DBPool.uniqueInstance = await DBPool.connect();
    }
    return DBPool.uniqueInstance;
  }
  private static async connect() {
    const env = process.env.NODE_ENV;
    if (env === "production") {
      const client = await db.connect();
      return client;
    } else {
      const client = new Pool();
      await client.connect();
      return client;
    }
  }
}

export default DBPool;
