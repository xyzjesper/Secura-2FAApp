import { Download } from "lucide-react";
import { getAccounts } from "../../utils/totp";
import { AppData } from "../../types/default";
import { appVersion } from "../../utils/default";
import { toast } from "react-toastify";

export function ExportModal({
  isOpen,
  onClsoe,
}: {
  isOpen: boolean;
  onClsoe: () => void;
}) {
  if (!isOpen) return;

  const handleExport = async () => {
    const toTpAccounts = await getAccounts();
    const exportData: AppData = {
      accounts: toTpAccounts.data,
      version: await appVersion(),
    };
    const blob = new Blob([btoa(JSON.stringify(exportData))], {
      type: "text/plain",
    });
    const fileName = `secura-accounts-${new Date().toLocaleString()}.txt`;
    const file = new File([blob], fileName);
    const fileURL = URL.createObjectURL(file);

    const downloadLink = document.createElement("a");
    downloadLink.href = fileURL;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();

    toast("Export Downloaded");
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-101">
        <div className="w-72 bg-zinc-900/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <div>
            <div className="flex justify-center items-center">
              <div>
                <p className="text-center">
                  Click on Download to download the file and export it.
                </p>
              </div>
            </div>
            <hr className="w-full border-zinc-700 my-2" />
            <div className="flex justify-center items-center">
              <button
                onClick={() => {
                  handleExport();
                }}
                className="inline-flex"
              >
                <Download className="mr-3 justify-center items-center flex"></Download>
                <p className="justify-center items-center flex"> Download</p>
              </button>
            </div>
          </div>

          <div>
            <button onClick={() => onClsoe()}>Close Menu</button>
          </div>
        </div>
      </div>
    </>
  );
}
