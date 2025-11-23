import { useState } from "react";
import { loginToApp } from "../utils/default";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { HelpCircle, LucideMessageSquareWarning } from "lucide-react";
import { HardReset } from "./Settings/HardReset";
import { Help } from "./Help";

export function Login({
  isOpen,
  onLogin,
}: {
  isOpen: boolean;
  onLogin: (code: string) => void;
}) {
  if (!isOpen) return;

  const [code, setCode] = useState<string>();
  const [hardResetOpen, setHardResetOpen] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [err, setErr] = useState<string>("Awating Login...");

  async function login() {
    if (!code) {
      setErr("Please enter your code!");
    } else {
      const login = await loginToApp(code);
      if (login && login?.success) {
        if (login.code) {
          onLogin(login.code);
        } else setErr("No Code has been found!");
      } else if (login) {
        setErr(login?.message);
      } else {
        setErr("No Login found...");
      }
    }
  }

  return (
    <div className="bg-background w-full h-full">
      <div className="min-h-screen bg-background flex flex-col items-center py-10 text-white mb-10">
        <h1 className="text-2xl font-extrabold text-pink-500 mt-28 flex flex-col items-center">
          Secura Login
        </h1>

        <div className="p-1 ">
          <p className="text-center text-sm text-zinc-400 font-medium">{err}</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            login();
          }}
          className="flex flex-col justify-center items-center"
        >
          <InputOTP
            onChange={(e) => setCode(e)}
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <div>
            <button
              type="submit"
              className="p-2 border-2 rounded-2xl mt-5 w-40 flex items-center justify-center align-middle cursor-pointer"
              onClick={login}
            >
              Login
            </button>
          </div>
        </form>
        <div className="p-5">
          <button
            onClick={() => setHardResetOpen(true)}
            className="font-semibold text-xs border-2 rounded-2xl p-2 cursor-pointer border-zinc-800"
          >
            <LucideMessageSquareWarning className="text-red-900 items-center justify-center inline-flex mr-2" />
            <p className="text-red-800"> Re-Create you Secura Account</p>
            <p className="text-red-800">for this device.</p>
          </button>
          <HardReset
            isOpen={hardResetOpen}
            onClose={() => setHardResetOpen(false)}
          ></HardReset>
        </div>
        <span className="text-white flex">
          <Help
            isOpen={helpOpen}
            onClose={() => {
              setHelpOpen(false);
            }}
          ></Help>
          <HelpCircle
            onClick={() => setHelpOpen(true)}
            className="flex size-10"
          ></HelpCircle>
        </span>
      </div>
    </div>
  );
}
