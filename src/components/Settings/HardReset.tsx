import { X } from "lucide-react";
import { hardReset } from "../../utils/default";
import { toast } from "react-toastify";

export function HardReset({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return;

  async function reset() {
    const callback = await hardReset();
    if (!callback) {
      toast("Failed to reset the App");
    } else {
      toast("App has been reset!");
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-100 overflow-hidden">
      <div className="bg-background w-full h-full flex justify-center items-center overflow-hidden">
        <div className="min-h-screen bg-background flex flex-col items-center py-10 text-white mb-40">
          <div className="flex justify-center items-center flex-col">
            <div>
              <span>
                <X
                  className="cursor-pointer text-white mt-80 border-4 rounded-2xl size-10"
                  onClick={() => onClose()}
                />
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-pink-500 mt-14">
              Secura Hard Reset
            </h1>
          </div>

          <p>Please confirm your Hard Reset!</p>
          <p>When you click Delete. You will lose all your Accounts.</p>

          <div className="p-5">
            <button
              className="border-2 p-2 rounded-2xl cursor-pointer text-red-500 font-extrabold"
              onClick={() => reset()}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
