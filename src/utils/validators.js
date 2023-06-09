import { isString, isEmpty } from "lodash";

/**
 *
 * @param {string} password
 * @returns {number}
 */

export const validatePassword = (password) => {
  let strength = 0;
  let specialRegex = /[`!@#$%^&*()_+\-=[\]{};':"|,.<>/?~\\]/;
  if (password) {
    if (password.length >= 3) {
      strength += 1;
      // At least one letter
      if (/[a-zA-Z]/.test(password)) {
        strength += 1;
      }
      // At least one number
      for (let i = 0; i < password.length; i++) {
        let char = parseInt(password.charAt(i));
        if (!isNaN(char)) {
          strength += 1;
          break;
        }
      }
      // At least one symbol, and 8 chars
      if (specialRegex.test(password) && password.length >= 8) {
        strength += 1;
      }
    }
  }
  return strength;
};

/**
 * Validate if value is valid integer or float without separators and only one fractional point.
 *
 * @param {number|string} value Numeric value to check.
 * @returns {boolean} true if validation pass, false otherwise.
 */
export const isValidIntOrFloat = (value) => {
  // Assume empty string as pass check.
  if (isString(value) && isEmpty(value)) {
    return true;
  }

  const pattern = new RegExp(/^-{0,1}\d*\.{0,1}\d+$/);
  const passed = pattern.test(String(value));

  return passed;
};

/**
 * Get number of decimals from a precision number
 * @param {string} integerMultiple Precision number (e.g. 0.00000001)
 * @returns {number} Number of decimals.
 */
export const precisionNumberToDecimals = (integerMultiple) => {
  // https://www.reddit.com/r/BinanceExchange/comments/995jra/getting_atomic_withdraw_unit_from_api/e4mi63w/
  const integerMultipleFloat = parseFloat(integerMultiple);
  const maxDecimals = integerMultipleFloat > 1 ? 0 : Math.abs(Math.log10(integerMultipleFloat));
  return maxDecimals;
};

/**
 * Validate if number has correct amount of decimals
 * @param {string} value Value
 * @param {number} maxDecimals Max number of decimals.
 * @returns {boolean} Validity.
 */
export const validateDecimals = (value, maxDecimals) => {
  if (!value) return false;

  const splitValueDot = value.split(".");
  // Handle incorrect number
  if (splitValueDot.length > 2) return false;

  const decimals = splitValueDot.length === 1 ? 0 : splitValueDot[1].length;
  return decimals <= maxDecimals;
};

/**
 * Validate URL
 * @param {string} value URL
 * @returns {boolean} result
 */
export const validateURL = (value) =>
  Boolean(
    value.match(
      new RegExp(
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/,
      ),
    ),
  );

export const emailRegex =
  /^[a-zA-Z0-9.!#$%&\\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
