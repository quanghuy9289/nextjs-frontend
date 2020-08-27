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
import { IRole } from "../../store/roles/types";

/** Top 100 roles as tested data */
export const TOP_100_ROLES: IRole[] = [
    { id: "c7111ffk-7e7c-4dec-afb8-1461233ee219", name: "System administrator" },
    { id: "c7111ffl-7e7c-4dec-afb8-1461233ee219", name: "Support administrator" },
    { id: "c7111ffa-7e7c-4dec-afb8-1461233ee219", name: "Senior developer" },
    { id: "c7111ffb-7e7c-4dec-afb8-1461233ee219", name: "Junior developer" },
    { id: "c7111ffc-7e7c-4dec-afb8-1461233ee219", name: "Developer" },
    { id: "c7111fff-7e7c-4dec-afb8-1461233ee219", name: "General manager" },
    { id: "c7111ffg-7e7c-4dec-afb8-1461233ee219", name: "Tester" },
    { id: "c7111ffh-7e7c-4dec-afb8-1461233ee219", name: "CEO" },
    { id: "c7111ffi-7e7c-4dec-afb8-1461233ee219", name: "COO" },
    { id: "c7111ffj-7e7c-4dec-afb8-1461233ee219", name: "CTO" },
    { id: "c7111ffd-7e7c-4dec-afb8-1461233ee219", name: "Business manager" },
    { id: "c7111ffe-7e7c-4dec-afb8-1461233ee219", name: "Technical manager" },
].map((m, index) => ({ ...m }));

export const renderRole: ItemRenderer<IRole> = (role, { handleClick, modifiers, query }) => {
    if (!modifiers.matchesPredicate) {
        return null;
    }
    const text = `${role.name}`;
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            // label={role.title.toString()}
            key={role.id}
            onClick={handleClick}
            text={highlightText(text, query)}
        />
    );
};

export const filterRole: ItemPredicate<IRole> = (query, role) => {
    return `${role.name.toLowerCase()}`.indexOf(query.toLowerCase()) >= 0;
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

export const roleSelectProps = {
    itemPredicate: filterRole,
    itemRenderer: renderRole,
    // items: TOP_100_ROLES,
};
