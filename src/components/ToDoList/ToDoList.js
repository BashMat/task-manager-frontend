import { useEffect, useState } from 'react';
import './ToDoList.css';
import '../../styles.css';

function ToDoList(props)
{
    const [newItem, setNewItem] = useState("");

    const [arrayItems, setArrayItems] = useState(() => {
        const localValue = localStorage.getItem("ToDoList");
        if (localValue == null)
        {
            return [];
        }
        else
        {
            return JSON.parse(localValue);
        }
    });

    useEffect(() => {
        localStorage.setItem("ToDoList", JSON.stringify(arrayItems));
    }, [arrayItems]);

    function SubmitNewItem(e)
    {
        e.preventDefault();

        setArrayItems(currentArray => {
            return [...currentArray, { id: crypto.randomUUID(), title: newItem, done: false }]
        });

        setNewItem("");
    }

    function DeleteItem(id)
    {
        setArrayItems(currentArray => {
            return currentArray.filter(item => item.id !== id)
        })
    }

    function ToggleCheckbox(id, done)
    {
        setArrayItems(currentArray => {
            return currentArray.map(item => {
                if (item.id === id)
                {
                    return {...item, done}
                }
                return item
            })
        })
    }

    return (
        <>
            <div className="to-do-list-page">
            <button className="btn" onClick={props.set} >Go to Main Page</button>
            <form onSubmit={SubmitNewItem} className="new-item-form">
                <div className="form-row">
                    <label htmlFor="item">New Item:</label>
                    <input
                        className="new-item-input"
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        type="text" placeholder="Task" id="item" autoComplete='off'>
                    </input>
                </div>
                <button className="btn">Add Item</button>
            </form>
            <h1>To Do List:</h1>
            <ul>
                {arrayItems.map(item => {
                    return (
                        <li key={item.id}>
                            <label>
                                <input type="checkbox" checked={item.done} onChange={e => ToggleCheckbox(item.id, e.target.checked)}></input>
                                {item.title}
                            </label>
                            <button className="btn red" onClick={() => DeleteItem(item.id)}>Delete</button>
                        </li>
                    )
                })}
            </ul>
            </div>
        </>
    )
}

export default ToDoList;