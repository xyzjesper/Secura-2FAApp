import { useEffect, useState } from "react";
import { appVersion } from "../../utils/default";
import { openUrl } from "@tauri-apps/plugin-opener";
import { Import, RotateCcw, Upload } from "lucide-react";
import { ExportModal } from "./Export";
import { ResetModal } from "./Reset";
import { ImportModal } from "./Import";

export function SettingsModal({
  isOpen,
  onClsoe,
}: {
  isOpen: boolean;
  onClsoe: () => void;
}) {
  if (!isOpen) return;
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [appVerion, setAppVersion] = useState<string>("??.??.??");

  useEffect(() => {
    async function fetch() {
      setAppVersion(await appVersion());
    }
    fetch();
  });

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-70">
        <div className="w-72 bg-zinc-900/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <div className="inline-flex ml-2 mr-2">
            <div>
              <button
                onClick={() => setExportOpen(true)}
                className="inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
              >
                <Upload className="ml-2 mr-2"></Upload> Export
              </button>
              <ExportModal
                isOpen={exportOpen}
                onClsoe={() => setExportOpen(false)}
              />
              <button
                onClick={() => setResetOpen(true)}
                className="inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
              >
                <RotateCcw className="ml-2 mr-2"></RotateCcw> Reset
              </button>
              <ResetModal
                isOpen={resetOpen}
                onClsoe={() => setResetOpen(false)}
              />
            </div>
            <button
              onClick={() => setImportOpen(true)}
              className="inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
            >
              <Import className="ml-2 mr-2"></Import> Import
            </button>
            <ImportModal
              isOpen={importOpen}
              onClsoe={() => setImportOpen(false)}
            ></ImportModal>
          </div>
          <hr className="w-full border-zinc-700 my-2" />
          <div className="p-4 border-2 w-full rounded-2xl h-40">
            <p>App Information</p>
            <hr className="w-full border-zinc-700 my-2" />
            <p>Version: {appVerion}</p>
            <p>
              License:{" "}
              <a
                target="_self"
                className="hover:no-underline text-zinc-500 hover:cursor-pointer"
                onClick={() => {
                  openUrl(
                    "https://github.com/xyzjesper/2FA-App?tab=GPL-3.0-1-ov-file"
                  );
                }}
              >
                App License
              </a>
            </p>
            <p>Authors: xyzjesper</p>
          </div>
          <div>
            <button onClick={() => onClsoe()}>Close Menu</button>
          </div>
        </div>
      </div>
    </>
  );
}
