"use client"
import {useState, useEffect} from "react";
import "./App.css"
import {Plus, RefreshCcw} from "lucide-react";
import {addAccount, getAccounts} from "./utils/totp.ts";


export default function AuthenticatorApp() {
    const [accounts, setAccounts] = useState();
    const [error, setError] = useState<string>("No Error")

    useEffect(() => {
        async function fetch() {
            const data = await getAccounts() as any[]
            setAccounts(data.map((d) => {
                return {
                    Id: d.Id,
                    Name: d.Name,
                    Icon: d.Icon ?? null,
                    OtpAuthUrl: d.OtpAuthUrl
                }
            }) as any)
        }

        fetch()
    });

    async function create() {
        const data = await addAccount() as any
        setAccounts(data.length)
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center py-10">
            <h1 className="text-3xl font-bold text-white mb-6">Secura</h1>
            Error: {error}
            <div classame="w-full max-w-md flex flex-col gap-4">
                <div className="w-full max-w-md flex flex-col gap-4">
                    {accounts.map((a) => {
                        return (<div>
                            <p>{a.Name}</p>
                            <p>{a.Icon}</p>
                            <p>{a.OtpAuthUrl}</p>
                        </div>)
                    })
                    }
                </div>
            </div>
            <div>
                <button onClick={() => create()} className={"flex ring-0"}>
                    <Plus></Plus>
                </button>
                <button onClick={() => getAccounts()} className={"flex ring-0"}>
                    <RefreshCcw></RefreshCcw>
                </button>
            </div>
        </div>
    );
}
