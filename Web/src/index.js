import "./main/index.css";

import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import App from "./main/App";
import Offline from "./components/Offline";
import { PersistGate } from "redux-persist/integration/react";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import persistStore from "redux-persist/es/persistStore";
import reportWebVitals from "./main/reportWebVitals";
import setupStore from "./redux/store";

const store = setupStore();
let persistor = persistStore(store);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ReduxProvider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Offline>
					<App />
				</Offline>
			</PersistGate>
		</ReduxProvider>
	</React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
