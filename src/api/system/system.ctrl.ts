import type { RouterContext } from "@koa/router";

import { z } from "zod";
import {
  addColumn as _addColumn,
  changeCategory as _changeCategory,
} from "lib/manipulate";
import { PGBuiltinsTypes } from "const/definitions";
import { validate } from "lib/_helper";

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
    requestBody = validate(ctx.request.body, ObjectType);
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

/**
 * category 변경
 * PATCH /system/category
 */
export const changeCategory = async (ctx: SystemContext) => {
  const ObjectType = z.object({
    from: z.string(),
    to: z.string(),
  });

  let requestBody: z.infer<typeof ObjectType>;
  try {
    requestBody = validate(ctx.request.body, ObjectType);
  } catch (e: any) {
    ctx.status = 400;
    ctx.message = e.message;
    return;
  }

  try {
    const { from, to } = requestBody;
    const res = await _changeCategory(from, to);
    ctx.response.body = res;
  } catch (e: any) {
    ctx.throw(500, e);
  }
};
