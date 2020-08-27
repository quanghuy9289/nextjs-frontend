/*!
 * Copyright 2019 CTC. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

// import "@atlaskit/css-reset";
import {
  AtomicBlockUtils,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
  Modifier,
  SelectionState,
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import _ from "lodash";
import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import styled from "styled-components";
import createAlignmentPlugin from "../components/draft-js-plugins/draft-js-alignment-plugin";
import createHashtagPlugin from "../components/draft-js-plugins/draft-js-hashtag-plugin";
import createImagePlugin from "../components/draft-js-plugins/draft-js-image-plugin";
import createInlineToolbarPlugin, { Separator } from "../components/draft-js-plugins/draft-js-inline-toolbar-plugin";
import createLinkifyPlugin from "../components/draft-js-plugins/draft-js-linkify-plugin";
import createMentionPlugin, { defaultSuggestionsFilter } from "../components/draft-js-plugins/draft-js-mention-plugin";
import { IApplicationState } from "../store";
import * as navbarActions from "../store/navbar/actions";

import {
  BlockquoteButton,
  BoldButton,
  CodeBlockButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  UnderlineButton,
  UnorderedListButton,
} from "../components/draft-js-plugins/draft-js-buttons";

import { Classes } from "@blueprintjs/core";
import buttonStyles from "../css/editor-buttons-style.module.css";
import editorStyles from "../css/editor-style.module.css";
import toolbarStyles from "../css/editor-toolbar-style.module.css";
import { IUser } from "../store/users/types";
import { IStringTMap } from "../utils/types";

interface IRippleEditorState {
  editorState: any;
  suggestions: any;
  shouldReset: boolean;
}

interface IMentionItem {
  name: string;
  link: string;
  avatar: string;
}

// Test data for Mention plugin
const mentions = [
  {
    name: "Andrew Briese",
    link: "https://twitter.com/mrussell247",
    avatar: "https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg",
  },
  {
    name: "Tom Lai",
    link: "https://twitter.com/juliandoesstuff",
    avatar: "https://avatars2.githubusercontent.com/u/1188186?v=3&s=400",
  },
  {
    name: "Jess Bateman",
    link: "https://twitter.com/jyopur",
    avatar: "https://avatars0.githubusercontent.com/u/2182307?v=3&s=400",
  },
  {
    name: "Max Stoiber",
    link: "https://twitter.com/mxstbr",
    avatar: "https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg",
  },
  {
    name: "Nik Graf",
    link: "https://twitter.com/nikgraf",
    avatar: "https://avatars0.githubusercontent.com/u/223045?v=3&s=400",
  },
  {
    name: "Pascal Brandt",
    link: "https://twitter.com/psbrandt",
    avatar: "https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png",
  },
];
// End test data

interface IPropsFromState {
  userMap: IStringTMap<IUser>;
}

interface IPropsFromDispatch {

}

interface IOwnProps {
  onTextChange?: (text: string, plain: string, referID?: string) => void;
  initialContent?: string;
  referID?: string;
  readOnly?: boolean;
}

// Combine both state + dispatch props - as well as any props we want to pass - in a union type.
type AllProps = IPropsFromState & IPropsFromDispatch & IOwnProps;

class RippleEditor extends React.PureComponent<AllProps, IRippleEditorState> {
  // refsEditor:any = null
  public editor: any = null;
  public plugins: any = null;
  public mentionPlugin: any = null;
  public inlineToolbarPlugin: any = null;
  public state: IRippleEditorState = {
    editorState: _.isUndefined(this.props.initialContent) || _.isEmpty(this.props.initialContent) ?
      EditorState.createEmpty() :
      EditorState.createWithContent(
        convertFromRaw(JSON.parse(this.props.initialContent!)),
      ),
    suggestions: this.getSuggestions(),
    shouldReset: false,
  };

  private debounceTextChange = _.debounce(() => {
    if (this.props.onTextChange !== undefined) {
      // console.log("editorState JSON = ",
      //     convertToRaw(this.state.editorState.getCurrentContent()),
      // );
      this.props.onTextChange(
        JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent())),
        this.state.editorState.getCurrentContent().getPlainText(),
        this.props.referID,
      );
    }
  }, 500);

  constructor(props) {
    super(props);
    const imagePlugin = createImagePlugin();
    const inlineToolbarPlugin = createInlineToolbarPlugin({
      theme: { buttonStyles, toolbarStyles },
    });
    this.inlineToolbarPlugin = inlineToolbarPlugin;
    const alignmentPlugin = createAlignmentPlugin();
    const hashtagPlugin = createHashtagPlugin();
    const linkifyPlugin = createLinkifyPlugin();
    const mentionPlugin = createMentionPlugin();
    this.mentionPlugin = mentionPlugin;
    this.plugins = [imagePlugin, inlineToolbarPlugin, alignmentPlugin, hashtagPlugin, linkifyPlugin, mentionPlugin];
  }

  public componentDidMount() {
    // const base64 = 'data:image/png;base64,iVBORw0K';
    // const newEditorState = this.insertImage(this.state.editorState, base64);
    // this.setState({ editorState: newEditorState });
  }

  public componentDidUpdate() {
    if (this.state.shouldReset) {
      const editorState = EditorState.push(
        this.state.editorState,
        ContentState.createFromText(""),
        "remove-range",
      );
      this.setState({
        editorState,
        shouldReset: false,
      });
    }
  }

  public componentWillReceiveProps(nextProps: Readonly<AllProps>) {
    // This code below is to reset the state when initial content is changed to undefined to empty
    if (_.isUndefined(nextProps.initialContent) || _.isEmpty(nextProps.initialContent)) {
      // setTimeout(() => {
      //     const editorState = EditorState.push(
      //         this.state.editorState,
      //         ContentState.createFromText(""),
      //         "remove-range",
      //     );
      //     this.setState({
      //         editorState,
      //     });
      // }, 2000);

      this.setState({
        shouldReset: true,
      });

      // let {editorState} = this.state;
      // let contentState = editorState.getCurrentContent();
      // const firstBlock = contentState.getFirstBlock();
      // const lastBlock = contentState.getLastBlock();
      // const allSelected = new SelectionState({
      //     anchorKey: firstBlock.getKey(),
      //     anchorOffset: 0,
      //     focusKey: lastBlock.getKey(),
      //     focusOffset: lastBlock.getLength(),
      //     hasFocus: true,
      // });
      // contentState = Modifier.removeRange(contentState, allSelected, "backward");
      // editorState = EditorState.push(editorState, contentState, "remove-range");
      // editorState = EditorState.forceSelection(contentState, contentState.getSelectionAfter());
      // this.setState({editorState});
    }
  }

  public insertImage = (editorState, base64) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "image",
      "IMMUTABLE",
      { src: base64, style: { maxWidth: "90%", height: "auto" } },
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity },
    );
    this.onChange(newEditorState);
    return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ");
  }

  public onChange = (editorState) => {
    this.setState({ editorState });
    this.debounceTextChange();
  }

  public onSearchChange = ({ value }) => {
    this.setState({
      suggestions: defaultSuggestionsFilter(value, this.getSuggestions()),
    });
  }

  public onAddMention = () => {
    // get the mention object selected
  }

  public onEditorFocus = () => {
    this.editor.focus();
  }

  public render() {
    const { InlineToolbar } = this.inlineToolbarPlugin;
    const { MentionSuggestions } = this.mentionPlugin;
    return (
      <div
        // onClick={this.onEditorFocus}
        className={Classes.INPUT_GROUP}
      >
        <Editor
          readOnly={this.props.readOnly}
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={this.plugins}
          // placeholder="Description..."
          ref={(element) => { this.editor = element; }}
          handlePastedFiles={this.handlePastedFiles}
          handlePastedText={(text: string, html?: string, editorState?: EditorState) => {
            console.log(text, "handlePastedText text");
            console.log(html, "handlePastedText html");
            console.log(editorState, "handlePastedText editorState");
          }}
          handleDroppedFiles={(selection: SelectionState, files: Blob[]) => {
            console.log(files, "handleDroppedFiles files");
            this.handlePastedFiles(files);
          }}
        />
        <InlineToolbar>
          {
            // may be use React.Fragment instead of div to improve perfomance after React 16
            (externalProps) => (
              <div>
                <HeadlineOneButton {...externalProps} />
                <HeadlineTwoButton {...externalProps} />
                {/* <HeadlineThreeButton {...externalProps} /> */}
                {/* <Separator {...externalProps} /> */}
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                {/* <Separator {...externalProps} /> */}
                <CodeButton {...externalProps} />
                {/* <HeadlinesButton {...externalProps} /> */}
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </div>
            )
          }
        </InlineToolbar>
        <MentionSuggestions
          onSearchChange={this.onSearchChange}
          suggestions={this.state.suggestions}
          onAddMention={this.onAddMention}
        />
      </div>
    );
  }

  public getBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result!);
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
      };
    });
  }

  public handlePastedFiles = (files) => {
    // this part puts the file as an image in the editor
    let fileBase64 = "";
    this.getBase64(files[0]).then((result) => {
      fileBase64 = result as string;
      const newEditorState = this.insertImage(this.state.editorState, fileBase64);
      this.onChange(newEditorState);
    });
  }

  private createEditorContentIfCan(content: string) {
    try {
      return EditorState.createWithContent(
        convertFromRaw(JSON.parse(this.props.initialContent!)),
      );
    } catch (e) {
      return EditorState.createWithContent(
        ContentState.createFromText(this.props.initialContent!),
      );
    }
  }

  private getSuggestions() {
    return _.map(this.props.userMap, (eachUser: IUser) => {
      const mentionItem: IMentionItem = {
        avatar: eachUser.avatarBase64,
        link: eachUser.id,
        name: `${eachUser.fullname} (${eachUser.nickname})`,
      };
      return mentionItem;
    });
  }

  // private getMentionItemsFromUserMap = (userMap: IStringTMap<IUser>) => {
  //     return _.map(userMap, (eachUser: IUser) => {
  //         const mentionItem: IMentionItem = {
  //             avatar: eachUser.avatarBase64,
  //             link: "",
  //             name: `${eachUser.fullname} (${eachUser.nickname})`,
  //         };
  //         return mentionItem;
  //     });
  // }
}

// It's usually good practice to only include one context at a time in a connected component.
// Although if necessary, you can always include multiple contexts. Just make sure to
// separate them from each other to prevent prop conflicts.
const mapStateToProps = ({ users }: IApplicationState) => ({
  userMap: users.userMap,
});

// Mapping our action dispatcher to props is especially useful when creating container components.
const mapDispatchToProps = (dispatch: Dispatch) => ({

});

// Now let's connect our component!
// With redux v4's improved typings, we can finally omit generics here.
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RippleEditor);
