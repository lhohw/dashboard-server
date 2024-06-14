import type { RouterContext } from "@koa/router";

import { z } from "zod";
import { addColumn as _addColumn } from "lib/manipulate";
import { PGBuiltinsTypes } from "const/definitions";

type SystemState = {};
type SystemContext = RouterContext<SystemState>;

/**
 * table에 column 추가
 * POST /system/column
 */
export const addColumn = async (ctx: SystemContext) => {
  const ObjectType = z.object({
    tableName: z.string(),
    columnName: z.string(),
    data: z.array(z.any()),
    type: PGBuiltinsTypes,
    notNull: z.boolean().optional(),
  });

  let requestBody: z.infer<typeof ObjectType>;
  try {
    requestBody = ObjectType.pick({
      tableName: true,
      columnName: true,
      data: true,
      type: true,
      notNull: true,
    }).parse(ctx.request.body);
  } catch (e: any) {
    ctx.status = 400;
    ctx.message = e.message;
    return;
  }

  try {
    const { tableName, columnName, data, type, notNull } = requestBody;
    const res = await _addColumn(tableName, columnName, data, type, notNull);
    ctx.response.body = res;
  } catch (e: any) {
    ctx.throw(500, e);
  }
};
