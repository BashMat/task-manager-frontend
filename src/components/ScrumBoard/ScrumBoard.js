import { useEffect, useState } from 'react';
import './ScrumBoard.css';
import '../../styles.css';
import ScrumBoardColumn from '../ScrumBoardColumn/ScrumBoardColumn';
import { DragDropContext } from "react-beautiful-dnd";

function ScrumBoard(props) {
    const [newColumn, setNewColumn] = useState("");

    const handleDragEnd = (result) => {
        const { source, destination, group } = result;

        props.MoveItem(source, destination);
    };

    // console.log("DragEnd");
    // console.log(result);
    // const [arrayColumns, setArrayColumns] = useState(() => {
    //     const localValue = 
    //     Object.keys(localStorage)
    //     .filter(x => x.id === props.id).columns
    //     console.log("Board " + props.id + ": " + localValue);
    //     if (localValue == null) {
    //         return [];
    //     }
    //     else {
    //         return localValue;
    //     }
    // });

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="scrum-board">

                <div className="scrum-board-header">

                    <h1>{props.board.title}</h1>
                    <div className="form-header-board">

                        <div className="new-column-form">
                            <div className="form-row-board">
                                <label htmlFor="column">New Column:</label>
                                <input
                                    className="new-column-input" value={newColumn} onChange={e => setNewColumn(e.target.value)}
                                    type="text" placeholder="Column..." id="column" autoComplete='off'>
                                </input>
                            </div>
                            <button className="btn" onClick={() => props.AddColumn(props.board.id, newColumn)}>Add Column</button>
                        </div >

                        <button className="btn close" onClick={() => props.DeleteBoard(props.board.id)} />
                    </div>
                </div>

                <ul className="list-columns">
                    {props.board.columns.map(column => {
                        return (
                            <li key={column.id}>
                                <ScrumBoardColumn 
                                column={column} 
                                DeleteColumn={props.DeleteColumn}
                                AddItem={props.AddItem} 
                                DeleteItem={props.DeleteItem} />
                            </li>
                        )
                    })}
                </ul>
            </div>
        </DragDropContext>
    )
}

export default ScrumBoard;