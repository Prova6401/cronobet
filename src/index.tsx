import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { PopupButton } from "./screens/PopupButton";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <PopupButton />
  </StrictMode>,
);
