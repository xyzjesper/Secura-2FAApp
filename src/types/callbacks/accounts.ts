import { ToTpAccount } from "../totp"

export type GetAccountCallback = {
    success: boolean,
    data: ToTpAccount[],
    message: string
}

export type ToTpCreationCallback = {
  success: boolean;
  message: string;
  token?: number;
  nextToken?: number;
};

export type AddAccountCallback = {
    success: boolean,
    data: ToTpAccount[],
    message: string,
    created: ToTpAccount | null
}

export type UpdateAccountCallback = {
    success: boolean,
    message: string
}