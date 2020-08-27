/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import { Classes, MenuItem, Position } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import { ITask, ITaskWithUserInfo } from "../../store/tasks/types";
import { IUser } from "../../store/users/types";

export const renderTask: ItemRenderer<ITaskWithUserInfo> = (taskWithUserInfo, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    const task: ITask = taskWithUserInfo.task;
    const text = `${task.title}`;
    const createdByUser: IUser | undefined = taskWithUserInfo.createdBy;
    const createdByUserFullnameWithNickname =
        `${createdByUser !== undefined ? `${createdByUser.fullname} (${createdByUser.nickname})` : "..."}`;

    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            labelElement={
                <span
                    style={{
                        lineHeight: "2.1",
                    }}
                >
                    {highlightText(task.incrementcode.toString(), query)}
                </span>
            }
            key={task.id}
            onClick={handleClick}
            className="task-menu-item-overflow"
            text={
                <div
                    className={Classes.TEXT_OVERFLOW_ELLIPSIS}
                >
                    <span
                        style={{
                            lineHeight: "2.1",
                        }}
                    >
                        {highlightText(text, query)}
                    </span>
                    <br/>
                    <span
                        style={{
                            lineHeight: "1.5",
                            fontSize: "0.85em",
                            textIndent: "2px",
                        }}
                    >
                        &nbsp;
                        {highlightText(
                            `Created by ${createdByUserFullnameWithNickname}`,
                            query,
                        )}
                    </span>
                </div>
            }
        />
    );
};

export const filterTask: ItemPredicate<ITaskWithUserInfo> = (query, taskWithUserInfo) => {
    const task: ITask = taskWithUserInfo.task;
    const createdBy: IUser | undefined = taskWithUserInfo.createdBy;
    return `${task.title.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0 ||
        `${task.incrementcode.toString().toLowerCase()}`.indexOf(query.toLowerCase()) >= 0 ||
        (createdBy !== undefined &&
            (
                `${createdBy.fullname.toString().toLowerCase()}`.indexOf(query.toLowerCase()) >= 0 ||
                `${createdBy.nickname.toString().toLowerCase()}`.indexOf(query.toLowerCase()) >= 0
            )
        );
};

function highlightText(text: string, query: string) {
    let lastIndex = 0;
    const words = query
        .split(/\s+/)
        .filter((word) => word.length > 0)
        .map(escapeRegExpChars);
    if (words.length === 0) {
        return [text];
    }
    const regexp = new RegExp(words.join("|"), "gi");
    const tokens: React.ReactNode[] = [];
    while (true) {
        const match = regexp.exec(text);
        if (!match) {
            break;
        }
        const length = match[0].length;
        const before = text.slice(lastIndex, regexp.lastIndex - length);
        if (before.length > 0) {
            tokens.push(before);
        }
        lastIndex = regexp.lastIndex;
        tokens.push(<strong style={{color: "#ffd700"}} key={lastIndex}>{match[0]}</strong>);
    }
    const rest = text.slice(lastIndex);
    if (rest.length > 0) {
        tokens.push(rest);
    }
    return tokens;
}

function escapeRegExpChars(text: string) {
    return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

export const taskSelectProps = {
    itemPredicate: filterTask,
    itemRenderer: renderTask,
    // items: TOP_100_ROLES,
};
