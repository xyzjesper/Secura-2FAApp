export function Loading({error}: { error?: string }) {
    return (
        <div
            role="status"
            className="w-screen h-screen flex items-center flex-col justify-center align-middle bg-background"
        >
            <div>
                <img
                    width={150}
                    height={150}
                    className="rounded-2xl"
                    src="https://cdn.xyzhub.link/u/yA8A7H.png"
                ></img>
            </div>

            <div>
                <span>
                {error ?? ""}
            </span>
            </div>

        </div>
    );
}
