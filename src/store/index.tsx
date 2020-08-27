/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// `react-router-redux` is deprecated, so we use `connected-react-router`.
// This provides a Redux middleware which connects to our `react-router` instance.
import { connectRouter, routerMiddleware, RouterState } from "connected-react-router";
// If you use react-router, don't forget to pass in your history type.
import { History } from "history";
import {
  Action,
  AnyAction,
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Dispatch,
  Store,
} from "redux";
// We'll be using Redux Devtools. We can use the `composeWithDevTools()`
// directive so we can pass our middleware along with it
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import { all, fork } from "redux-saga/effects";
import {boardReducer} from "./board/reducer";
import boardSaga from "./board/sagas";
import { IBoardState } from "./board/types";
import {colorsReducer} from "./colors/reducer";
import { IColorsState } from "./colors/types";
import {columnsReducer} from "./columns/reducer";
import columnsSaga from "./columns/sagas";
import { IColumnsState } from "./columns/types";
import {commentsReducer} from "./comments/reducer";
import commentsSaga from "./comments/sagas";
import {ICommentsState} from "./comments/types";
import {componentsReducer} from "./components/reducer";
import {IComponentsState} from "./components/types";
import {cookiesReducer} from "./cookies/reducer";
import {ICookiesState} from "./cookies/types";
import {dialogsReducer} from "./dialogs/reducer";
import { IDialogsState } from "./dialogs/types";
import {leaveRequestsReducer} from "./leaverequests/reducer";
import leaveRequestsSaga from "./leaverequests/sagas";
import {ILeaveRequestsState} from "./leaverequests/types";
import {loginsReducer} from "./logins/reducer";
import loginsSaga from "./logins/sagas";
import { ILoginsState } from "./logins/types";
import {navbarReducer} from "./navbar/reducer";
import {INavbarState} from "./navbar/types";
import {prioritiesReducer} from "./priorities/reducer";
import prioritiesSaga from "./priorities/sagas";
import { IPrioritiesState } from "./priorities/types";
import {projectsReducer} from "./projects/reducer";
import projectsSaga from "./projects/sagas";
import {IProjectsState} from "./projects/types";
import {rolesReducer} from "./roles/reducer";
import rolesSaga from "./roles/sagas";
import { IRolesState } from "./roles/types";
import {sprintrequirementsReducer} from "./sprintrequirements/reducer";
import sprintrequirementsSaga from "./sprintrequirements/sagas";
import {ISprintRequirementsState} from "./sprintrequirements/types";
import {sprintsReducer} from "./sprints/reducer";
import sprintsSaga from "./sprints/sagas";
import { ISprintsState } from "./sprints/types";
import {taskdescriptionsReducer} from "./taskdescriptions/reducer";
import taskdescriptionsSaga from "./taskdescriptions/sagas";
import {ITaskDescriptionsState} from "./taskdescriptions/types";
import {tasksReducer} from "./tasks/reducer";
import tasksSaga from "./tasks/sagas";
import { ITasksState } from "./tasks/types";
import {teamsReducer} from "./teams/reducer";
import teamsSaga from "./teams/sagas";
import {ITeamsState} from "./teams/types";
import {unitsReducer} from "./units/reducer";
import unitsSaga from "./units/sagas";
import {IUnitsState} from "./units/types";
import {usersReducer} from "./users/reducer";
import usersSaga from "./users/sagas";
import {IUsersState} from "./users/types";

// // Now, index.js will export the combination of both reducers like this:
// // Notice that the combineReducers function takes in an object.
// // An object whose shape is exactly like the state object of the application.
// // The code block is the same as this:
// // export default combineReducers({
// //     user: user,
// //     contacts: contacts
// // })

// The top-level state object
export interface IApplicationState {
    router: RouterState;
    navbar: INavbarState;
    logins: ILoginsState;
    roles: IRolesState;
    projects: IProjectsState;
    teams: ITeamsState;
    dialogs: IDialogsState;
    tasks: ITasksState;
    columns: IColumnsState;
    priorities: IPrioritiesState;
    colors: IColorsState;
    cookies: ICookiesState;
    users: IUsersState;
    components: IComponentsState;
    board: IBoardState;
    sprints: ISprintsState;
    units: IUnitsState;
    taskdescriptions: ITaskDescriptionsState;
    comments: ICommentsState;
    sprintrequirements: ISprintRequirementsState;
    leaveRequests: ILeaveRequestsState;
}

