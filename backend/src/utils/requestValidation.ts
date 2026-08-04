import { Response } from "express";

type BaseRule = {
  required?: boolean;
};

type StringRule = BaseRule & {
  type: "string";
  min?: number;
  max?: number;
  pattern?: RegExp;
  trim?: boolean;
  enum?: readonly string[];
  allowEmpty?: boolean;
};

type StringArrayRule = BaseRule & {
  type: "stringArray";
  minItems?: number;
  maxItems?: number;
  itemMax?: number;
  enum?: readonly string[];
};

type BooleanRule = BaseRule & {
  type: "boolean";
};

type ObjectRule = BaseRule & {
  type: "object";
};

type Rule = StringRule | StringArrayRule | BooleanRule | ObjectRule;
type Schema = Record<string, Rule>;

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: string[] };

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  return !!value && typeof value === "object" && !Array.isArray(value);
};

export const validateBody = <T>(body: unknown, schema: Schema): ValidationResult<T> => {
  const data = body === undefined ? {} : body;
  const errors: string[] = [];
  const value: Record<string, unknown> = {};

  if (!isPlainObject(data)) {
    return { ok: false, errors: ["Request body must be a JSON object"] };
  }

  const allowedFields = new Set(Object.keys(schema));
  for (const key of Object.keys(data)) {
    if (!allowedFields.has(key)) {
      errors.push(`Unexpected property: ${key}`);
    }
  }

  for (const [field, rule] of Object.entries(schema)) {
    const rawValue = data[field];
    if (rawValue === undefined || rawValue === null) {
      if (rule.required) errors.push(`${field} is required`);
      continue;
    }

    if (rule.type === "string") {
      if (typeof rawValue !== "string") {
        errors.push(`${field} must be a string`);
        continue;
      }

      const normalized = rule.trim === false ? rawValue : rawValue.trim();
      if (!rule.allowEmpty && normalized.length === 0) {
        errors.push(`${field} must not be empty`);
      }
      if (rule.min !== undefined && normalized.length < rule.min) {
        errors.push(`${field} must be at least ${rule.min} characters`);
      }
      if (rule.max !== undefined && normalized.length > rule.max) {
        errors.push(`${field} must be at most ${rule.max} characters`);
      }
      if (rule.pattern && normalized.length > 0 && !rule.pattern.test(normalized)) {
        errors.push(`${field} is invalid`);
      }
      if (rule.enum && !rule.enum.includes(normalized)) {
        errors.push(`${field} must be one of: ${rule.enum.join(", ")}`);
      }
      value[field] = normalized;
      continue;
    }

    if (rule.type === "stringArray") {
      if (!Array.isArray(rawValue)) {
        errors.push(`${field} must be an array`);
        continue;
      }
      if (rule.minItems !== undefined && rawValue.length < rule.minItems) {
        errors.push(`${field} must include at least ${rule.minItems} item(s)`);
      }
      if (rule.maxItems !== undefined && rawValue.length > rule.maxItems) {
        errors.push(`${field} must include at most ${rule.maxItems} item(s)`);
      }

      const normalized: string[] = [];
      rawValue.forEach((item, index) => {
        if (typeof item !== "string") {
          errors.push(`${field}[${index}] must be a string`);
          return;
        }

        const trimmed = item.trim();
        if (!trimmed) {
          errors.push(`${field}[${index}] must not be empty`);
          return;
        }
        if (rule.itemMax !== undefined && trimmed.length > rule.itemMax) {
          errors.push(`${field}[${index}] must be at most ${rule.itemMax} characters`);
        }
        if (rule.enum && !rule.enum.includes(trimmed)) {
          errors.push(`${field}[${index}] must be one of: ${rule.enum.join(", ")}`);
        }
        normalized.push(trimmed);
      });
      value[field] = Array.from(new Set(normalized));
      continue;
    }

    if (rule.type === "boolean") {
      if (typeof rawValue !== "boolean") {
        errors.push(`${field} must be a boolean`);
        continue;
      }
      value[field] = rawValue;
      continue;
    }

    if (rule.type === "object") {
      if (!isPlainObject(rawValue)) {
        errors.push(`${field} must be an object`);
        continue;
      }
      value[field] = rawValue;
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, value: value as T };
};

export const sendValidationError = (res: Response, errors: string[]): void => {
  res.status(400).json({ error: "Validation failed", details: errors });
};

export const validateEmptyBody = (body: unknown): ValidationResult<Record<string, never>> => {
  return validateBody<Record<string, never>>(body, {});
};

const httpUrlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const schemas = {
  register: {
    email: { type: "string", required: true, max: 254, pattern: emailPattern },
    password: { type: "string", required: true, min: 8, max: 128, trim: false },
  },
  login: {
    email: { type: "string", required: true, max: 254, pattern: emailPattern },
    password: { type: "string", required: true, min: 1, max: 128, trim: false },
  },
  search: {
    topic: { type: "string", required: true, min: 1, max: 200 },
  },
  savedResource: {
    title: { type: "string", required: true, min: 1, max: 300 },
    description: { type: "string", max: 2000, allowEmpty: true },
    url: { type: "string", required: true, max: 2048, pattern: httpUrlPattern },
    source: { type: "string", max: 80, allowEmpty: true },
    type: {
      type: "string",
      max: 40,
      allowEmpty: true,
      enum: ["youtube", "podcast", "documentation", "course", "video", "article"],
    },
    thumbnail: { type: "string", max: 2048, pattern: httpUrlPattern, allowEmpty: true },
  },
  resourceInteraction: {
    url: { type: "string", max: 2048, pattern: httpUrlPattern },
    resourceUrl: { type: "string", max: 2048, pattern: httpUrlPattern },
  },
  preferences: {
    preferredSources: {
      type: "stringArray",
      required: true,
      minItems: 1,
      maxItems: 8,
      itemMax: 40,
      enum: ["video", "podcast", "documentation", "course", "youtube", "article"],
    },
  },
  passkeyRegistrationVerify: {
    id: { type: "string", required: true, max: 1024 },
    rawId: { type: "string", required: true, max: 1024 },
    response: { type: "object", required: true },
    type: { type: "string", required: true, enum: ["public-key"] },
    authenticatorAttachment: { type: "string", max: 40, allowEmpty: true },
    clientExtensionResults: { type: "object" },
  },
  passkeyAuthenticationVerify: {
    id: { type: "string", required: true, max: 1024 },
    rawId: { type: "string", required: true, max: 1024 },
    response: { type: "object", required: true },
    type: { type: "string", required: true, enum: ["public-key"] },
    authenticatorAttachment: { type: "string", max: 40, allowEmpty: true },
    clientExtensionResults: { type: "object" },
  },
} satisfies Record<string, Schema>;
