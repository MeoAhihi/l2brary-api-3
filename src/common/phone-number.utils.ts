export function removePhoneHeadCode(phone: string) {
  // Convert phone numbers like +84123456789, 0084123456789, 84123456789 to 0123456789
  if (!phone) return phone;

  // Remove all spaces, dashes, and parentheses
  let normalized = phone.replace(/[\s\-()]/g, "");

  // Remove leading +84, 0084, or 84 and replace with 0
  if (normalized.startsWith("+84")) {
    normalized = "0" + normalized.slice(3);
  } else if (normalized.startsWith("0084")) {
    normalized = "0" + normalized.slice(4);
  } else if (normalized.startsWith("84")) {
    normalized = "0" + normalized.slice(2);
  }

  return normalized;
}
