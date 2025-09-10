export type ToTpCreationCallback = {
    success: boolean;
    message: string;
    token?: string;
}

export type ToTpAccounts = {
    Id: number;
    Name: string;
    Icon?: string;
    OtpAuthUrl: string;
}