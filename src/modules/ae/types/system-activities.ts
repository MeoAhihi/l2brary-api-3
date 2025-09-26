export enum SystemActivity {
  COURSE_CREATED = "Course Created",
  COURSE_UPDATED = "Course Updated",
  COURSE_DELETED = "Course Deleted",
  ENROLLMENT_REQUESTED = "Enrollment Requested",
  ENROLLMENT_APPROVED = "Enrollment Approved",
  ENROLLMENT_REJECTED = "Enrollment Rejected",
  // Add more keys as needed
}

export const systemActivity: Record<
  SystemActivity,
  { point: number; category: string }
> = {
  [SystemActivity.COURSE_CREATED]: { point: 10, category: "system" },
  [SystemActivity.COURSE_UPDATED]: { point: 5, category: "system" },
  [SystemActivity.COURSE_DELETED]: { point: 0, category: "system" },
  [SystemActivity.ENROLLMENT_REQUESTED]: { point: 2, category: "system" },
  [SystemActivity.ENROLLMENT_APPROVED]: { point: 3, category: "system" },
  [SystemActivity.ENROLLMENT_REJECTED]: { point: 0, category: "system" },
  // Add more activities as needed
};

const namesSet = new Set<string>();
const categoriesSet = new Set<string>();

for (const [name, { category }] of Object.entries(systemActivity)) {
  namesSet.add(name);
  categoriesSet.add(category);
}

export const systemActivityNames = Array.from(namesSet);
export const systemActivityCategories = Array.from(categoriesSet);
