// Parse the MySQL connection string
export function parseConnectionString(connectionString: string) {
  const url = new URL(connectionString);
  return {
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    username: url.username,
    password: url.password,
    database: url.pathname.substring(1), // Remove leading slash
  };
}

/**
 * Normalize a phone number by removing all non-digit characters and ensure it starts with the given country code.
 * If the phone number already starts with the country code, it will not be added again.
 * @param phoneNumber The phone number string to normalize.
 * @param countryCode The country code to prepend (e.g., '1' for USA, '84' for Vietnam).
 * @returns The normalized phone number string with country code.
 */
export function normalizePhoneNumber(phoneNumber: string, countryCode: string): string {
  // Remove all non-digit characters
  let digits = phoneNumber.replace(/\D/g, '');

  // Remove leading zeros
  digits = digits.replace(/^0+/, '');

  // If the digits already start with the country code, return as is
  if (digits.startsWith(countryCode)) {
    return digits;
  }

  // Otherwise, prepend the country code
  return countryCode + digits;
}

/**
 * Validate if a phone number is in a valid international format.
 * This is a simple check for E.164 format: starts with + and 10-15 digits.
 * @param phoneNumber The phone number string to validate.
 * @returns True if valid, false otherwise.
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  return /^\+\d{10,15}$/.test(phoneNumber);
}
