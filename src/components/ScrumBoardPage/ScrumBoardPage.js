import { useEffect, useState } from 'react';
import './ScrumBoardPage.css';
import '../../styles.css';
import ScrumBoard from '../ScrumBoard/ScrumBoard';
import { DragDropContext } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

const ScrumBoardPageData =
    [
        {
            id: crypto.randomUUID(),
            title: "Home",
            columns:
                [
                    {
                        id: crypto.randomUUID(),
                        title: "New",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Clean Workspace",
                                }
                            ]
                    },
                    {
                        id: crypto.randomUUID(),
                        title: "In Progress",
                        items:
                            []
                    },
                    {
                        id: crypto.randomUUID(),
                        title: "Done",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Wash Dishes",
                                }
                            ]
                    }
                ]
        },
        {
            id: crypto.randomUUID(),
            title: "Job",
            columns:
                [
                    {
                        id: crypto.randomUUID(),
                        title: "New",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Research Meeting Class",
                                },
                                {
                                    id: crypto.randomUUID(),
                                    title: "Create Accounts for ExchangeSync",
                                }
                            ]
                    },
                    {
                        id: crypto.randomUUID(),
                        title: "In Progress",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Groom and Write Stories to Collect Data",
                                }
                            ]
                    },
                    {
                        id: crypto.randomUUID(),
                        title: "Done",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Minute TimeEntry",
                                }
                            ]
                    }
                ]
        },
        {
            id: crypto.randomUUID(),
            title: "Task Manager Project",
            columns:
                [
                    {
                        id: crypto.randomUUID(),
                        title: "New",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Create Frontend for log in/sign up",
                                }
                            ]
                    },
                    {
                        id: crypto.randomUUID(),
                        title: "In Progress",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Create Frontend for Boards",
                                },
                                {
                                    id: crypto.randomUUID(),
                                    title: "Update Backend for Boards",
                                }
                            ]
                    },
                    {
                        id: crypto.randomUUID(),
                        title: "Done",
                        items:
                            [
                                {
                                    id: crypto.randomUUID(),
                                    title: "Refactor Backend – Part 1",
                                }
                            ]
                    }
                ]
        }
    ]

function GetBoardsFromLocalStorage()
{
    let array = localStorage.getItem("ScrumBoardPage");

    console.log("From local")
    console.log(array)
    if (array === null || array === undefined)
    {
        return [];
    }
    return JSON.parse(array)
}

function GetToken()
{
    let token = localStorage.getItem("token");

    if (token && token !== "null")
    {
        console.log("Returning token: ", token);
        return token;
    }
    console.log("Returning empty");
    return "";
}

