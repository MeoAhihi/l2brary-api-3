export enum Weekday {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum ScheduleType {
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  LUNAR_MONTHLY = "LUNAR_MONTHLY",
  ONE_TIME = "ONE_TIME",
}

export interface WeeklySchedule {
  daysOfWeek: Weekday[];
}

export interface MonthlySchedule {
  dayOfMonth: number; // 1–31
}

export interface OneTimeSchedule {
  dates: Date[];
}

export type ScheduleDetail = WeeklySchedule | MonthlySchedule | OneTimeSchedule;
