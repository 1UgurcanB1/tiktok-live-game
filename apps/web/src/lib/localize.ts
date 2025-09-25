import i18n from "../i18n";

// WeakMap-based cache: object -> (compositeKey -> value)
// We use a generation number for O(1) global invalidation (no need to iterate WeakMap – which is not iterable).
const _localizedCache: WeakMap<object, Map<string, any>> = new WeakMap();
let _cacheGeneration = 0;

/**
 * Increment the cache generation so all previously stored entries become obsolete.
 * We don't need to physically delete old Maps; their entries become unreachable since generation
 * is part of the composite key. Old entries will be garbage collected naturally.
 */
export function clearLocalizedCache() {
  _cacheGeneration++;
}

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
    /**
     * Mapping of language prefixes → suffix used to build alt key.
     * Example: { en: 'En', ja: 'Ja', th: '' }
     * If provided, this takes precedence over (suffix + targetLangPrefix) logic.
     * Matching rule: pick the longest key in the map that is a prefix of current lang (case-insensitive).
     */
    suffixMap?: Record<string, string>;
    /** Enable or disable cache (default true unless an emptyFactory provided). */
    useCache?: boolean;
  },
): any {
  const {
    lang = i18n.language,
    suffix = "En",
    targetLangPrefix = "en",
    emptyFactory,
    treatEmptyArrayObjectAsValue = false,
    suffixMap,
    useCache = !options?.emptyFactory, // avoid caching when custom emptyFactory alters semantics
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

  // Determine dynamic suffix when suffixMap is present.
  let resolvedSuffix = suffix;
  let matchedByMap = false;
  if (suffixMap && Object.keys(suffixMap).length > 0) {
    const lowerLang = lang.toLowerCase();
    // Longest prefix match provides determinism when overlapping keys (e.g., 'en' vs 'en-gb')
    let bestKey: string | undefined;
    for (const k of Object.keys(suffixMap)) {
      const lk = k.toLowerCase();
      if (lowerLang.startsWith(lk)) {
        if (!bestKey || lk.length > bestKey.length) bestKey = k;
      }
    }
    if (bestKey) {
      resolvedSuffix = suffixMap[bestKey];
      matchedByMap = true;
    }
  }

  const altKey = key + resolvedSuffix;

  // Build cache key (post suffix resolution). Include flags that influence decision logic.
  // Note: We do NOT include the presence of suffixMap itself—only its resolution outcome (resolvedSuffix + matched flag).
  // If object is mutable and its localized fields can change, caller should disable cache.
  let cached: any;
  let cacheKey: string | undefined;
  if (useCache && typeof obj === "object" && obj !== null && !emptyFactory) {
    cacheKey = [
      _cacheGeneration,
      key,
      lang,
      resolvedSuffix,
      matchedByMap ? 1 : 0,
      targetLangPrefix,
      treatEmptyArrayObjectAsValue ? 1 : 0,
    ].join("|");
    const inner =
      _localizedCache.get(obj) ||
      (() => {
        const m = new Map<string, any>();
        _localizedCache.set(obj as object, m);
        return m;
      })();
    if (inner.has(cacheKey)) {
      return inner.get(cacheKey);
    }
    // We'll compute and then store before returning.
    cached = inner;
  }

  const wantAlt = lang.toLowerCase().startsWith(targetLangPrefix.toLowerCase());
  const hasAlt = Object.prototype.hasOwnProperty.call(obj, altKey);
  // If using suffixMap, rely on match presence; otherwise use targetLangPrefix rule.
  const shouldTryAlt = matchedByMap ? hasAlt : wantAlt && hasAlt;
  let result: any;
  if (shouldTryAlt) {
    const altVal = (obj as any)[altKey];
    if (!isEmptyValue(altVal, treatEmptyArrayObjectAsValue)) {
      result = altVal;
    }
  }
  if (
    result === undefined &&
    !isEmptyValue(baseVal, treatEmptyArrayObjectAsValue)
  ) {
    result = baseVal;
  }
  if (result === undefined) {
    result = inferEmpty(
      baseVal !== undefined
        ? baseVal
        : hasAlt
          ? (obj as any)[altKey]
          : undefined,
    );
  }

  if (cacheKey && cached) {
    (cached as Map<string, any>).set(cacheKey, result);
  }
  return result;
}

function isEmptyValue(v: any, treatEmptyArrayObjectAsValue: boolean): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === "string") return v.length === 0;
  if (Array.isArray(v)) {
    return treatEmptyArrayObjectAsValue ? false : v.length === 0;
  }
  if (typeof v === "object") {
    return treatEmptyArrayObjectAsValue ? false : Object.keys(v).length === 0;
  } // Treat empty object as empty unless overridden
  return false; // numbers/booleans considered non-empty (even 0/false)
}
