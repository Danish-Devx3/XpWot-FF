/**
 * @typedef {"4 GB" | "6 GB" | "8 GB" | "12 GB"} SupportedRam
 */

const VERIFIED_DPI_MAPPINGS = Object.freeze({
  "4": 528,
  "6": 514,
  "8": 497,
  "12": 487,
});

/**
 * Returns a verified recommendation only for the supplied reference DPI.
 *
 * @param {string | number} ram
 * @param {number} currentDpi
 * @returns {number | null}
 */
function getRecommendedDpi(ram, currentDpi) {
  const parsedRam =
    typeof ram === "number"
      ? String(ram)
      : typeof ram === "string"
        ? ram.trim().match(/^(\d+)\s*(?:gb)?$/i)?.[1]
        : undefined;

  if (!parsedRam || !Number.isInteger(currentDpi) || currentDpi !== 360) {
    return null;
  }

  return Object.prototype.hasOwnProperty.call(VERIFIED_DPI_MAPPINGS, parsedRam)
    ? VERIFIED_DPI_MAPPINGS[parsedRam]
    : null;
}

module.exports = { getRecommendedDpi };
