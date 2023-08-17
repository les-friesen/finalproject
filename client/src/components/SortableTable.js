import styled from 'styled-components'; 
import { sortTableData } from '../helpers';
import Expense from './Expense';
import {BiSortAlt2} from "react-icons/bi"

const SortableTable = ({participants, direction, setDirection, setSortBy, sortedItems, setSortedItems, currency, expenses, tripId, updateData, setUpdateData}) => {

    const handleClick = event => {
        const sortDir = direction === 'descending' ? 'ascending' : 'descending'
        setDirection(sortDir)
        setSortBy(event.target.id)
        const sortConfig = { sortBy: event.target.id, direction: sortDir }
        setSortedItems(sortTableData(expenses, sortConfig))
    }

return (
        <Wrapper>
            <table>
                    <thead>
                    <tr>
                        <th>name</th>
                        <th>
                            <button 
                                className="sort"
                                id="category"
                                onClick={handleClick}>
                                category
                                <BiSortAlt2 size={20} style={{pointerEvents: 'none', marginLeft: '5px'}}/>
                            </button>
                        </th>
                        { participants?.length > 1 && 
                        <th>
                            <button 
                                className="sort"
                                id="paidBy"
                                onClick={handleClick}>
                                paid by 
                                <BiSortAlt2 size={20} style={{pointerEvents: 'none', marginLeft: '5px'}}/>
                            </button>
                        </th>
                        }
                        <th>
                            <button 
                                className="sort"
                                id="date"
                                onClick={handleClick}>
                                date
                                <BiSortAlt2 size={20} style={{pointerEvents: 'none', marginLeft: '5px'}}/>
                            </button>
                        </th>
                        <th> 
                            <button 
                                className="sort"
                                id="amount"
                                onClick={handleClick}>
                                tot. {currency}
                                <BiSortAlt2 size={20} style={{pointerEvents: 'none', marginLeft: '5px'}}/>
                            </button>
                        </th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                        {   sortedItems.map((expense) => {
                                return (
                                    <Expense 
                                        key={expense.expenseId} 
                                        participants={participants} 
                                        expenseDetails={expense} 
                                        updateData={updateData} 
                                        setUpdateData={setUpdateData} 
                                        tripId={tripId}/>
                                )
                            })
                        }
                    </tbody>
            </table>
        </Wrapper>
)
}

const Wrapper = styled.div`
    table {
        margin-top: 10px; 
        margin-bottom: 30px; 
        width: calc(85vw + 40px); 
        font-family: var(--font-raleway);

        tr {
            height: 40px; 
            background-color: white;  
            color: black; 
            border: solid grey 2px;  
            border-radius: 10px;     
        }

        td, th {
            padding-left: 5px; 
            padding-right: 0px; 
            display: table-cell; 
            vertical-align: middle; 
        }

        th, .sort {
            text-align: left;
            font-family: var(--font-carterone); 
            color: #fcfbe3;
            font-weight: 900; 
            font-size: 1em; 
            background-color: #17918b; 
            

            :hover {
                cursor: pointer; 
            }
        }

        button {
            background: transparent; 
            border: none; 

            :hover {
                cursor: pointer; 
            }    
        }

        .sort {
            display: flex; 
            flex-direction: row; 
            justify-content: center; 
            align-items: center; 
            padding-left: 0px; 

        .delete {
            background: transparent; 
            border: none; 
            :hover {
                cursor: pointer; 
            }    
        } 
    }

    input, select {
        font-family: var(--font-raleway); 
        background: transparent;
        border: none;
    }

    input[type="number"] {
        width: 50px; 
    }
`; 

export default SortableTable 