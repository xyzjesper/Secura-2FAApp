import { Edit, Trash, Upload, X } from "lucide-react";
import { ToTpAccount } from "../../types/totp";
import { useState } from "react";
import { ToTpDelete } from "./ToTpDelete";
import { ToTpUpdate } from "./ToTpEdit";
import { stringToIcon } from "@iconify/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ToTpExport } from "./ToTpExport";
import { toast } from "react-toastify";

export function ToTpModal({
  toTpAccount,
  isOpen,
}: {
  toTpAccount?: ToTpAccount;
  isOpen: (bool: boolean) => void;
}) {
  const [deleteToTp, setDeleteToTp] = useState<ToTpAccount | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [updateToTp, setUpdateToTp] = useState<ToTpAccount | null>(null);

  return (
    <>
      {deleteToTp && (
        <ToTpDelete
          isDeleted={(e) => {
            if (e) isOpen(false);
          }}
          isOpen={(e) => {
            if (e) setDeleteToTp(toTpAccount!);
            else setDeleteToTp(null);
          }}
          toTpAccount={deleteToTp}
        />
      )}

      {updateToTp && (
        <ToTpUpdate
          isUpdated={(e) => {
            if (e) isOpen(false);
          }}
          isOpen={(e) => {
            if (e) setUpdateToTp(toTpAccount!);
            else setUpdateToTp(null);
          }}
          toTpAccount={updateToTp}
        />
      )}

      <AnimatePresence>
        {toTpAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => isOpen(false)}
            className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-10"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-82 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5"
            >
              <button
                onClick={() => {
                  setIsExportOpen(true);
                }}
                className="absolute top-3 left-3 p-1 rounded-full hover:bg-zinc-800 transition cursor-pointer"
              >
                <Upload className="text-zinc-400 hover:text-white" />
              </button>
              <ToTpExport
                onClose={() => setIsExportOpen(false)}
                isOpen={isExportOpen}
                toTpAccount={toTpAccount}
              ></ToTpExport>
              <button
                onClick={() => isOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-zinc-800 transition cursor-pointer"
              >
                <X className="text-zinc-400 hover:text-white" />
              </button>

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

              <div
                className="flex flex-col items-center gap-1 bg-secondary/30 rounded-lg p-3 w-full cursor-pointer hover:border-2 transition border-zinc-200/60 hover:bg-secondary/10 transition"
                onClick={async () => {
                  toast("Successfully copied to clipboard.");
                  await navigator.clipboard.writeText(
                    String(toTpAccount?.Code)
                  );
                }}
              >
                <p className="text-xs text-zinc-400 font-medium">Code</p>
                <p className="text-xl font-mono tracking-wider text-blue-400">
                  {toTpAccount?.Code ?? "---"}
                </p>
              </div>

              <div className="flex justify-center gap-6 mt-2">
                <button
                  onClick={() => setDeleteToTp(toTpAccount!)}
                  className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition shadow-md cursor-pointer"
                >
                  <Trash className="text-white" />
                </button>
                <button
                  onClick={() => setUpdateToTp(toTpAccount!)}
                  className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 transition shadow-md cursor-pointer"
                >
                  <Edit className="text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
