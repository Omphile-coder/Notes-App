export const noteCategories = ['Work', 'Study', 'Personal'] as const;

export type NoteCategory = (typeof noteCategories)[number];
