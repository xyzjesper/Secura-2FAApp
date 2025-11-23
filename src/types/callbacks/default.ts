export type ErrorCodeCallback = {
  code: number;
  message: string;
};

export type LoginCallback = {
  success: boolean;
  message: string;
  code?: string;
};
