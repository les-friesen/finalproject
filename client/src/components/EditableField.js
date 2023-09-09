import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth0 } from "@auth0/auth0-react";
import { useContext } from 'react';
import { ReloadContext } from './reloadContext';

// A component for making fields editable in the Trip, TripDetails and Expense components. 
const EditableField = ({ field, inputType, initialValue, tripId, expenseId, formData, setFormData, participants }) => {
    
    const { reload, setReload } = useContext(ReloadContext); 

    // State for whether someone is actively making edits or not. 
    const [isEditing, setIsEditing] = useState(false);

    // State for the value of the field. 
    const [inputValue, setInputValue] = useState(initialValue);
    const { getAccessTokenSilently } = useAuth0(); 

    // When someone clicks on a field, editing state will change and an input/select field will appear. 
    const handleClick = () => {
        setIsEditing(true); 
    }

    // Handles any changes to the input/select field. 
    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    // Function for saving any changes to a Trip to the database. 
    const patchTrip = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`https://traveltracker-server.onrender.com/editTrip/${tripId}`, {
                method: "PATCH",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ [field] : inputValue})
                })
            const data = await response.json();
            setReload({data, field});
        } catch (error) {
            console.log(error);
        }
    }

    // Function for saving any changes to an Expense to the database. 
    const patchExpense = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`https://traveltracker-server.onrender.com/editExpense/${tripId}/${expenseId}`, {
                method: "PATCH",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ [field] : inputValue})
                })
            const data = await response.json();
                setReload(data); 
                if (formData) {
                    setFormData({...formData, amount: inputValue})
                }
                
        } catch (error) {
            console.log(error.message);
        }
    }

    // Function for calling the patchTrip/patchExpense functions. Will be called when 
    // someone clicks away from a field they are editing. 
    // If no change was made, the function will not be called. 
    // If there is no expenseId, it will edit a trip and not an expense. 

    const handleBlur = async () => {
        setIsEditing(false);
        if (inputValue !== initialValue && !expenseId) {
            patchTrip();
        }
        if (inputValue !== initialValue && expenseId) {
            patchExpense();
        }
        
    } 
    
    return (
        <Span onClick={handleClick}>
            {isEditing && field === "category" 
            ? <select autoFocus className="form-select" id="category" name="category" onChange={handleChange} onBlur={handleBlur}>
                <option value=''>Select category</option>
                <option value="Groceries">Groceries</option>
                <option value="Restaurants/Bars">Restaurants/Bars</option>
                <option value="Transportation">Transportation</option>
                <option value="Accommodations">Accommodations</option>
                <option value="Health/Hygiene">Health/Hygiene</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Shopping">Shopping</option>
                <option value="Other">Other</option>
            </select>
            : isEditing && field === "paidBy"
            ?  <select autoFocus className="form-select" id="paidBy" name="paidBy" onChange={handleChange} onBlur={handleBlur}>
                    <option value="">Select participant</option>
                            { participants.map((participant, index) => {
                                return (
                                    <option key={index} value={participant}>{participant}</option>
                                )
                            })
                            }
                </select>
            : isEditing
            ? <input
                className="input"
                autoFocus
                type={inputType}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={inputType === "text" ? "40" : null}
            />
            : <span className="text">{inputValue}</span>
            }
        </Span>
    );
};

const Span = styled.span`
`
; 

export default EditableField;