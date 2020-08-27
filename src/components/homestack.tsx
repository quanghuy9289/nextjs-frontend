/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import { IPanel, IPanelProps, PanelStack } from "@blueprintjs/core";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import initialData from "../data/initial-data";
import store from "../store";
import Column from "./column";
import ProjectListPanel from "./projectlistpanel";
import ProjectListTabPanel from "./projectlisttabpanel";

const Container = styled.div`
    display: flex;
    flex-direction: row;
    flex-grow: 1;
`;

class HomeStack extends React.PureComponent {
    public componentDidMount() {
        fetch(`http://localhost:8081/v1/board/board_11111`)
            .then((response) => {
                return response.json();
            })
            .then((json) => {
                this.setState(json);
            });
    }

    public render() {
        // if (this.state != null) {
        return (
            <Container>
                <PanelStack
                    className="homestack"
                    onOpen={this.onOpen}
                    initialPanel={
                        {
                            component: ProjectListTabPanel,
                            // props: {},
                            title: "Projects",
                        }
                    }
                />
            </Container>
        );
        // }
        // return ""
    }

    public onOpen = (addedPanel: IPanel) => {
        // To do
    }
}

export default HomeStack;
