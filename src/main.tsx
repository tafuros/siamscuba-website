import "./index.css";
import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import { reportWebVitals } from "./utils/webVitals";
import { registerServiceWorker } from "./utils/registerSW";

export const createRoot = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) {
    reportWebVitals();
    registerServiceWorker();
  }
});
