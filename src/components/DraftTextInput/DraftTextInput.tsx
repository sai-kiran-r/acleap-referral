import React from 'react'
import { RawDraftContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

// will be using input from https://jpuri.github.io/react-draft-wysiwyg/#/demo

type DraftInputProps = {
    id?: string,
    value?: RawDraftContentState | undefined,
    onChange?: (value: RawDraftContentState) => void,
    className?: string,
    style?: React.CSSProperties,
}

const DraftTextInput = (props: DraftInputProps) => {
    return (
        <Editor
            initialContentState={props.value}
            toolbarClassName="dti-toolbar"
            wrapperClassName={`dti-wrapper ${props.className}`}
            editorClassName="dti-editor"
            onContentStateChange={props.onChange}
            wrapperId={parseInt(props.id || '')}
            wrapperStyle={props.style}
        />
    )
}

export default DraftTextInput
