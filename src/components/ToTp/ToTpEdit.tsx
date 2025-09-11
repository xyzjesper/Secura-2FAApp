import { Check, X } from "lucide-react";
import { ToTpAccount } from "../../types/totp";
import { useEffect, useState } from "react";
import { upateToTp } from "../../utils/totp";
import { stringToIcon } from "@iconify/utils";

export function ToTpUpdate({
  toTpAccount,
  isOpen,
  isUpdated,
}: {
  toTpAccount: ToTpAccount;
  isOpen: (bool: boolean) => void;
  isUpdated: (bool: boolean) => void;
}) {
  const [update, setUpdate] = useState<ToTpAccount>();
  const [icons, setIcons] = useState<string[]>([]);
  const [successDisplay, setSuccessDisplay] =
    useState<string>("Awating Update...");

  useEffect(() => {});

  async function fetchIcons(prefix: string) {
    const data = await fetch(
      `https://api.iconify.design/search?query=${prefix}&pretty=1`
    );
    const json = (await data.json()).icons as string[];

    setIcons(json);
  }

  const handleValueChange = (text: string, type: number) => {
    if (type == 1) {
      setUpdate({
        ...toTpAccount,
        Name: text,
      });
    } else if (type == 2) {
      setUpdate({
        ...toTpAccount,
        Icon: text,
      });
    }
    return text;
  };

  const handleUpdate = async () => {
    const req = await upateToTp(toTpAccount.Id, update?.Name, update?.Icon);
    if (req) {
      isUpdated(true);
      setSuccessDisplay("Successfully updated your Account.");
    } else {
      setSuccessDisplay("An error occurred while update!" + req);
    }
    setTimeout(() => {
      isOpen(false);
    }, 1000);
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-2">
        <div className="w-96 bg-zinc-800/90 border-2 border-zinc-500 rounded-2xl shadow-xl pointer-events-auto flex flex-col items-center p-6 gap-4">
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
            <div className="p-4">
              <form className="flex flex-col items-center gap-4">
                <input
                  className="w-72 h-16 border rounded text-center"
                  type="text"
                  onChange={(e) => handleValueChange(e.target.value, 1)}
                  placeholder={toTpAccount.Name}
                />
                <input
                  list="brow"
                  className="w-72 h-16 border rounded text-center"
                  onChange={(e) => {
                    handleValueChange(e.target.value, 2);
                    fetchIcons(e.target.value);
                  }}
                />
                <datalist id="brow">
                  {icons.map((i) => {
                    return (
                      <option value={i}>
                        {i[0].toUpperCase() +
                          i
                            .slice(1, i.length)
                            .replace(":", " ")
                            .replace("-", " ")}
                      </option>
                    );
                  })}
                </datalist>
                <hr className="w-full border-gray-300 rounded-full mt-5 mb-3" />
                <div className="justify-center items-center flex text-stone-500 font-bold text-xs">
                  <p>{successDisplay}</p>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="p-2 text-green-500rounded flex items-center justify-center"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      isOpen(false);
                      isUpdated(false);
                    }}
                    className="p-2 text-red-500 rounded flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
