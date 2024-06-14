import type { Client } from "class/DBClient";
import type { Primitive } from "const/definitions";

export const isTableExists = async (client: Client, tableName: string) => {
  try {
    const res = await client.query(`
      SELECT 1 FROM ${tableName} LIMIT 1;
    `);
    return true;
  } catch (e: any) {
    return false;
  }
};

export const isColumnExists = async (
  client: Client,
  tableName: string,
  columnName: string
) => {
  try {
    const res = await client.query(`
      SELECT ${columnName} from ${tableName} LIMIT 1
    `);
    return true;
  } catch (e: any) {
    return false;
  }
};

export const isPrimitive = (data: unknown): data is Primitive => {
  return typeof data !== "function";
};
