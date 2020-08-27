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

import { MenuItem, Position } from "@blueprintjs/core";
import { ItemPredicate, ItemRenderer } from "@blueprintjs/select";
import * as React from "react";
import { IUser } from "../../store/users/types";
import UserImage from "../userimage";

export const renderUser: ItemRenderer<IUser> = (user, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    const text = `${user.fullname}`;
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            labelElement={
                <span
                    style={{
                        lineHeight: "4.1",
                    }}
                >
                    {highlightText(user.nickname, query)}
                </span>
            }
            key={user.id}
            onClick={handleClick}
            text={
                <span
                    style={{
                        lineHeight: "4.1",
                    }}
                >
                    {highlightText(text, query)}
                </span>
            }
            icon={
                // <img
                //     style={{
                //         width: "50px",
                //         height: "50px",
                //     }}
                //     src={user.avatarBase64}
                // />
                <UserImage
                    name={user.nickname}
                    sizeInPx={50}
                    doesDisplayName={false}
                    imgSource={user.avatarBase64}
                    allowContextMenu={false}
                    displayTooltip={false}
                    tooltipPosition={Position.LEFT}
                />}
        />
    );
};

export const filterUser: ItemPredicate<IUser> = (query, user) => {
    return `${user.fullname.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0 ||
        `${user.nickname.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0 ||
        `${user.email.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
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

export const userSelectProps = {
    itemPredicate: filterUser,
    itemRenderer: renderUser,
    // items: TOP_100_ROLES,
};
