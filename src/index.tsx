/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
// import * as serviceWorker from './serviceWorker'
import { createBrowserHistory, History } from "history";
import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { Store } from "redux";
import App from "./app";
import "./css/import.css.js";
import "./css/index.css";
import HomeLayout from "./layout/home";
import "./scss/index.scss";
import configureStore, { IApplicationState } from "./store";

// <!-- in index.html, or however you manage your CSS files -->
// <link href="path/to/node_modules/normalize.css/normalize.css" rel="stylesheet" />
// <!-- blueprint-icons.css file must be included alongside blueprint.css! -->
// <link href="path/to/node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css" rel="stylesheet" />
// <link href="path/to/node_modules/@blueprintjs/core/lib/css/blueprint.css" rel="stylesheet" />
// <!-- add other blueprint-*.css files here -->

// Separate props from state and props from dispatch to their own interfaces.
// interface PropsFromState {
//     enableDarkTheme: boolean
// }

// interface PropsFromDispatch {
//     [key: string]: any
// }

// // Any additional component props go here.
// interface OwnProps {
//     store: Store<IApplicationState>
//     history: History
// }

// // Create an intersection type of the component props and our Redux props.
// type AllProps = PropsFromState & PropsFromDispatch & OwnProps

// class App extends React.Component {
//     render() {
//         return (
//             <HomeLayout appState={store.getState()}/>
//         );
//     }
// }

// ReactDOM.render(<App/>, document.getElementById('root'));

// const render = () => {
//     fancyLog();
//     return ReactDOM.render((<App />), document.getElementById("root"));
// };

// render();
// store.subscribe(render);

// We use hash history because this example is going to be hosted statically.
// Normally you would use browser history.
const history = createBrowserHistory();

const initialState: any = undefined;
const store = configureStore(history, initialState);

const render = () => {
    fancyLog();
    return ReactDOM.render(
        <CookiesProvider>
            <App store={store} history={history} />
        </CookiesProvider>,
        document.getElementById("root"),
    );
};

render();
store.subscribe(render);

function fancyLog() {
    console.log("%c Rendered with 👉 👉👇", "background: purple; color: #FFF");
    console.log(store.getState());
}

// // If you want your app to work offline and load faster, you can change
// // unregister() to register() below. Note this comes with some pitfalls.
// // Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister()
