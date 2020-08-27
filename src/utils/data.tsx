/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import _ from "lodash";
import { IDraftJSEditorStateJSON, IDraftJSEntity, IDraftJSMentionData } from "../store/comments/types";
import { CONST_DRAFTJS_ENTITY_TYPE_MENTION } from "./constants";

export function getMentionedUserIDsFromDraftJSRawState(rawState: string) {
    // Get the mention list
    const mentionedCommentUserIDs: string[] = [];
    try {
        const editorState: IDraftJSEditorStateJSON | undefined =
            JSON.parse(rawState);
        if (editorState !== undefined) {
            _.map(editorState.entityMap, (eachEntity: IDraftJSEntity) => {
                if (eachEntity.type === CONST_DRAFTJS_ENTITY_TYPE_MENTION &&
                    eachEntity.data !== undefined &&
                    eachEntity.data.mention !== undefined) {
                        const mentionData: IDraftJSMentionData = eachEntity.data.mention;
                        if (
                            !_.isUndefined(mentionData.link) &&
                            !_.isEmpty(mentionData.link)
                        )  {
                            mentionedCommentUserIDs.push(mentionData.link);
                        }
                }
            });
        }
        console.log("mentionedCommentUserIDs = ", mentionedCommentUserIDs);
    } catch (e) {
        // Do nothing
    }
    return mentionedCommentUserIDs;
}
