function reviveObjectDates(value: unknown, dateFields: string[]): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value;
  }

  const record = value as Record<string, unknown>;
  const revived: Record<string, unknown> = { ...record };

  dateFields.forEach((field) => {
    const fieldValue = revived[field];

    if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
      revived[field] = new Date(fieldValue);
    }
  });

  return revived;
}

export function reviveDateFields<T>(value: unknown, dateFields: string[]): T {
  if (Array.isArray(value)) {
    return value.map((item) => reviveObjectDates(item, dateFields)) as T;
  }

  return reviveObjectDates(value, dateFields) as T;
}
