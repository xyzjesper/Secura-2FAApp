import { ToTpAccount } from "./totp";

export type AppData = {
  accounts: ToTpAccount[];
  version: string;
};
