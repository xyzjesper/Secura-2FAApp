"use client";
import { useState, useEffect, useRef } from "react";
import {
  Copy,
  Plus,
  RefreshCcw,
  Search,
  Settings,
  SkipForward,
} from "lucide-react";
import { generateToTp, getAccounts } from "./utils/totp.ts";
import { ToTpAccount } from "./types/totp.ts";
import { ToTpModal } from "./components/ToTp/ToTpModal.tsx";
import { stringToIcon } from "@iconify/utils";
import { ToTpCreate } from "./components/ToTp/ToTpCreate.tsx";
import { Loading } from "./components/Loading.tsx";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import { SettingsModal } from "./components/Settings/Settings.tsx";

export default function AuthenticatorApp() {
  const [accounts, setAccounts] = useState<ToTpAccount[]>([]);
  const [search, setSearch] = useState<string>();
  const [loading, setLoading] = useState<boolean>(true);
  const [timer, setTimer] = useState<number>(30);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [openToTpModal, setOpenToTpModal] = useState<ToTpAccount | null>(null);
  const [openCreateToTpModal, setOpenCreateToTpModal] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev === 1 ? 30 : prev - 1));
      if (timer === 1) {
        get();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (loading) {
    get();
    return <Loading />;
  }

  async function get() {
    const data = (await getAccounts()) as ToTpAccount[];
    const totTpAccounts = await Promise.all(
      data.map(async (d) => {
        const code = await generateToTp(d.OtpAuthUrl);
        return {
          Id: d.Id,
          Name: d.Name,
          Code: code.success ? code.token : 0,
          NextCode: code.nextToken,
          Icon: d.Icon ?? null,
          OtpAuthUrl: d.OtpAuthUrl,
        };
      }) as unknown as ToTpAccount[]
    );

    setLoading(false);
    setAccounts(totTpAccounts);
  }

  function handleMouseDown(account: ToTpAccount) {
    timerRef.current = setTimeout(() => {
      copyCode(2, account);
    }, 600);
  }

  const copyCode = (codeType: number, account: ToTpAccount) => {
    if (codeType == 1) {
      navigator.clipboard.writeText(String(account.Code));
      toast("Copied to Clippboard", { type: "success" });
      return;
    } else {
      navigator.clipboard.writeText(String(account.NextCode));
      toast('Copied "next code" to Clippboard', { type: "success" });
      return;
    }
  };

  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
    return;
  };
  const handleRefresh = async () => {
    setAccounts([]);
    await get();
  };

  return (
    <>
      <ToastContainer
        stacked
        theme="dark"
        hideProgressBar
        autoClose={1}
        closeOnClick
        className={"bg-gradient-to-br from-zinc-900 to-black"}
        position="bottom-center"
      ></ToastContainer>
      <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black flex flex-col items-center py-10 text-white">
        {openCreateToTpModal && (
          <ToTpCreate
            accountsCallback={(a) => setAccounts(a)}
            isOpen={(e) => setOpenCreateToTpModal(e)}
          />
        )}

        {openToTpModal && (
          <ToTpModal
            isOpen={() => setOpenToTpModal(null)}
            toTpAccount={openToTpModal}
          />
        )}

        <div className="border-2 rounded-2xl inline-flex justify-center items-center p-2 w-auto h-10">
          <Search className="size-5 mr-4"></Search>
          <input
            className="border-0 border-transparent bg-transparent"
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
        </div>
        <div className="w-full max-w-md flex flex-col gap-6 p-4">
          {accounts ? (
            accounts
              .filter((s) =>
                search ? s.Name.toLowerCase().includes(search.toLowerCase()) : s
              )
              .map((a, idx) => (
                <motion.div
                  key={a.Id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="relative rounded-2xl p-5 bg-zinc-800/80 backdrop-blur-md shadow-lg border border-zinc-700 hover:border-zinc-500 transition cursor-pointer"
                  onMouseDown={() => handleMouseDown(a)}
                  onMouseUp={handleMouseUp}
                  onTouchStart={() => handleMouseDown(a)}
                  onTouchEnd={handleMouseUp}
                >
                  <div className="flex items-center gap-4">
                    <img
                      width={48}
                      height={48}
                      className="rounded-full bg-zinc-700 p-2"
                      src={`https://api.iconify.design/${
                        stringToIcon(a.Icon ?? "ic:baseline-fingerprint")
                          ?.prefix
                      }/${
                        stringToIcon(a.Icon ?? "ic:baseline-fingerprint")?.name
                      }.svg?color=white`}
                    />

                    <div className="">
                      <Settings
                        onClick={() => {
                          setOpenToTpModal(a);
                          return;
                        }}
                        className="absolute flex justify-center items-center right-4"
                      ></Settings>
                      <p className="text-lg font-semibold">
                        {a.Name.slice(0, 20)}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-2xl font-bold tracking-wider flex justify-center items-center"
                          onClick={() => {
                            copyCode(1, a);
                          }}
                        >
                          <Copy
                            size={18}
                            className="opacity-70 ml-1 mr-3 flex justify-center items-center"
                          />
                          <p className="flex justify-center items-center">
                            {a.Code}
                          </p>
                        </span>{" "}
                        <span
                          className="absolute right-3 top-16 text-xs font-bold tracking-wider flex zzjustify-center items-center text-zinc-600"
                          onClick={() => {
                            copyCode(2, a);
                          }}
                        >
                          <SkipForward
                            size={15}
                            className="opacity-70 ml-1 mr-1 flex justify-center items-center"
                          ></SkipForward>
                          <p className="flex justify-center items-center">
                            {a.NextCode}
                          </p>
                        </span>{" "}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-1.5 bg-blue-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${((30 - timer) / 30) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </motion.div>
              ))
          ) : (
            <>No Accounts found!</>
          )}
        </div>

        <div className="fixed bottom-0 w-full bg-zinc-900/90 border-t border-zinc-700 py-4 flex justify-center gap-6 shadow-2xl">
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition"
          >
            <Settings />
          </button>

          <SettingsModal
            isOpen={settingsOpen}
            onClsoe={() => setSettingsOpen(false)}
          />

          <button
            onClick={() => setOpenCreateToTpModal(true)}
            className="p-4 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg transition"
          >
            <Plus />
          </button>
          <button
            onClick={handleRefresh}
            className="p-4 rounded-full bg-zinc-700 hover:bg-zinc-600 shadow-lg transition"
          >
            <RefreshCcw />
          </button>
        </div>
      </div>
    </>
  );
}
