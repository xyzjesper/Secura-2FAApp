import { Check, X } from "lucide-react";
import { ToTpAccount } from "../../types/totp";
import { useState } from "react";
import { deleteToTp } from "../../utils/totp";
import { stringToIcon } from "@iconify/utils";

export function ToTpDelete({
  toTpAccount,
  isOpen,
  isDeleted,
}: {
  toTpAccount: ToTpAccount;
  isOpen: (bool: boolean) => void;
  isDeleted: (bool: boolean) => void;
}) {
  const [successDisplay, setSuccessDisplay] = useState<string>(
    "Awating Deletion..."
  );

  const handleDelete = async () => {
    const req = await deleteToTp(toTpAccount.Id);
    if (req) {
      isDeleted(true);
      setSuccessDisplay("Successfully Deleted your account.");
    } else {
      setSuccessDisplay("An Error occurred while deletion!");
    }
    setTimeout(() => {
      isOpen(false);
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-2">
        <div className="w-72 bg-zinc-800/90 border-2 border-zinc-500 rounded-2xl shadow-xl pointer-events-auto flex flex-col items-center p-6 gap-4">
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
            <div>
              <p className="items-center justify-center flex">
                Confirm the deletion of: {toTpAccount.Name}
              </p>
              <hr className="justify-center items-center flex rounded-b-full mt-5 mb-3"></hr>
              <div className="justify-center items-center flex text-stone-500 font-bold text-xs">
                <p>{successDisplay}</p>
              </div>
              <div className="flex items-center justify-center">
                <Check className="size-15" onClick={handleDelete}></Check>{" "}
                <X
                  className="size-15"
                  onClick={() => {
                    isOpen(false);
                    isDeleted(false);
                  }}
                ></X>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
