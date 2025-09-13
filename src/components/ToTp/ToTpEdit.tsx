import { Check, X } from "lucide-react";
import { ToTpAccount } from "../../types/totp";
import { useState } from "react";
import { upateToTp } from "../../utils/totp";
import { stringToIcon } from "@iconify/utils";
import { motion, AnimatePresence } from "framer-motion";

export function ToTpUpdate({
  toTpAccount,
  isOpen,
  isUpdated,
}: {
  toTpAccount: ToTpAccount;
  isOpen: (bool: boolean) => void;
  isUpdated: (bool: boolean) => void;
}) {
  const [update, setUpdate] = useState<ToTpAccount>(toTpAccount);
  const [icons, setIcons] = useState<string[]>([]);
  const [statusMsg, setStatusMsg] = useState<string>("Awaiting update...");

  async function fetchIcons(prefix: string) {
    try {
      const data = await fetch(
        `https://api.iconify.design/search?query=${prefix}&pretty=1`
      );
      const json = (await data.json()).icons as string[];
      setIcons(json);
    } catch {
      setIcons([]);
    }
  }

  const handleValueChange = (text: string, type: number) => {
    setUpdate((prev) => ({
      ...prev,
      ...(type === 1 ? { Name: text } : { Icon: text }),
    }));
  };

  const handleUpdate = async () => {
    const req = await upateToTp(toTpAccount.Id, update?.Name, update?.Icon);
    if (req) {
      isUpdated(true);
      setStatusMsg("Successfully updated your account.");
    } else {
      setStatusMsg("An error occurred while updating!");
    }
    setTimeout(() => {
      isOpen(false);
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50"
        onClick={() => isOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-96 bg-zinc-900/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5"
        >
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
            <input
              type="text"
              className="w-full h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={toTpAccount.Name}
              onChange={(e) => handleValueChange(e.target.value, 1)}
            />
            <input
              list="icons"
              className="w-full h-12 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Icon search..."
              onChange={(e) => {
                handleValueChange(e.target.value, 2);
                fetchIcons(e.target.value);
              }}
            />
            <datalist id="icons">
              {icons.map((i) => (
                <option key={i} value={i}>
                  {i[0].toUpperCase() +
                    i.slice(1).replace(":", " ").replace("-", " ")}
                </option>
              ))}
            </datalist>

            <p className="text-sm text-zinc-400 text-center">{statusMsg}</p>

            <div className="flex gap-6 mt-2">
              <button
                type="button"
                onClick={handleUpdate}
                className="p-3 rounded-full bg-green-600 hover:bg-green-700 transition shadow-md"
              >
                <Check className="text-white w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  isOpen(false);
                  isUpdated(false);
                }}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition shadow-md"
              >
                <X className="text-white w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
