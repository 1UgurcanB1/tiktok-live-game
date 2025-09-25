import i18n from "../i18n";

/**
 * Generic localization accessor.
 * Pattern: base key holds Thai (default). English (or other locales) live in `${key}${suffix}`.
 * If current (or overridden) language starts with the target prefix (default: 'en') and an alt key exists & is not
 * an “empty value”, return that; otherwise fall back to the base key; if base missing or empty, return a typed empty value.
 */
export function localized<T extends Record<string, any>, K extends string>(
  obj: T | null | undefined,
  key: K,
  options?: {
    lang?: string; // override language; default i18n.language
    suffix?: string; // default 'En'
    targetLangPrefix?: string; // default 'en'
    emptyFactory?: () => any; // provide custom empty value; default inferred
    treatEmptyArrayObjectAsValue?: boolean; // if true, [] / {} are accepted (not considered empty)
  },
): any {
  const {
    lang = i18n.language,
    suffix = "En",
    targetLangPrefix = "en",
    emptyFactory,
    treatEmptyArrayObjectAsValue = false,
  } = options || {};

  // Helper to decide an "empty" placeholder based on existing base value (best-effort)
  const inferEmpty = (sample: any) => {
    if (emptyFactory) return emptyFactory();
    if (Array.isArray(sample)) return [];
    switch (typeof sample) {
      case "string":
        return "";
      case "number":
        return 0;
      case "boolean":
        return false;
      case "object":
        if (sample == null) return ""; // null or undefined → empty string
        return {};
      default:
        return "";
    }
  };

  if (!obj) return inferEmpty("");

  const baseVal = (obj as any)[key];
  const altKey = key + suffix;

  const wantAlt = lang.toLowerCase().startsWith(targetLangPrefix.toLowerCase());
  const hasAlt = Object.prototype.hasOwnProperty.call(obj, altKey);
  if (wantAlt && hasAlt) {
    const altVal = (obj as any)[altKey];
    if (!isEmptyValue(altVal, treatEmptyArrayObjectAsValue)) return altVal;
  }
  if (!isEmptyValue(baseVal, treatEmptyArrayObjectAsValue)) return baseVal;
  // Infer empty from whichever sample we have (prefer alt shape if base missing)
  return inferEmpty(
    baseVal !== undefined ? baseVal : hasAlt ? (obj as any)[altKey] : undefined,
  );
}

function isEmptyValue(v: any, treatEmptyArrayObjectAsValue: boolean): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.length === 0;
  if (Array.isArray(v)) {
    return treatEmptyArrayObjectAsValue ? false : v.length === 0;
  }
  if (typeof v === "object") {
    return treatEmptyArrayObjectAsValue ? false : Object.keys(v).length === 0;
  } // treat empty object as empty unless overridden
  return false; // numbers/booleans considered non-empty (even 0/false)
}
