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

import { MenuItem } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import { IUserLeaveType, UserLeaveTypes } from "../../store/users/types";

/** Top 100 userLeaveTypes as tested data */
export const USER_LEAVE_TYPES: UserLeaveTypes[] = [
    UserLeaveTypes.FULL_DAY,
    UserLeaveTypes.HALF_DAY,
    UserLeaveTypes.UNPAID,
]; // .map((m, index) => ({ ...m }));

export const renderUserLeaveType: ItemRenderer<UserLeaveTypes> = (userLeaveType, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    const text = `${userLeaveType}`;
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            // label={userLeaveType.title.toString()}
            key={userLeaveType}
            onClick={handleClick}
            text={highlightText(text, query)}
        />
    );
};

export const filterUserLeaveType: ItemPredicate<UserLeaveTypes> = (query, userLeaveType) => {
    return `${userLeaveType.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
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
        tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
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

export const userLeaveTypeSelectProps = {
    itemPredicate: filterUserLeaveType,
    itemRenderer: renderUserLeaveType,
    // items: TOP_100_ROLES,
};
