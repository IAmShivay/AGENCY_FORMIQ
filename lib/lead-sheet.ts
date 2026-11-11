export const OPEN_LEAD_SHEET_EVENT = 'formiq:open-lead-sheet';
export const LEAD_SHEET_OPEN_CLASS = 'lead-sheet-open';

export const openLeadSheet = () => window.dispatchEvent(new Event(OPEN_LEAD_SHEET_EVENT));
