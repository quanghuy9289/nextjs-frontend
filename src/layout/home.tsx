/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import { Collapse } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { AnimatedSwitch, spring } from "react-router-transition";
import styled from "styled-components";
import DialogsManager from "../components/dialogsmanager";
import GENavBar from "../components/genavbar";
import ProjectsPage from "../pages/projects";
import TasksPage from "../pages/tasks";
import { IApplicationState, IConnectedReduxProps } from "../store";
import { CONST_PAGE_PROJECTS, CONST_PAGE_TASKS } from "../utils/constants";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;

// Separate state props + dispatch props to their own interfaces.
interface IPropsFromState {

}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & RouteComponentProps<{}> & IConnectedReduxProps;

class HomeLayout extends React.PureComponent<AllProps> {
    public render() {
        const { match } = this.props;

        return (
            <Container>
                <Collapse
                    isOpen={true}
                    keepChildrenMounted={true}
                >
                    <GENavBar />
                </Collapse>
                <Switch
                // atEnter={{ offset: -100 }}
                // atLeave={{ offset: -100 }}
                // atActive={{ offset: 0 }}
                // mapStyles={(styles) => ({
                //   transform: `translateX(${styles.offset}%)`,
                // })}
                >
                    <Route exact={true} path="/" component={ProjectsPage} />
                    <Route path={`/${CONST_PAGE_PROJECTS}`} component={ProjectsPage} />
                    <Route path={`/${CONST_PAGE_TASKS}`} component={TasksPage} />
                    {/* <Route path="/tasks" component={TasksPage} /> */}
                    <Route component={() => <div>Not Found</div>} />
                </Switch>
                <DialogsManager />
            </Container>
        );
    }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ projects }: IApplicationState) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default withRouter(connect(mapStateToProps)(HomeLayout));