// Additional props for connected React components. This prop is passed by default with `connect()`
export interface IConnectedReduxProps<A extends Action = AnyAction> {
    dispatch: Dispatch<A>;
}

// // // Whenever an action is dispatched, Redux will update each top-level application state property
// // // using the reducer with the matching name. It's important that the names match exactly, and that
// // // the reducer acts on the corresponding IApplicationState property type.
// // export const reducers: Reducer<IApplicationState> = combineReducers<IApplicationState>({
// //     navbar: navbarReducer,
// //     project: projectReducer,
// // });

// Whenever an action is dispatched, Redux will update each top-level application state property
// using the reducer with the matching name. It's important that the names match exactly, and that
// the reducer acts on the corresponding IApplicationState property type.
// Comment below 26/01/2020: Old way of creating root reducer without react router
// export const rootReducer = combineReducers<IApplicationState>({
//     router: connectRouter(history),
//     navbar: navbarReducer,
//     logins: loginsReducer,
//     roles: rolesReducer,
//     projects: projectsReducer,
//     teams: teamsReducer,
//     dialogs: dialogsReducer,
//     tasks: tasksReducer,
//     columns: columnsReducer,
//     priorities: prioritiesReducer,
//     colors: colorsReducer,
//     cookies: cookiesReducer,
//     users: usersReducer,
//     components: componentsReducer,
//     board: boardReducer,
//     sprints: sprintsReducer,
//     units: unitsReducer,
//     taskdescriptions: taskdescriptionsReducer,
//     comments: commentsReducer,
//     sprintrequirements: sprintrequirementsReducer,
//     leaveRequests: leaveRequestsReducer,
// });

const createRootReducer = (history) => combineReducers<IApplicationState>({
  router: connectRouter(history),
  navbar: navbarReducer,
  logins: loginsReducer,
  roles: rolesReducer,
  projects: projectsReducer,
  teams: teamsReducer,
  dialogs: dialogsReducer,
  tasks: tasksReducer,
  columns: columnsReducer,
  priorities: prioritiesReducer,
  colors: colorsReducer,
  cookies: cookiesReducer,
  users: usersReducer,
  components: componentsReducer,
  board: boardReducer,
  sprints: sprintsReducer,
  units: unitsReducer,
  taskdescriptions: taskdescriptionsReducer,
  comments: commentsReducer,
  sprintrequirements: sprintrequirementsReducer,
  leaveRequests: leaveRequestsReducer,
});

// Here we use `redux-saga` to trigger actions asynchronously. `redux-saga` uses something called a
// "generator function", which you can read about here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
export function* rootSaga() {
    yield all([
        fork(teamsSaga),
        fork(loginsSaga),
        fork(rolesSaga),
        fork(projectsSaga),
        fork(usersSaga),
        fork(boardSaga),
        fork(columnsSaga),
        fork(prioritiesSaga),
        fork(sprintsSaga),
        fork(tasksSaga),
        fork(unitsSaga),
        fork(taskdescriptionsSaga),
        fork(commentsSaga),
        fork(sprintrequirementsSaga),
        fork(leaveRequestsSaga),
    ]);
}

export default function configureStore(
  history: History,
  initialState: IApplicationState,
): Store<IApplicationState> {
  // create the composing function for our middlewares
  // composeWithDevTools will help adding redux remote support for redux devtools chrome extension
  const composeEnhancers = composeWithDevTools({});
  // create the redux-saga middleware
  const sagaMiddleware = createSagaMiddleware();

  // We'll create our store with the combined reducers/sagas, and the initial Redux state that
  // we'll be passing from our entry point.

  // Comment below 26/01/2020: Old way of creating store with connectRouter function from connected-react-router
  // const store = createStore(
  //   connectRouter(history)(rootReducer),
  //   initialState,
  //   composeEnhancers(applyMiddleware(routerMiddleware(history), sagaMiddleware)),
  // );

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeEnhancers(
      applyMiddleware(
        routerMiddleware(history),
        sagaMiddleware,
      ),
    ),
  );

  // Don't forget to run the root saga, and return the store object.
  sagaMiddleware.run(rootSaga);
  return store;
}
