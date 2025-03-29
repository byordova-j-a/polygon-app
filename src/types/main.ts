export enum EActionType {
  CREATING = 'creating',
  DRAW = 'draw',
  SELECTING_FIRST = 'selecting-first',
  SELECTING_SECOND = 'selecting-second',
  CHANGE_CLOCKWISE = 'change-clockwise',
  CLEAR = 'clear',
  NONE = 'none'
}

export enum ESelectedPointType {
  FIRST = 'first',
  SECOND = 'second'
}

export type TPoint = {
  x: number;
  y: number;
};

export enum EPointType {
  FIRST = 'first',
  SECOND = 'second'
}

export type TMountedEventParams = {isMounted: boolean};
export type TSetPointEventParams = {point: number};
export type TUpdatePointsAmountParams = {amount: number};
export type TActionButtonClickParams = {type: EActionType};
