import Webcam from "react-webcam";
import { cancelScan, requestScanPermissions, startScan } from "../utils/qrScan";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { X } from "lucide-react";
import { platform } from "@tauri-apps/plugin-os";

export function QrCodeScanner({
  toTpUrl,
  close,
}: {
  toTpUrl: (url: string) => void;
  close: (state: boolean) => void;
}) {
  const [scannerOpen, setScannerOpen] = useState<boolean>(false);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    const platformData = platform();

    if (platformData != "android" && platformData != "ios") {
      setUnsupported(true);
    } else {
      setUnsupported(false);
    }
  }, []);

  async function scan() {
    await requestScanPermissions();
    const data = await startScan();
    if (data?.content) {
      toTpUrl(data.content);
    }
    setScannerOpen(false);
    close(true);
  }

  return (
    <>
      {scannerOpen && (
        <div className="fixed inset-0 flex flex-col justify-center items-center bg-black/80 backdrop-blur-md z-50">
          <button
            onClick={() => {
              cancelScan();
              setScannerOpen(false);
            }}
            className="absolute top-40 right-2 p-2 rounded-full transition shadow-md z-51"
          >
            <X className="text-white size-10" />
          </button>
          <div className="relative w-[90%] max-w-md rounded-2xl overflow-hidden shadow-lg border-2 border-zinc-700">
            <Webcam
              audio={false}
              videoConstraints={{
                facingMode: "environment",
              }}
              className="w-full h-auto"
            />

            <div className="absolute inset-0 border-4 border-blue-500/70 rounded-xl pointer-events-none" />
          </div>

          <button
            onClick={() => {
              setScannerOpen(false);
              scan();
            }}
            className="mt-6 w-20 h-20 flex items-center justify-center rounded-full bg-blue-600 text-white shadow-xl transition"
          >
            <Icon icon="bx:camera" width="32" height="32" />
          </button>
        </div>
      )}
      {unsupported ? (
        <>
          <p className="flex text-center items-center justify-center text-red-500">
            This OS does not support the QR Code Scanner. Use manual input!
          </p>
        </>
      ) : (
        <>
          {" "}
          <button
            type="button"
            className="text-sm text-blue-400 hover:underline self-center"
            onClick={() => {
              if (scannerOpen) {
                cancelScan();
                setScannerOpen(false);
              } else {
                setScannerOpen(true);
              }
            }}
          >
            {scannerOpen ? "Close Scanner" : "Open Scanner"}
          </button>
        </>
      )}
    </>
  );
}
