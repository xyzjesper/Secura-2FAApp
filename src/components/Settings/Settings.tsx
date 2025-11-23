import { useState } from "react";
import { HelpCircle, Import, RotateCcw, Upload, X } from "lucide-react";
import { ExportModal } from "./Export";
import { ResetModal } from "./Reset";
import { ImportModal } from "./Import";
import { Help } from "../Help";

export function SettingsModal({
  accountSecret,
  isOpen,
  onClose,
}: {
  accountSecret: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return;
  const [exportOpen, setExportOpen] = useState<boolean>(false);
  const [resetOpen, setResetOpen] = useState<boolean>(false);
  const [importOpen, setImportOpen] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-70">
      <div className="w-72 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
        <div className="inline-flex ml-2 mr-2">
          <div>
            <button
              onClick={() => setExportOpen(true)}
              className="inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
            >
              <Upload className="ml-2 mr-2"></Upload> Export
            </button>
            <ExportModal
              accountSecret={accountSecret}
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
            accountSecret={accountSecret}
            isOpen={importOpen}
            onClsoe={() => setImportOpen(false)}
          ></ImportModal>
        </div>
        <hr className="w-full border-zinc-700 my-1" />
        <div>
          <button
            onClick={() => setHelpOpen(true)}
            className="inline-flex justify-center items-center border-2 rounded-2xl m-1 p-2 hover:cursor-pointer"
          >
            <HelpCircle className="ml-2 mr-2"></HelpCircle> Informations & Help
          </button>
          <Help isOpen={helpOpen} onClose={() => setHelpOpen(false)}></Help>
        </div>
        <div>
          <button
            onClick={() => onClose()}
            className="inline-flex cursor-pointer"
          >
            <X></X>
            <span>Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
