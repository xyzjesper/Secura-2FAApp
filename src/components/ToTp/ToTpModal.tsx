import { Edit, Trash } from "lucide-react";
import { ToTpAccount } from "../../types/totp";
import { useState } from "react";
import { ToTpDelete } from "./ToTpDelete";
import { ToTpUpdate } from "./ToTpEdit";
import { stringToIcon } from "@iconify/utils";

export function ToTpModal({
  toTpAccount,
  isOpen,
}: {
  toTpAccount?: ToTpAccount;
  isOpen: (bool: boolean) => void;
}) {
  const [deleteToTp, setDeleteToTp] = useState<ToTpAccount | null>();
  const [updateToTp, setUpdateToTp] = useState<ToTpAccount | null>();

  return (
    <>
      {deleteToTp && (
        <ToTpDelete
          isDeleted={(e) => {
            if (e) {
              isOpen(false);
            }
          }}
          isOpen={(e) => {
            if (e) {
              setDeleteToTp(toTpAccount);
            } else {
              setDeleteToTp(null);
            }
          }}
          toTpAccount={deleteToTp}
        ></ToTpDelete>
      )}

      {updateToTp && (
        <ToTpUpdate
          isUpdated={(e) => {
            if (e) {
              isOpen(false);
            }
          }}
          isOpen={(e) => {
            if (e) {
              setUpdateToTp(toTpAccount);
            } else {
              setUpdateToTp(null);
            }
          }}
          toTpAccount={updateToTp}
        ></ToTpUpdate>
      )}

      <div
        onClick={() => {
          isOpen(false);
        }}
      >
        <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-1">
          <div
            className="w-72 bg-zinc-800/90 border-2 border-zinc-500 rounded-2xl shadow-xl pointer-events-auto flex flex-col items-center p-6 gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-zinc-700 rounded-full flex justify-center items-center text-white text-xl font-bold">
              <img
                width={40}
                height={40}
                className="w-[40px] h-[40px]"
                src={`https://api.iconify.design/${
                  stringToIcon(toTpAccount?.Icon ?? "ic:baseline-fingerprint")
                    ?.prefix
                }/${
                  stringToIcon(toTpAccount?.Icon ?? "ic:baseline-fingerprint")
                    ?.name
                }.svg?color=white`}
              />
            </div>

            <h2 className="text-xl font-semibold text-white text-center">
              {toTpAccount?.Name ?? "Unbekannt"}
            </h2>

            <div className="flex flex-col items-center gap-1 bg-zinc-700/60 rounded-md p-3 w-full">
              <p className="text-sm text-zinc-300 font-medium">Code</p>
              <p
                className="text-white font-mono"
                onClick={() => {
                  navigator.clipboard.writeText(String(toTpAccount?.Code));
                }}
              >
                {toTpAccount?.Code ?? "---"}
              </p>
            </div>
            <div className="inline-flex items-center justify-center gap-1 bg-zinc-700/60 rounded-md p-3 w-full">
              <Trash
                onClick={() => {
                  setDeleteToTp(toTpAccount);
                }}
                className="size-15"
              ></Trash>
              <Edit
                onClick={() => {
                  setUpdateToTp(toTpAccount);
                }}
                className="size-15"
              ></Edit>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
