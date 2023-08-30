import { FiTrash2, FiChevronsDown, FiChevronsUp } from 'react-icons/fi';
import EditableField from './EditableField';
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useContext } from 'react';
import Distribution from './Distribution';
import styled from 'styled-components'
import { CircularProgress } from '@mui/material';
import { ReloadContext } from './reloadContext';

const Expense = ( {expenseDetails, tripId, participants} ) => {

    const { setReload, isLoading, setIsLoading } = useContext(ReloadContext); 
    const { name, category, date, amount, expenseId, paidBy } = expenseDetails; 
    const [ isChecked, setIsChecked ] = useState(() => {
        if (!expenseDetails.distribution) {
            return null
        }
        let arr = []; 
        expenseDetails.distribution.forEach((item, i) => {
            if (item === "0") {
                arr[i] = false;
            } else {
                arr[i] = true;
            }
        })
        return arr; 
    }) 
    const [formData, setFormData] = useState({
        amount: amount, distribution: expenseDetails.distribution
    })
    const [isViewing, setIsViewing] = useState(false)
    const { getAccessTokenSilently } = useAuth0(); 
    
    const handleDelete = async (value) => {
        setIsLoading(value);
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/deleteExpense/${tripId}/${expenseId}`, {
                method: "DELETE",
                headers : {
                    "authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
                setReload(data); 
                setIsLoading("");
        } catch (error) {
        console.log(error);
        setIsLoading("");
        }
    }

    const patchExpense = async () => {
      
        setIsLoading("loadingdistribution");
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/editExpense/${tripId}/${expenseId}`, {
                method: "PATCH",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ distribution : formData.distribution})
                })
            const data = await response.json();
                setReload(data);  
        } catch (error) {
            console.log(error.message);
            setIsLoading("");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        patchExpense(); 
    }

    const handleView = () => {
        if (isViewing) {
            setFormData({amount: amount, distribution: expenseDetails.distribution})
            setIsChecked(() => {
                if (!expenseDetails.distribution) {
                    return null
                }
                let arr = []; 
                expenseDetails.distribution.forEach((item, i) => {
                    if (item === "0") {
                        arr[i] = false;
                    } else {
                        arr[i] = true;
                    }
                })
                return arr; 
            }) 
        }
        setIsViewing(!isViewing)
    }

    return (
        <>
            <tr>
                <td>
                    <EditableField 
                        initialValue={name} 
                        inputType="text" 
                        field="name" 
                        tripId={tripId} 
                        expenseId={expenseId}/>
                </td>
                <td>
                    <EditableField 
                        initialValue={category} 
                        inputType="select" 
                        field="category" 
                        tripId={tripId} 
                        expenseId={expenseId}/>
                </td>
                { paidBy && 
                <td>
                    <EditableField 
                        initialValue={paidBy}
                        inputType="select"
                        field="paidBy"
                        tripId={tripId}
                        expenseId={expenseId}
                        participants={participants}/>
                </td>
                }
                <td>
                    <EditableField 
                        initialValue={date} 
                        inputType="date" 
                        field="date" 
                        tripId={tripId} 
                        expenseId={expenseId}/>
                </td>
                <td>
                    <EditableField 
                        setFormData={setFormData} 
                        formData={formData} 
                        initialValue={amount} 
                        inputType="number" 
                        field="amount" 
                        tripId={tripId} 
                        expenseId={expenseId}/>
                </td>
                <td>
                    <button
                        className="delete" 
                        id={expenseId} 
                        disabled={ isLoading === expenseId ? true : false}
                        onClick={(e) => handleDelete(e.currentTarget.id)}>
                        {isLoading === expenseId
                                    ? <CircularProgress style={{'color': 'black'}} size="1em" /> 
                                    : <FiTrash2 /> } 
                    </button>
                    { paidBy && 
                    <button className="view" onClick={handleView} >{isViewing? <FiChevronsUp/> : <FiChevronsDown/>}</button>
                    }
                </td>
            </tr>
            {isViewing && 
            <tr style={{backgroundColor: "#fcfbe3"}}>
                <td colSpan="6">
                    <form onSubmit={e => handleSubmit(e)}>  
                    <Div>
                        <Distribution 
                            formData={formData} 
                            setFormData={setFormData} 
                            participants={participants} 
                            isChecked={isChecked} 
                            setIsChecked={setIsChecked}/>
                        <div>
                            <button 
                                id={expenseId} 
                                disabled={ isLoading === "loading" ? true : JSON.stringify(formData.distribution) === JSON.stringify(expenseDetails.distribution) ? true : false }
                                className="update">
                                    {isLoading === "loadingdistribution"
                                        ? <CircularProgress style={{'color': 'white'}} size="1em" /> 
                                        : <span>Save New Distribution</span>}
                            </button>
                        </div>
                        <div className="empty">
                        </div>
                    </Div>
                    </form>
                </td>
            </tr>}
        </>
    )
}

const Div = styled.div`
    display: flex;
    flex-direction: row; 
    align-items: flex-end; 
    justify-content: space-around;

    .update {
        background-color: #17918b; 
        border: none;
        border-radius: 10px; 
        height: 30px; 
        width: 160px; 
        color: #fcfbe3; 
        font-family: var(--font-poppins);
        font-size: 0.8em;  
        display: flex;
        justify-content: center; 
        align-items: center; 
        margin-bottom: 20px;  
        span {
            margin-left: 5px; 
        }
    }

    button:hover {
        cursor: pointer; 
    }

    button:disabled {
        pointer-events: none;
        opacity: 0.6;
    }

    .empty {
        width: 250px;  
    }
`; 

export default Expense;