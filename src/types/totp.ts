export type ToTpCreationCallback = {
  success: boolean;
  message: string;
  token?: number;
  nextToken?: number;
};

export type ToTpAccount = {
  Id: number;
  Name: string;
  Code?: number;
  NextCode?: number;
  Icon?: string;
  OtpAuthUrl: string;
};

export type ToTpQRCodeCalback = {
  success: boolean;
  qrCodeBase64: string;
};
