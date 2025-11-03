import {useState} from "react";
import {Plus, RefreshCcw, Settings} from "lucide-react";
import {SettingsModal} from "./Settings/Settings.tsx";
import {ToTpCreate} from "./ToTp/ToTpCreate.tsx";
import {ToTpAccount} from "../types/totp.ts";

export function Footer(
    {handleRefresh}: { handleRefresh: (accounts?: ToTpAccount[]) => void }
) {

    const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
    const [openCreateToTpModal, setOpenCreateToTpModal] = useState(false);


    return (
        <>
            <div
                className="fixed bottom-0 bg-popover/90 w-full border-t border-zinc-700 py-4 flex justify-center gap-6 shadow-2xl">

                {/* Settings */}
                <button
                    onClick={() => setSettingsOpen(true)}
                    className="p-4 border-4 border-ring hover:border-ring/70 bg-popover rounded-full shadow-lg transition cursor-pointer"
                >
                    <Settings/>
                </button>
                <SettingsModal
                    isOpen={settingsOpen}
                    onClose={() => setSettingsOpen(false)}
                />

                {/* Create */}
                <button
                    onClick={() => setOpenCreateToTpModal(true)}
                    className="p-4 border-4 border-ring hover:border-ring/70 bg-popover rounded-full shadow-lg transition cursor-pointer"
                >
                    <Plus/>
                </button>
                <ToTpCreate
                    accountsCallback={(a) => handleRefresh(a)}
                    onClose={() => setOpenCreateToTpModal(false)}
                    isOpen={openCreateToTpModal}
                />

                {/* Refresh */}
                <button
                    onClick={() => handleRefresh()}
                    className="p-4 border-4 border-ring hover:border-ring/70 bg-popover rounded-full shadow-lg transition cursor-pointer"
                >
                    <RefreshCcw/>
                </button>
            </div>
        </>
    )
}