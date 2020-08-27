/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
    Menu,
    MenuItem,
} from "@blueprintjs/core";
import _ from "lodash";
import React from "react";
import { IStandardColor, IStandardColorGroup } from "../../store/colors/types";

interface IOwnProps {
    colorgroups: IStandardColorGroup[];
    onSelectColor: (selectedColor: IStandardColor) => void;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IOwnProps;

export default class ColorsContextMenu extends React.PureComponent<AllProps> {
    constructor(props) {
        super(props);
    }

    public componentDidMount() {
        // To do
    }

    public render() {
        return (
            <Menu>
                {this.props.colorgroups.map((group: IStandardColorGroup, indexGroup: number) => {
                    return (
                        <MenuItem
                            key={indexGroup}
                            text={group.name}
                            labelElement={
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        width: "100px",
                                        height: "20px",
                                    }}
                                >
                                    {group.colors.map((color: IStandardColor, indexColor: number) => {
                                        return (
                                            <div
                                                key={indexColor}
                                                style={{
                                                    backgroundColor: `rgba(
                                                        ${color.red},
                                                        ${color.green},
                                                        ${color.blue},
                                                        ${color.alpha})`,
                                                    height: "20px",
                                                    flexGrow: 1,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            }
                        >
                            {group.colors.map((color: IStandardColor, indexColor: number) => {
                                return (
                                    <MenuItem
                                        key={indexColor}
                                        style={{
                                            backgroundColor: `rgba(
                                                ${color.red},
                                                ${color.green},
                                                ${color.blue},
                                                ${color.alpha})`,
                                            height: "50px",
                                        }}
                                        onClick={() => {
                                            this.handleSelectColor(color);
                                        }}
                                    />
                                );
                            })}
                        </MenuItem>
                    );
                })}
            </Menu>
        );
    }

    private handleSelectColor = (selectedColor: IStandardColor) => {
        this.props.onSelectColor(selectedColor);
    }
}
