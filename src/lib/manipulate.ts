import type { Primitive } from "zod";
import type { builtinsTypes } from "pg-types";
import DBPool from "class/DBClient";
import { isColumnExists } from "lib/_helper";

export const addColumn = async (
  tableName: string,
  columnName: string,
  data: object[] | Primitive[] | (() => Primitive)[],
  type: builtinsTypes,
  notNull = false
) => {
  const client = await DBPool.getInstance();
  const ids = (
    await client.query<{ id: string }>(`SELECT id FROM ${tableName}`)
  )?.rows.map(({ id }) => id);

  if (notNull && ids.length !== data.length)
    throw new Error(
      `data length not matched | id length: ${ids.length} / data length: ${data.length}`
    );

  const isExist = await isColumnExists(client, tableName, columnName);
  if (isExist) {
    throw new Error(`column already exists: ${tableName}/${columnName}`);
  }

  await client.query(
    `ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${type}`
  );

  const queries = data.map((_, i) => {
    let d = data[i];
    const id = ids[i];
    if (typeof d === "function") d = d();

    return client.query({
      text: `UPDATE ${tableName}
        SET ${columnName} = $1
        WHERE id = $2`,
      values: [d, id],
    });
  });

  let message: string;
  let status;
  try {
    await Promise.all(queries);
    status = 200;
    message = "success to add column";

    if (notNull) {
      await client.query(
        `ALTER TABLE ${tableName} ALTER COLUMN ${columnName} SET NOT NULL`
      );
      message += "(not-null applied)";
    }
  } catch (e: any) {
    console.error("something went wrong\n", e);
    try {
      await client.query(
        `ALTER TABLE ${tableName} DROP COLUMN IF EXISTS ${columnName}`
      );
      status = 400;
      message = "failed to add column, please retry";
    } catch (e) {
      status = 500;
      message = "failed to add column & failed to remove column";
      console.error(e);
    }
  }

  return { message, status };
};
