export type WithDesc = { desc?: string };
export type WithFlatDesc = { flatDesc?: string };
export type WithDefect = { defect?: string; actualFailReasonParts?: string[] };
export type WithSkip = { skip?: string };
export type WithEmpty = { isEmpty?: boolean };

export type CaseAddition = WithFlatDesc & WithDefect & WithSkip & WithEmpty;
