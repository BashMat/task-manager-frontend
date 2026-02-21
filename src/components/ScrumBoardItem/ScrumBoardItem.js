import { useEffect, useState } from 'react';
import './ScrumBoardItem.css';
import '../../styles.css';
import { Draggable } from 'react-beautiful-dnd';

function ScrumBoardItem(props) {
    return (
        <Draggable draggableId={props.item.id} key={props.item.id} index={props.index}>
            {
                (provided) =>
                (
                    <div className="scrum-board-item" 
                    {...provided.dragHandleProps}
                    {...provided.draggableProps} 
                    ref={provided.innerRef}>
                        <div className="scrum-board-item-header">
                            <p>{props.item.title}</p>
                            <div className="form-header">
                                <button className="btn close" onClick={() => props.DeleteItem(props.item.id)} />
                            </div>
                        </div>
                    </div>
                )
            }
        </Draggable>
    )
}

export default ScrumBoardItem;