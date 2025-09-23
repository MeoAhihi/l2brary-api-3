// schedule.validation.ts
import mongoose from "mongoose";

import { Weekday } from "../types/schedule.types";

const { Schema } = mongoose;

const scheduleDetailSchema = new Schema({
  daysOfWeek: [
    {
      type: String,
      enum: Weekday,
    },
  ],
  dayOfMonth: { type: Number, min: 1, max: 31 },
  dates: [{ type: Date }],
});

export const ScheduleValidator = mongoose.model(
  "ScheduleValidation",
  scheduleDetailSchema,
);
