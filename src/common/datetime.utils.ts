import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from "class-validator";

export const DATE_FORMAT = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Checks if a string matches the YYYY-MM-DD date format.
 */
export function IsDateFormat(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isDateFormat",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, _args: ValidationArguments) {
          if (typeof value !== "string") return false;
          return DATE_FORMAT.test(value);
        },
        defaultMessage(_args: ValidationArguments) {
          return "$property must be a valid date string in the format YYYY-MM-DD";
        },
      },
    });
  };
}

export function UTC7StartOfDate(date: string) {
  // Returns a Date object representing the start of the given date (YYYY-MM-DD) in UTC+7 timezone.
  // For example, "2024-06-10" => 2024-06-09T17:00:00.000Z (which is 2024-06-10 00:00:00+07:00)
  if (!DATE_FORMAT.test(date)) {
    throw new Error("Invalid date format, must be YYYY-MM-DD");
  }
  // Parse as UTC midnight, then add 7 hours to get UTC+7 midnight, then convert back to UTC
  const [year, month, day] = date.split("-").map(Number);
  // JS months are 0-based
  return new Date(Date.UTC(year, month - 1, day, -7, 0, 0, 0));
}

export function UTC7EndOfDate(date: string) {
  // Returns a Date object representing the end of the given date (YYYY-MM-DD) in UTC+7 timezone.
  // For example, "2024-06-10" => 2024-06-10T16:59:59.999Z (which is 2024-06-10 23:59:59.999+07:00)
  if (!DATE_FORMAT.test(date)) {
    throw new Error("Invalid date format, must be YYYY-MM-DD");
  }
  const [year, month, day] = date.split("-").map(Number);
  // JS months are 0-based
  // Set time to 23:59:59.999 in UTC+7, which is 16:59:59.999 UTC
  return new Date(Date.UTC(year, month - 1, day, 16, 59, 59, 999));
}
