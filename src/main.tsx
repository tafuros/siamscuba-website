import "./index.css";
import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./routes";
import { reportWebVitals } from "./utils/webVitals";

export const createRoot = ViteReactSSG({ routes }, ({ isClient }) => {
  if (isClient) reportWebVitals();
});