function ScrumBoardPage(props) {
    const [token, setToken] = useState(GetToken());
    const [newBoard, setNewBoard] = useState("");
    const [arrayBoards, setArrayBoards] = useState(null);

    useEffect(() => {
        GetBoardsFromApi();
    }, []);

    function ConvertToBoardArray(data)
    {
        console.log("Converting...")
        return data.map(board =>
            {
                return {id: board.id, title: board.title, columns: board.columns.map(column =>
                    {
                        return {id: column.id, title: column.title, items: column.cards.map(card =>
                            {
                                return {id: card.id, title: card.title};
                            }).sort((lhs, rhs) => lhs.id < rhs.id ? -1 : 1)};
                    }).sort((lhs, rhs) => lhs.id < rhs.id ? -1 : 1)};
            }).sort((lhs, rhs) => lhs.id < rhs.id ? -1 : 1);
    }

    function GetBoardsFromApi()
    {
        console.log("Getting board from API")
        fetch("https://localhost:7285/api/boards",
            {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Authorization": "bearer " + token
                }
            }).then(response => {
                console.log("Response for board API:");
                console.log(response);
                if (!response.ok) {
                }
                return response.json();
            }
            ).then(data => 
                {
                    console.log("Response data:", data);
                    console.log("Data in data:", data.data);
                    let converted = ConvertToBoardArray(data.data);
                    console.log("Converted:");
                    console.log(converted);
                    setArrayBoards(converted);
                })
            .catch((error) => {
                console.log("Fetch failed for board API");
            });
    }

    function AddBoard(e) {
        e.preventDefault();

        if (newBoard.trim() === "") {
            return;
        }

        //const newBoardId = crypto.randomUUID();

        //setArrayBoards(currentArray => {
        //    return [...currentArray, { id: newBoardId, title: newBoard, columns: [] }]
        //});

        let httpBody = JSON.stringify({ "title": newBoard });
        console.log("Posting new board via API")
        fetch("https://localhost:7285/api/boards",
            {
                method: 'POST',
                mode: 'cors',
                body: httpBody,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Authorization": "bearer " + token
                }
            }).then(response => {
                console.log("Response for board API:");
                console.log(response);
                if (!response.ok) {
                }
                return response.json();
            }
            ).then(data => 
                {
                    console.log("Response data:", data);
                    console.log("Data in data:", data.data);
                    let converted = ConvertToBoardArray(data.data);
                    console.log("Converted:");
                    console.log(converted);
                    setArrayBoards(converted);
                })
            .catch((error) => {
                console.log("Fetch failed for board API");
            });

        setNewBoard("");
    }

    function DeleteBoard(id) {
        // setArrayBoards(currentArray => {
        //     return currentArray.filter(item => item.id !== id);
        // })

        console.log("Delete board via API")
        fetch(`https://localhost:7285/api/boards/${id}`,
            {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Authorization": "bearer " + token
                }
            }).then(response => {
                console.log("Response for board API:");
                console.log(response);
                if (!response.ok) {
                }
                return response.json();
            }
            ).then(data => 
                {
                    console.log("Response data:", data);
                    console.log("Data in data:", data.data);
                    let converted = ConvertToBoardArray(data.data);
                    console.log("Converted:");
                    console.log(converted);
                    setArrayBoards(converted);
                })
            .catch((error) => {
                console.log("Fetch failed for board API");
            });

        setNewBoard("");
    }

    function AddColumn(boardId, columnTitle) {
        // console.log('New AddColumn: ' + boardId + ', ' + columnTitle);

        // setArrayBoards(currentArray => {
        //     return currentArray.map(board => {
        //         if (board.id === boardId) {
        //             return {
        //                 id: board.id, title: board.title, columns:
        //                     [...board.columns,
        //                     {
        //                         id: crypto.randomUUID(), title: columnTitle, items: []
        //                     }]
        //             };
        //         }
        //         return board;
        //     })
        // });

        let httpBody = JSON.stringify({ "title": columnTitle, "boardId": boardId });
        console.log("Posting new column via API")
        fetch("https://localhost:7285/api/boards/columns",
            {
                method: 'POST',
                mode: 'cors',
                body: httpBody,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Authorization": "bearer " + token
                }
            }).then(response => {
                console.log("Response for board API:");
                console.log(response);
                if (!response.ok) {
                    return response.json();
                }
                return response.json();
            }
            ).then(data => 
                {
                    //console.log("Response data:", data);
                    //console.log("Data in data:", data.data);
                    //let converted = ConvertToBoardArray(data.data);
                    GetBoardsFromApi();
                })
            .catch((error) => {
                console.log("Fetch failed for board API");
            });

        setNewBoard("");
    }

    function DeleteColumn(columnId) {
        console.log('DeleteColumn: ' + columnId);

        console.log("Deleting column via API")
        fetch(`https://localhost:7285/api/boards/columns/${columnId}`,
            {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Authorization": "bearer " + token
                }
            }).then(response => {
                console.log("Response for board API:");
                console.log(response);
                if (!response.ok) {
                }
                return response.json();
            }
            ).then(data => 
                {
                    //console.log("Response data:", data);
                    //console.log("Data in data:", data.data);
                    GetBoardsFromApi();
                })
            .catch((error) => {
                console.log("Fetch failed for board API");
            });
        // setArrayBoards(currentArray => {
        //     return currentArray.map(board => {
        //         return { id: board.id, title: board.title, columns:
        //                 board.columns.filter(column => column.id !== columnId) };
        //     })
        // });
    }

    function AddItem(columnId, itemTitle) {
        console.log('New AddItem: ' + columnId + ', ' + itemTitle)

        // setArrayBoards(currentArray =>
        // {
        //     return currentArray.map(board =>
        //         {
        //             return {
        //                 id: board.id,
        //                 title: board.title, 
        //                 columns: board.columns.map(column => 
        //                     {
        //                         if (column.id === columnId)
        //                         {
        //                             return {
        //                                 id: column.id, title: column.title, items:
        //                                 [...column.items,
        //                                 {
        //                                     id: crypto.randomUUID(), title: itemTitle
        //                                 }]
        //                             };
        //                         }
        //                         return column;
        //                     })
        //             }
        //         })
        // });
        let httpBody = JSON.stringify({ "title": itemTitle, "columnId": columnId });
        console.log("Posting new card via API")
        fetch("https://localhost:7285/api/boards/cards",
            {
                method: 'POST',
                mode: 'cors',
                body: httpBody,
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Authorization": "bearer " + token
                }
            }).then(response => {
                console.log("Response for board API:");
                console.log(response);
                if (!response.ok) {
                }
                return response.json();
            }
            ).then(data => 
                {
                    console.log("Response data:", data);
                    console.log("Data in data:", data.data);
                    //let converted = ConvertToBoardArray(data.data);
                    //console.log("Converted:");
                    //console.log(converted);
                    //setArrayBoards(converted);
                    GetBoardsFromApi();
                })
            .catch((error) => {
                console.log("Fetch failed for board API");
            });

    }

    function DeleteItem(itemId) {
        console.log('Delete item: ' + itemId);

        console.log("Deleting item via API")
        fetch(`https://localhost:7285/api/boards/cards/${itemId}`,
            {
                method: 'DELETE',
                mode: 'cors',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "*",
                    "Authorization": "bearer " + token
                }
            }).then(response => {
                console.log("Response for board API:");
                console.log(response);
                if (!response.ok) {
                }
                return response.json();
            }
            ).then(data => 
                {
                    console.log("Response data:", data);
                    console.log("Data in data:", data.data);
                    //let converted = ConvertToBoardArray(data.data);
                    //console.log("Converted:");
                    //console.log(converted);
                    //setArrayBoards(converted);
                    GetBoardsFromApi();
                })
            .catch((error) => {
                console.log("Fetch failed for board API");
            });

        // setArrayBoards(currentArray => {
        //     return currentArray.map(board => {
        //         return { id: board.id, title: board.title, columns:
        //                 board.columns.map(column => {
        //                     return { id: column.id, title: column.title, items:
        //                         column.items.filter(item => item.id !== itemId)
        //                     }
        //                 })
        //                 };
        //     })
        // });
    }

    function MoveItem(source, destination)
    {
        console.log("Moving...");
        if (!destination) {
            console.log("No destination. End of drag");
            return;
        }

        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
            console.log("No change. End of drag");
            return;
        }

        const itemSourceIndex = source.index;
        const itemDestinationIndex = destination.index;

        console.log("Source index: " + itemSourceIndex);
        console.log("Destination index: " + itemDestinationIndex);

        const changingBoard = arrayBoards.find(board => 
            {
                for (var i = 0; i < board.columns.length; i++)
                {
                    if (board.columns[i].id === source.droppableId)
                    {
                        return true;
                    }
                }
            });

        console.log("Board: " + changingBoard);

        const columnSourceIndex = changingBoard.columns.findIndex(
            (column) => column.id === source.droppableId
        );

        console.log("columnSourceIndex: " + columnSourceIndex);

        const columnDestinationIndex = changingBoard.columns.findIndex(
            (column) => column.id === destination.droppableId
        );

        console.log("columnDestinationsIndex: " + columnDestinationIndex);

        const newSourceItems = [...changingBoard.columns[columnSourceIndex].items];

        console.log("newSourceItems: " + newSourceItems);

        const newDestinationItems =
            source.droppableId !== destination.droppableId
                ? [...changingBoard.columns[columnDestinationIndex].items]
                : newSourceItems;

        console.log("newDestinationItems: " + newDestinationItems);

        const [deletedItem] = newSourceItems.splice(itemSourceIndex, 1);

        console.log("deletedItem: " + deletedItem);

        newDestinationItems.splice(itemDestinationIndex, 0, deletedItem);

        const newArrayColumns = [...changingBoard.columns];

        newArrayColumns[columnSourceIndex] = {
            ...changingBoard.columns[columnSourceIndex],
            items: newSourceItems
        };
        newArrayColumns[columnDestinationIndex] = {
            ...changingBoard.columns[columnDestinationIndex],
            items: newDestinationItems,
        };

        console.log("newArrayColumns: " + newArrayColumns);

        setArrayBoards(currentArray =>
            {
                return currentArray.map(board => 
                    {
                        if (board.id === changingBoard.id)
                        {
                            return {
                                id: changingBoard.id,
                                title: changingBoard.title,
                                columns: newArrayColumns
                            }
                        }
                        return board;
                    })
            });
    }

    let decodedToken = token;
    let currentDate = new Date();
    if (decodedToken !== "")
    {
        console.log("Predecoded: ", decodedToken)
        decodedToken = jwtDecode(token);
        console.log("Decoded Token", decodedToken);
        if (decodedToken.exp * 1000 < currentDate.getTime())
        {
            console.log("Token expired.");
            return <Navigate to='/' />
        } 
        else 
        {
            console.log("Valid token");
            // TODO: add request to check token at backend
        }
    }
    else
    {
        return (<Navigate to='/' />)
    }
    

    return arrayBoards && (
        <div className="scrum-board-page">
            <div className="scrum-board-page-header">
                {/* <button className="btn" onClick={props.set}>Go to Main Page</button> */}
                <div className="outer-center">
                    <Link to="/" className="btn center">Go to Main Page</Link>
                </div>

                <form onSubmit={AddBoard} className="new-board-form">
                    <div className="outer-center">
                        <div className="form-row-board-page">
                            <label htmlFor="board">New Board:</label>
                            <input
                                className="new-board-input" value={newBoard} onChange={e => setNewBoard(e.target.value)}
                                type="text" placeholder="Board..." id="board" autoComplete='off'>
                            </input>
                        </div>
                    </div>
                    <div className="outer-center">
                        <button className="btn">Add Board</button>
                    </div>
                </form>

                <div className="outer-center">
                    <h1>Scrum Boards</h1>
                </div>
            </div>

            <ul>
                {arrayBoards.map(board => {
                    return (
                        <li key={board.id}>
                            <ScrumBoard
                                board={board}
                                AddBoard={AddBoard}
                                DeleteBoard={DeleteBoard}
                                AddColumn={AddColumn}
                                DeleteColumn={DeleteColumn}
                                AddItem={AddItem}
                                DeleteItem={DeleteItem} 
                                MoveItem={MoveItem} />
                        </li>
                    )
                })}
            </ul>

        </div>
    )
}

export default ScrumBoardPage;