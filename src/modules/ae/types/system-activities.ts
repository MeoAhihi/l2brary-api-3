export enum SystemActivityKey {
  COURSE_CREATED = "Course Created||system",
  COURSE_UPDATED = "Course Updated||system",
  COURSE_DELETED = "Course Deleted||system",
  ENROLLMENT_REQUESTED = "Enrollment Requested||system",
  ENROLLMENT_APPROVED = "Enrollment Approved||system",
  ENROLLMENT_REJECTED = "Enrollment Rejected||system",
  // Add more keys as needed
}

export const systemActivity: Record<SystemActivityKey, number> = {
  [SystemActivityKey.COURSE_CREATED]: 10,
  [SystemActivityKey.COURSE_UPDATED]: 5,
  [SystemActivityKey.COURSE_DELETED]: 0,
  [SystemActivityKey.ENROLLMENT_REQUESTED]: 2,
  [SystemActivityKey.ENROLLMENT_APPROVED]: 3,
  [SystemActivityKey.ENROLLMENT_REJECTED]: 0,
  // Add more activities as needed
};

const namesSet = new Set<string>();
const categoriesSet = new Set<string>();

for (const key of Object.values(SystemActivityKey)) {
  const [name, category] = key.split("||");
  namesSet.add(name);
  categoriesSet.add(category);
}

export const systemActivityNames = Array.from(namesSet);
export const systemActivityCategories = Array.from(categoriesSet);
