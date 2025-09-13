export function Loading() {
  return (
    <div
      role="status"
      className="flex justify-center items-center w-full h-full absolute"
    >
      <div className="">
        <img
          width={150}
          height={150}
          className="rounded-2xl"
          src="https://cdn.xyzhub.link/u/yA8A7H.png"
        ></img>
      </div>
    </div>
  );
}
