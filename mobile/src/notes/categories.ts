// Defines the fixed note category names and their shared type.
export const noteCategories = ['Work', 'Study', 'Personal'] as const;

export type NoteCategory = (typeof noteCategories)[number];
