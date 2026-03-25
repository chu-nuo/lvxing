import type { ZodSchema } from "zod";
import { ZodError } from "zod";

export function formatZodError(zodError: ZodError) {
  return zodError.issues
    .map((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "(root)";
      return `${path}: ${issue.message}`;
    })
    .join("; ");
}

/**
 * 通用结构化校验重试：
 * - 第一次尝试生成 JSON
 * - 用 Zod 校验
 * - 校验失败时，把错误摘要传给 generateWithRepair 让 LLM 修复 JSON
 */
export async function retryStructured<T>({
  schema,
  generateOnce,
  generateWithRepair,
  maxRetries = 2,
}: {
  schema: ZodSchema<T>;
  generateOnce: () => Promise<string>;
  generateWithRepair: (repairInstruction: string) => Promise<string>;
  maxRetries?: number;
}): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const raw = attempt === 0 ? await generateOnce() : null;

    let outputText: string;
    if (attempt === 0) {
      outputText = raw as string;
    } else {
      const repairInstruction = formatAnyError(lastError);
      outputText = await generateWithRepair(repairInstruction);
    }

    try {
      const json = JSON.parse(outputText);
      const parsed = schema.parse(json);
      return parsed;
    } catch (err) {
      lastError = err;
      // 继续重试
    }
  }

  throw lastError;
}

export function formatAnyError(err: unknown) {
  if (err instanceof ZodError) return formatZodError(err);
  if (err instanceof Error) return err.message;
  return String(err);
}

