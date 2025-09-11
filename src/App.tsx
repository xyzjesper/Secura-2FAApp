"use client";
import { useState, useEffect, useRef } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { addAccount, generateToTp, getAccounts } from "./utils/totp.ts";
import { ToTpAccount } from "./types/totp.ts";
import { ToTpModal } from "./components/ToTp/ToTpModal.tsx";
import { stringToIcon } from "@iconify/utils";

export default function AuthenticatorApp() {
  const [accounts, setAccounts] = useState<ToTpAccount[]>([]);
  const [timer, setTimer] = useState<number>(30);
  const [openToTpModal, setOpenToTpModal] = useState<ToTpAccount | null>(null);
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

  async function get() {
    const data = (await getAccounts()) as ToTpAccount[];

    const totTpAccounts = await Promise.all(
      data.map(async (d) => {
        const code = await generateToTp(d.OtpAuthUrl);
        return {
          Id: d.Id,
          Name: d.Name,
          Code: code.success ? code.token : 0,
          Icon: d.Icon ?? null,
          OtpAuthUrl: d.OtpAuthUrl,
        };
      }) as unknown as ToTpAccount[]
    );

    setAccounts(totTpAccounts);
  }

  async function create() {
    const data = await addAccount();
    const totTpAccounts = await Promise.all(
      data.map(async (d) => {
        const code = await generateToTp(d.OtpAuthUrl);
        return {
          Id: d.Id,
          Name: d.Name,
          Code: code.success ? code.token : 0,
          Icon: d.Icon ?? null,
          OtpAuthUrl: d.OtpAuthUrl,
        };
      }) as unknown as ToTpAccount[]
    );

    setAccounts(totTpAccounts);
  }

  function handleMouseDown(account: ToTpAccount) {
    timerRef.current = setTimeout(() => {
      setOpenToTpModal(account);
    }, 1000);
  }

  const handleMouseUp = () => {
    clearTimeout(timerRef.current);
  };

  const handleRefresh = async () => {
    setAccounts([]);
    await get();
  };

  return (
    <div className="min-h-screen bg-black/40 flex flex-col items-center py-10">
      <div>
        {openToTpModal && (
          <ToTpModal
            isOpen={() => {
              setOpenToTpModal(null);
            }}
            toTpAccount={openToTpModal}
          ></ToTpModal>
        )}
      </div>

      <div className="w-full max-w-md flex flex-col gap-4 bg-zinc-800/90">
        <div className="w-full max-w-md flex flex-col gap-4 p-6">
          {accounts &&
            accounts.map((a) => {
              return (
                <div
                  className={
                    "border-2 rounded-2xl p-4 w-full flex items-center"
                  }
                  onClick={() => {
                    navigator.clipboard.writeText(String(a.Code));
                  }}
                  onMouseDown={() => {
                    handleMouseDown(a);
                  }}
                  onMouseUp={handleMouseUp}
                  onTouchStart={() => {
                    handleMouseDown(a);
                  }}
                  onTouchEnd={handleMouseUp}
                >
                  <div className="mr-3">
                    <img
                      width={40}
                      height={40}
                      className="w-[40px] h-[40px]"
                      src={`https://api.iconify.design/${
                        stringToIcon(a.Icon ?? "ic:baseline-fingerprint")
                          ?.prefix
                      }/${
                        stringToIcon(a.Icon ?? "ic:baseline-fingerprint")?.name
                      }.svg?color=white`}
                    />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold select-none">
                      {a.Name}
                    </p>
                  </div>
                  <div className="flex flex-col items-center mx-auto w-fit text-center">
                    <div className="border-2 border-zinc-400 rounded-2xl px-4 py-2 select-none">
                      {a.Code}
                    </div>
                    <div className="w-10 mt-3 bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                      <div
                        className="bg-gray-600 h-1 rounded-full dark:bg-gray-300"
                        style={{ width: `${((30 - timer) / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div>
        <div className="fixed bottom-4 right-4">
          <button
            onClick={() => create()}
            className="border-2 rounded-2xl border-white bg-blue-600 text-white p-3 shadow-lg hover:bg-blue-700 transition"
          >
            <Plus />
          </button>
          <button
            onClick={() => handleRefresh()}
            className="border-2 rounded-2xl border-white bg-blue-600 text-white p-3 shadow-lg hover:bg-blue-700 transition"
          >
            <RefreshCcw />
          </button>
        </div>
      </div>
    </div>
  );
}
