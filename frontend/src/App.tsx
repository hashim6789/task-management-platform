import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Provider } from "react-redux";
import { store } from "./store";
import { Toaster } from "sonner";

export default function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}
