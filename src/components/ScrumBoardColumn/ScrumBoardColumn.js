import { useEffect, useState } from 'react';
import './ScrumBoardColumn.css';
import '../../styles.css';
import ScrumBoardItem from '../ScrumBoardItem/ScrumBoardItem';
import { Droppable } from 'react-beautiful-dnd';

function ScrumBoardColumn(props) {
    const [newItem, setNewItem] = useState("");

    return (
        <Droppable droppableId={props.column.id} type="group">
            {
                (provided) =>
                (
                    <div className="scrum-board-column" {...provided.droppableProps} ref={provided.innerRef}>

                        <div className="scrum-board-column-header">
                            <h1>{props.column.title}</h1>

                            <div className="form-header-column">
                                <div className="new-item-form">
                                    <div className="form-row-column">
                                        <label htmlFor="item">New Item:</label>
                                        <input
                                            className="new-item-input" value={newItem} onChange={e => setNewItem(e.target.value)}
                                            type="text" placeholder="Item..." id="item" autoComplete='off'>
                                        </input>
                                    </div>
                                    <button className="btn" onClick={() => props.AddItem(props.column.id, newItem)}>Add Item</button>
                                </div>
                                <button className="btn close" onClick={() => props.DeleteColumn(props.column.id)} />
                            </div>
                        </div>

                        <ul className="list-items">
                            {props.column.items.map((item, index) => {
                                return (
                                    <li key={item.id}>
                                        <ScrumBoardItem item={item} DeleteItem={props.DeleteItem} index={index} />
                                    </li>
                                )
                            })}
                        </ul>
                        {provided.placeholder}
                    </div>
                )
            }
        </Droppable>
    )
}

export default ScrumBoardColumn;