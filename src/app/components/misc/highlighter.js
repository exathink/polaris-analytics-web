import React from 'react';

export const Highlighter = ({highlightStyle, searchWords, textToHighlight}) => {
    const splitText = textToHighlight.toLowerCase().split(searchWords.toLowerCase())
    const foundText = textToHighlight.substr(textToHighlight.toLowerCase().indexOf(searchWords.toLowerCase()), searchWords.length)
    return (
        searchWords.length && splitText.length > 1
            ?
            <React.Fragment>
                <span>{splitText[0]}</span>
                <span style={highlightStyle}>{foundText}</span>
                <span>{splitText[1]}</span>
            </React.Fragment>
            : <span>{textToHighlight}</span>
    )
}