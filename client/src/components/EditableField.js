import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth0 } from "@auth0/auth0-react";

const EditableField = ({ field, inputType, initialValue, tripId, setUpdateData, expenseId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue);
    const { getAccessTokenSilently } = useAuth0(); 

    const handleClick = () => {
        setIsEditing(true); 
    }

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const patchTrip = async () => {
    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`/editTrip/${tripId}`, {
            method: "PATCH",
            headers : {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ [field] : inputValue})
            })
        const data = await response.json();
        setUpdateData({data, field});
    } catch (error) {
        console.log(error);
    }
    }

    const patchExpense = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/editExpense/${tripId}/${expenseId}`, {
                method: "PATCH",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ [field] : inputValue})
                })
            const data = await response.json();
                setUpdateData(data);
        } catch (error) {
            console.log(error.message);
        }
    }

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
                <option value="Entertainment/Sightseeing">Entertainment/Sightseeing</option>
                <option value="Souvenirs/Gifts">Souvenirs/Gifts</option>
                <option value="Other">Other</option>
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