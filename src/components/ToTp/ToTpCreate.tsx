import { Check, SwitchCamera, TextCursorInput, X } from "lucide-react";
import { useState } from "react";
import { ToTpAccount } from "../../types/totp";
import { addAccount, generateToTp } from "../../utils/totp";
import { QrCodeScanner } from "../QrCodeScaner";
import { motion, AnimatePresence } from "framer-motion";

export function ToTpCreate({
  accountSecret,
  onClose,
  isOpen,
  accountsCallback,
}: {
  accountSecret: string;
  onClose: () => void;
  isOpen: boolean;
  accountsCallback: (accounts: ToTpAccount[]) => void;
}) {
  if (!isOpen) return;

  const [account, setAccount] = useState<ToTpAccount>({
    Id: 0,
    Name: "",
    Icon: "",
    OtpAuthUrl: "",
  });

  const [toTpType, setToTpType] = useState<number>(0);
  const [icons, setIcons] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>(
    "Awaiting creation..."
  );

  const handleCreate = async () => {
    setStatusMessage("Creating account...");
    try {
      const data = await addAccount(account, accountSecret);

      if (data.success == false) {
        setStatusMessage(data.message);
      } else {
        const totpAccounts = await Promise.all(
          data.data.map(async (d) => {
            const code = await generateToTp(d.OtpAuthUrl);
            return {
              Id: d.Id,
              Name: d.Name,
              Code: code.success ? code.token : 0,
              Icon: d.Icon ?? null,
              OtpAuthUrl: d.OtpAuthUrl,
            };
          })
        );

        accountsCallback(totpAccounts as ToTpAccount[]);
        setStatusMessage("Account created successfully!");

        setTimeout(() => {
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to create account.");
    }
  };

  const handleValueChange = (text: string, type: number) => {
    setAccount((prev) => ({
      ...prev,
      ...(type === 1
        ? { Name: text }
        : type === 2
        ? { Icon: text }
        : {
            OtpAuthUrl: text,
          }),
    }));
  };

  const fetchIcons = async (prefix: string) => {
    try {
      const res = await fetch(
        `https://api.iconify.design/search?query=${prefix}&pretty=1`
      );
      const json = (await res.json()).icons as string[];
      setIcons(json);
    } catch {
      setIcons([]);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-96 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col gap-5"
        >
          <h2 className="text-xl font-semibold text-white text-center">
            Create a OTP Account
          </h2>

          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <input
              className="w-full h-12 px-3 border border-zinc-600 rounded-lg bg-chart-4/50 text-white placeholder-zinc-400 text-center"
              type="text"
              placeholder="Account Name"
              onChange={(e) => handleValueChange(e.target.value, 1)}
            />

            <div className="flex flex-col gap-2">
              <input
                list="icon-list"
                className="w-full h-12 px-3 border border-zinc-600 rounded-lg bg-chart-4/50 text-white placeholder-zinc-400 text-center"
                placeholder="Search Icon..."
                onChange={(e) => {
                  handleValueChange(e.target.value, 2);
                  fetchIcons(e.target.value);
                }}
              />
              <datalist id="icon-list">
                {icons.map((icon) => (
                  <option key={icon} value={icon}>
                    {icon[0].toUpperCase() +
                      icon.slice(1).replace(":", " ").replace("-", " ")}
                  </option>
                ))}
              </datalist>
            </div>

            {toTpType === 2 ? (
              <p className="text-green-500 flex justify-center items-center">
                Successfully scanned the QR Code
              </p>
            ) : (
              <>
                <button
                  type="button"
                  className="text-xs text-blue-400 self-center flex items-center gap-2 cursor-pointer border-4 border-chart-5 transition-colors no-underline hover:border-chart-5/50 rounded-md p-3"
                  onClick={() => setToTpType(toTpType === 1 ? 0 : 1)}
                >
                  {toTpType === 0 ? (
                    <>
                      <SwitchCamera className="w-4 h-4" /> Use QR Scanner
                    </>
                  ) : (
                    <>
                      <TextCursorInput className="w-4 h-4" /> Use Manual Input
                    </>
                  )}
                </button>
                {toTpType === 0 ? (
                  <input
                    className="w-full h-12 px-3 border border-zinc-600 rounded-lg bg-chart-4/50 text-white placeholder-zinc-400 text-center"
                    type="text"
                    placeholder="Type in the Key from your Provider"
                    onChange={(e) => handleValueChange(e.target.value, 3)}
                  />
                ) : (
                  <QrCodeScanner
                    close={() => {
                      setToTpType(2);
                    }}
                    toTpUrl={(u) => {
                      setAccount((prev) => ({
                        ...prev,
                        OtpAuthUrl: u,
                      }));
                    }}
                  />
                )}
              </>
            )}

            <hr className="w-full border-zinc-700 my-2" />

            <p className="text-center text-sm text-zinc-400 font-medium">
              {statusMessage}
            </p>

            <div className="flex justify-center gap-6 mt-2">
              <button
                type="submit"
                className="p-3 bg-green-600 hover:bg-green-700 rounded-full text-white transition shadow-md cursor-pointer"
              >
                <Check className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => onClose()}
                className="p-3 bg-red-600 hover:bg-red-700 rounded-full text-white transition shadow-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
