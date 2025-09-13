import { FolderOpen } from "lucide-react";
import { useState } from "react";
import { AppData } from "../../types/default";
import { importApp } from "../../utils/default";
import { toast } from "react-toastify";

export function ImportModal({
  isOpen,
  onClsoe,
}: {
  isOpen: boolean;
  onClsoe: () => void;
}) {
  if (!isOpen) return;
  const [file, setFile] = useState<File>();

  const handleFileImport = async () => {
    const fileData = await file?.text();
    const json = JSON.parse(fileData as string) as AppData;

    const callback = await importApp(json);

    if (callback == 0)
      return toast("Error occoured while importing the accounts", {
        type: "error",
      });
    else if (callback == 1) {
      onClsoe();

      toast("Successfully added all Accounts", { type: "success" });
      return window.location.reload();
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-100">
        <div className="w-72 bg-zinc-900/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <div>
            <div className="flex justify-center items-center border-2 p-2 rounded-2xl">
              <label form="fileimport" className="text-xs">
                {file ? file.name : "Click here to import a Secura txt file"}
              </label>
              <input
                hidden
                onChange={(e) => {
                  if (!e.target.files) return;
                  for (const file of e.target.files) {
                    setFile(file);
                  }
                }}
                id="fileimport"
                name="fileimport"
                type="file"
                className="w-full h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => {
                handleFileImport();
              }}
              className="inline-flex mt-2 justify-center items-center"
            >
              <FolderOpen className="mr-2 flex justify-center items-center"></FolderOpen>
              <span className="flex justify-center items-center">
                Import a Secura File
              </span>
            </button>
          </div>
          <div>
            <button onClick={() => onClsoe()}>Close Menu</button>
          </div>
        </div>
      </div>
    </>
  );
}
