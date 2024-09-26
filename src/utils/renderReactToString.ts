import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";

export async function renderReactToString(node: React.ReactNode): Promise<string> {
    // Promise.resolve() is used to ensure that flushSync() is not called from inside a React lifecycle method.
    return await Promise.resolve().then(() => {
        const container = document.createElement("div");
        const root = createRoot(container);
        flushSync(() => {
            root.render(node);
        });
        return container.innerHTML;
    });
}
