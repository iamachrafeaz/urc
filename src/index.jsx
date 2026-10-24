import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import router from './router';
import reportWebVitals from './reportWebVitals';
import {RouterProvider} from "react-router-dom";
import {Provider} from "./components/ui/provider";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Provider>
            <RouterProvider router={router}/>
        </Provider>
    </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);