const VALIDATORS = {
  string: (value) => typeof value === "string",
  number: (value) => typeof value === "number" && Number.isFinite(value),
  boolean: (value) => typeof value === "boolean",
  array: (value) => Array.isArray(value),
  object: (value) => value !== null && typeof value === "object" && !Array.isArray(value),
  function: (value) => typeof value === "function",
};

export class PropsError extends Error {
  constructor(message) {
    super(message);
    this.name = "PropsError";
  }
}

function toDefinition(rule) {
  return typeof rule === "string" ? { type: rule } : rule;
}

export function validateProps(name, schema, props = {}) {
  const validated = { ...props };

  for (const [key, rule] of Object.entries(schema)) {
    const definition = toDefinition(rule);
    const value = props[key] === undefined ? definition.default : props[key];

    if (value === undefined || value === null) {
      if (definition.required) {
        throw new PropsError(`<${name}> : la propriété "${key}" est obligatoire.`);
      }
      validated[key] = value;
      continue;
    }

    const validator = VALIDATORS[definition.type];
    if (validator && !validator(value)) {
      throw new PropsError(`<${name}> : la propriété "${key}" doit être de type ${definition.type}.`);
    }

    if (definition.values && !definition.values.includes(value)) {
      throw new PropsError(
        `<${name}> : la propriété "${key}" doit valoir ${definition.values.join(" | ")}.`,
      );
    }

    if (definition.validate && !definition.validate(value)) {
      throw new PropsError(`<${name}> : la propriété "${key}" ne respecte pas la règle attendue.`);
    }

    validated[key] = value;
  }

  return validated;
}

export default function defineComponent(name, schema, render) {
  function Component(props = {}) {
    return render(validateProps(name, schema, props));
  }

  Component.displayName = name;
  Component.schema = schema;
  return Component;
}
