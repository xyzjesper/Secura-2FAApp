export type ToTpCreationCallback = {
  success: boolean;
  message: string;
  token?: number;
};

export type ToTpAccount = {
  Id: number;
  Name: string;
  Code?: number;
  Icon?: string;
  OtpAuthUrl: string;
};
