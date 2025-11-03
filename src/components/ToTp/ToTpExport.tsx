import { ToTpAccount } from "../../types/totp";
import { useState } from "react";
import { stringToIcon } from "@iconify/utils";
import { Copy, ScanQrCode, X } from "lucide-react";
import { toast } from "react-toastify";
import { getToTpQRCode } from "../../utils/qrScan";
import { QRCodeDisplay } from "../QRCodeDisplay";

export function ToTpExport({
  toTpAccount,
  isOpen,
  onClose,
}: {
  toTpAccount: ToTpAccount;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [showQRCode, setShowQRCode] = useState<string | undefined>(undefined);

  const getQrCodeBase64 = async () => {
    if (showQRCode != null) {
      return setShowQRCode(undefined);
    } else
      setShowQRCode((await getToTpQRCode(toTpAccount.OtpAuthUrl)).qrcodebase64 ?? "");
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-60">
          <div className="w-96 bg-zinc-900/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
            <button
              onClick={() => {
                getQrCodeBase64();
              }}
              className="fixed mr-72 p-1 rounded-full hover:bg-zinc-800 transition inline-flex"
            >
              <ScanQrCode className="text-zinc-400 hover:text-white" />
            </button>
            <button
              onClick={() => {
                onClose();
              }}
              className="fixed ml-72 p-1 rounded-full hover:bg-zinc-800 transition inline-flex"
            >
              <X className="text-zinc-400 hover:text-white" />
            </button>

            <QRCodeDisplay
              base64={showQRCode}
              isOpen={showQRCode != undefined}
              onClose={() => setShowQRCode(undefined)}
            ></QRCodeDisplay>

            <div className="w-16 h-16 bg-zinc-800 rounded-full flex justify-center items-center shadow-md">
              <img
                width={40}
                height={40}
                className="w-10 h-10"
                src={`https://api.iconify.design/${
                  stringToIcon(toTpAccount?.Icon ?? "ic:baseline-fingerprint")
                    ?.prefix
                }/${
                  stringToIcon(toTpAccount?.Icon ?? "ic:baseline-fingerprint")
                    ?.name
                }.svg?color=white`}
              />
            </div>
            <h2 className="text-lg font-semibold text-white text-center">
              {toTpAccount?.Name ?? "Unbekannt"}
            </h2>
            <form className="flex flex-col items-center gap-4 w-full">
              <div className="inline-flex justify-center items-center">
                <input
                  type="text"
                  className="w-full h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={toTpAccount.Name}
                />
              </div>
              <div className="inline-flex justify-center items-center ml-11 mr-1">
                {" "}
                <input
                  type="text"
                  className="mr-2 blur-xs w-full h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={
                    toTpAccount.OtpAuthUrl.split("?secret=")[1].split("&")[0]
                  }
                />
                <div
                  onClick={() => {
                    navigator.clipboard.writeText(
                      toTpAccount.OtpAuthUrl.split("?secret=")[1].split("&")[0]
                    );
                    toast("Copied to Clipboard");
                  }}
                  className="border-2 p-2 rounded-2xl"
                >
                  <Copy className="size-4"></Copy>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
