import { createRoot } from "react-dom/client";
import { setBaseUrl, setAuthTokenGetter } from "@workspace/api-client-react";
import { API_BASE_URL } from "@/lib/api";
import App from "./App";
import "./index.css";

// Remove the /api suffix because Orval's generated routes already include /api
const backendUrl = API_BASE_URL.replace(/\/api$/, "");
setBaseUrl(backendUrl);

setAuthTokenGetter(() => localStorage.getItem("second_life_token"));

createRoot(document.getElementById("root")!).render(<App />);
