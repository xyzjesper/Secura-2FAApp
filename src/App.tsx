"use client";
import {useState, useEffect} from "react";
import {
    Copy,
    Plus,
    Search,
    Settings,
    SkipForward,
} from "lucide-react";
import {generateToTp, getAccounts} from "./utils/totp.ts";
import {ToTpAccount} from "./types/totp.ts";
import {ToTpModal} from "./components/ToTp/ToTpModal.tsx";
import {stringToIcon} from "@iconify/utils";
import {Loading} from "./components/Loading.tsx";
import {motion} from "framer-motion";
import {toast, ToastContainer} from "react-toastify";
import {Footer} from "./components/Footer.tsx";

export function AuthenticatorApp() {
    const [accounts, setAccounts] = useState<ToTpAccount[]>([]);
    const [search, setSearch] = useState<string>();
    const [loading, setLoading] = useState<boolean>(true);
    const [timer, setTimer] = useState<number>(30);
    const [openToTpModal, setOpenToTpModal] = useState<ToTpAccount | null>(null);
    const [error, setError] = useState<string>("Loading Secura");
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev === 1 ? 30 : prev - 1));
            if (timer === 1) {
                get()
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    if (loading) {
        get();
        return <Loading
            error={error}
        />;
    }

    async function get() {
        const data = await getAccounts();

        if (data.success == false) {
            setError(data.message);
            setLoading(false);
        } else {
            const totTpAccounts = await Promise.all(
                data.data.map(async (d) => {
                    const code = await generateToTp(d.OtpAuthUrl);
                    return {
                        Id: d.Id,
                        Name: d.Name,
                        Code: code.success ? code.token : 0,
                        NextCode: code.nexttoken,
                        Icon: d.Icon ?? null,
                        OtpAuthUrl: d.OtpAuthUrl,
                    };
                }) as unknown as ToTpAccount[]
            );

            setLoading(false);
            setAccounts(totTpAccounts);
        }
    }

    const copyCode = async (codeType: number, account: ToTpAccount) => {
        if (codeType == 1) {
            await navigator.clipboard.writeText(String(account.Code));
            toast("Copied to Clippboard", {type: "success"});
            return;
        } else {
            await navigator.clipboard.writeText(String(account.NextCode));
            toast('Copied "next code" to Clippboard', {type: "success"});
            return;
        }
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
            <div
                className="min-h-screen bg-background flex flex-col items-center py-10 text-white mb-10">

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
                    {accounts.length >= 1 ? (
                        accounts
                            .filter((s) =>
                                search ? s.Name.toLowerCase().includes(search.toLowerCase()) : s
                            )
                            .map((a, idx) => (
                                <motion.div
                                    key={a.Id}
                                    initial={{opacity: 0, y: 15}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{delay: idx * 0.05}}
                                    className="relative rounded-2xl bg-card text-card-foreground p-5 backdrop-blur-md shadow-lg border border-zinc-700 hover:border-zinc-500 transition cursor-pointer"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            width={48}
                                            height={48}
                                            className="rounded-full p-2"
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
                        </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 h-1.5 w-full bg-zinc-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-1.5 bg-blue-500 rounded-full"
                                            initial={{width: "0%"}}
                                            animate={{width: `${((30 - timer) / 30) * 100}%`}}
                                            transition={{duration: 1}}
                                        />
                                    </div>
                                </motion.div>
                            ))
                    ) : (
                        <div>
              <span className={"flex items-center justify-center"}>
                You haven't created any accounts yet!
              </span>
                            <span className={"flex items-center justify-center"}>
                Use the{" "}
                                <Plus className={"mr-1 ml-1 size-6"} color={"#808080"}/> symbol
                to create your first account.
              </span>
                        </div>
                    )}
                </div>
                <Footer
                    handleRefresh={(accounts) => {
                        setAccounts(accounts ?? [])
                        get()
                    }}
                />
            </div>
        </>
    );
}
