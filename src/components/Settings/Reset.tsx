import { RotateCcw } from "lucide-react";
import { resetApp } from "../../utils/default";

export function ResetModal({
  isOpen,
  onClsoe,
}: {
  isOpen: boolean;
  onClsoe: () => void;
}) {
  if (!isOpen) return;

  const handleReset = async () => {
    await resetApp();
    window.location.reload();
  };

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-background/50 backdrop-blur-sm z-100">
        <div className="w-72 bg-background/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <div>
            <button
              className="inline-flex items-center justify-center border-2 rounded-2xl p-2 cursor-pointer"
              onClick={() => {
                handleReset();
                onClsoe();
              }}
            >
              <RotateCcw className="flex items-center justify-center ml-2 mr-2"></RotateCcw>
              <p className="flex items-center justify-center">
                {" "}
                Confirm App Reset
              </p>
            </button>
          </div>
          <div>
            <button className="cursor-pointer" onClick={() => onClsoe()}>
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
