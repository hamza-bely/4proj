import './App.css'
import {ToastContainer} from "react-toastify";
import {BrowserRouter} from "react-router-dom";
import Header from "./components/header/header.tsx";
import {StrictMode} from "react";
import AppRoutes from "./routes/routes.tsx";
import "./assets/i18/i18n.tsx";

function App() {

  return (
    <>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"

        />
        <StrictMode>
            <BrowserRouter>
                <Header />
                <AppRoutes />
            </BrowserRouter>
        </StrictMode>
    </>
  )
}

export default App
