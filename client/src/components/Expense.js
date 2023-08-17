import { FiTrash2, FiChevronsDown, FiChevronsUp } from 'react-icons/fi';
import EditableField from './EditableField';
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react';
import Distribution from './Distribution';
import styled from 'styled-components'
import { CircularProgress } from '@mui/material';

const Expense = ( {expenseDetails, updateData, setUpdateData, tripId, participants} ) => {

    const { name, category, date, amount, expenseId, paidBy, distribution } = expenseDetails; 
    const [ isChecked, setIsChecked ] = useState(() => {
        if (!distribution) {
            return null
        }
        let arr = []; 
        distribution.forEach((item, i) => {
            if (item === "0") {
                arr[i] = false;
            } else {
                arr[i] = true;
            }
        })
        return arr; 
    }) 
    const [formData, setFormData] = useState({
        amount: amount, distribution: distribution
    })
    const [isViewing, setIsViewing] = useState(false)
    const { getAccessTokenSilently } = useAuth0(); 
    
    const handleDelete = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/deleteExpense/${tripId}/${expenseId}`, {
                method: "DELETE",
                headers : {
                    "authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
                setUpdateData(data)
                console.log(data)
        } catch (error) {
        console.log(error);
        }
    }

    const handleUpdate = async () => {
        if (formData.distribution !== distribution) {
            patchExpense(); 
        }
    }

    const patchExpense = async () => {
        setUpdateData("loading"); 
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
                setUpdateData(data); 
                setIsViewing(false);   
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleView = () => {
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
                        expenseId={expenseId} 
                        setUpdateData={setUpdateData}/>
                </td>
                <td>
                    <EditableField 
                        initialValue={category} 
                        inputType="select" 
                        field="category" 
                        tripId={tripId} 
                        expenseId={expenseId} 
                        setUpdateData={setUpdateData}/>
                </td>
                { paidBy && 
                <td>{paidBy} </td>
                }
                <td>
                    <EditableField 
                        initialValue={date} 
                        inputType="date" 
                        field="date" 
                        tripId={tripId} 
                        expenseId={expenseId} 
                        setUpdateData={setUpdateData}/>
                </td>
                <td>
                    <EditableField 
                        setFormData={setFormData} 
                        formData={formData} 
                        initialValue={amount} 
                        inputType="number" 
                        field="amount" 
                        tripId={tripId} 
                        expenseId={expenseId} 
                        setUpdateData={setUpdateData}/>
                </td>
                <td>
                    <button className="delete" onClick={handleDelete}><FiTrash2/></button>
                    { paidBy && 
                    <button className="view" onClick={handleView} >{isViewing? <FiChevronsUp/> : <FiChevronsDown/>}</button>
                    }
                </td>
            </tr>
            {isViewing && 
            <tr style={{backgroundColor: "#fcfbe3"}}>
                <td colSpan="6">
                    <Div>
                        <Distribution 
                            formData={formData} 
                            setFormData={setFormData} 
                            participants={participants} 
                            isChecked={isChecked} 
                            setIsChecked={setIsChecked}/>
                        <div>
                            <button className="update" onClick={handleUpdate}>
                                {updateData === "loading" 
                                    ? <CircularProgress style={{'color': 'white'}} size="1em" /> 
                                    : <span>Save New Distribution</span>}
                            </button>
                        </div>
                    </Div>
                </td>
            </tr>}
        </>
    )
}

const Div = styled.div`

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
        margin-right: 20px; 
        span {
            margin-left: 5px; 
        }
    }

button:hover {
    cursor: pointer; 
}

display: flex;
flex-direction: row; 
align-items: flex-end; 
justify-content: space-between;

`; 

export default Expense;