export const FORMS = [{ id: 'quote', title: 'Quote request' }] as const;
export type FormType = typeof FORMS[number]['id'];
