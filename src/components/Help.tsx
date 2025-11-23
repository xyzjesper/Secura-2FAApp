import { useEffect, useState } from "react";
import { appVersion } from "../utils/default";
import { openUrl } from "@tauri-apps/plugin-opener";
import { ArrowLeft } from "lucide-react";

export function Help({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return;

  const [appVerion, setAppVersion] = useState<string>("??.??.??");

  useEffect(() => {
    async function fetch() {
      setAppVersion(await appVersion());
    }

    fetch();
  });

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-background backdrop-blur-sm z-101">
        <div className="w-72 h-56 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <div>
            <h1 className="flex items-center justify-center text-2xl text-pink-500 font-extrabold">
              Secura
            </h1>
            <div>
              <div className="flex flex-col">
                <div className="relative overflow-hidden rounded-lg">
                  <table className="table-fixed w-full text-left">
                    <tbody>
                      <tr className=" py-0">
                        <td className=" py-0 p-4 font-extrabold">Version</td>
                        <td className=" py-0    p-4">
                          <a
                            className="underline hover:text-pink-600 cursor-pointer"
                            onClick={() =>
                              openUrl(
                                "https://doc.xyzhub.link/s/secura-2faapp/doc/changelogs-mrcNhj45is"
                              )
                            }
                          >
                            {appVerion}
                          </a>
                        </td>
                      </tr>
                      <tr className=" py-0">
                        <td className=" py-0 p-4 font-extrabold">Authors</td>
                        <td className=" py-0    p-4">xyzjesper</td>
                      </tr>
                      <tr className=" py-0">
                        <td className=" py-0 p-4 font-extrabold">
                          Informations
                        </td>
                        <td className=" py-0    p-4">
                          {" "}
                          <a
                            className="underline hover:text-pink-600 cursor-pointer"
                            onClick={() =>
                              openUrl("https://doc.xyzhub.link/s/secura-2faapp")
                            }
                          >
                            Read More
                          </a>
                        </td>
                      </tr>
                      <tr className=" py-0">
                        <td className=" py-0 p-4 font-extrabold">Docs</td>
                        <td className=" py-0    p-4">
                          {" "}
                          <a
                            className="underline hover:text-pink-600 cursor-pointer"
                            onClick={() =>
                              openUrl(
                                "https://doc.xyzhub.link/s/secura-2faapp/doc/docs-0Da46gRERF"
                              )
                            }
                          >
                            xyzDoc
                          </a>
                        </td>
                      </tr>
                      <tr className=" py-0">
                        <td className=" py-0 p-4 font-extrabold">License</td>
                        <td className=" py-0    p-4">
                          {" "}
                          <a
                            className="underline hover:text-pink-600 cursor-pointer"
                            onClick={() =>
                              openUrl(
                                "https://github.com/xyzjesper/Secura-2FAApp?tab=GPL-3.0-1-ov-file"
                              )
                            }
                          >
                            GitHub
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <span className="flex text-xs mt-2 items-center justify-center cursor-pointer">
                    <a
                      onClick={() => openUrl("https://xy-z.org")}
                      className="underline hover:text-pink-600"
                    >
                      (c) 2025 xy-z.org
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <button
          onClick={() => onClose()}
          className="inline-flex bottom-0 absolute mb-28 cursor-pointer"
        >
          <ArrowLeft className="mr-2"> </ArrowLeft> <span>Go Back</span>
        </button>
      </div>
    </>
  );
}
