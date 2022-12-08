import React from "react";
import "./art-board.scss"
export interface ArtBoardProps {
    label: string;
}

const ArtBoard = (props: ArtBoardProps) => {
    return <h1>Hello World! - {props.label}</h1>;
};

export default ArtBoard;
