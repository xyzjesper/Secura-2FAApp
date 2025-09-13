export function QRCodeDisplay({
  base64,
  onClose,
  isOpen,
}: {
  isOpen: boolean;
  onClose: () => void;
  base64?: string;
}) {
  if (!isOpen) return;

  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-70">
        <div className="w-72 bg-zinc-900/90 border border-zinc-700 rounded-2xl shadow-2xl p-6 flex flex-col items-center gap-5">
          <img
            width={1000}
            height={1000}
            className="size-52"
            src={`data:image/png;base64,${base64}`}
          ></img>
          <button
            onClick={() => {
              onClose();
            }}
            className="rounded-full hover:bg-zinc-800 transition inline-flex"
          >
            Close QR Code
          </button>
        </div>
      </div>
    </>
  );
}
