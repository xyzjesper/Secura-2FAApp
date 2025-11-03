import {FolderOpen} from "lucide-react";
import {AppData} from "../../types/default";
import {importApp} from "../../utils/default";
import {toast} from "react-toastify";
import {open} from "@tauri-apps/plugin-dialog";
import {useState} from "react";

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

        if (!file?.name.endsWith(".secura")) {
            toast("File has not .secura extension.", {type: "error"})
        }

        const str = new TextDecoder("utf-8");
        const arrayBuffer = await file?.arrayBuffer();
        const base64String = str.decode(arrayBuffer);
        const string = atob(base64String);
        const json = JSON.parse(string) as AppData;
        const callback = await importApp(json);

        if (callback.code == 500 || callback.code == 404)
            return toast("Error occoured while importing the accounts", {
                type: "error",
            });
        else if (callback.code == 200) {
            onClsoe();

            toast("Successfully added all Accounts", {type: "success"});
            return window.location.reload();
        }
    };

    return (
        <>
            <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-100">
                <div
                    className="w-72 bg-zinc-900/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">

                    <div className="border-2 h-auto w-60 p-6 rounded-2xl cursor-pointer">
                        <div className={"flex justify-center items-center border-2 p-2 rounded-2xl cursor-pointer"}>
                            <label htmlFor="fileimport" className="text-xs cursor-pointer">
                                {file ? file.name : "Import a Secura TXT"}
                            </label>
                            <input
                                hidden
                                onChange={(e) => {
                                    if (!e.target.files) return;
                                    for (const file of e.target.files) {
                                        setFile(file);
                                    }
                                }}
                                accept={".secura,text/*"}
                                id="fileimport"
                                name="fileimport"
                                type="file"
                                className="w-full h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className={"flex justify-center items-center mb-3"}>
                            <button
                                onClick={() => {
                                    handleFileImport();
                                }}
                                className="inline-flex mt-2 justify-center items-center"
                            >
                                <FolderOpen className="mr-2 flex justify-center items-center"></FolderOpen>
                                <span className="flex justify-center items-center">
                Click to Import
              </span>
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
