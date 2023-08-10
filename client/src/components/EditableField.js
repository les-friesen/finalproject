import React, { useState } from 'react';
import styled from 'styled-components';

const EditableField = ({ field, inputType, initialValue, tripId, setUpdateData, expenseId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue);

    const handleClick = () => {
        setIsEditing(true); 
    }

    const handleChange = (event) => {
        setInputValue(event.target.value);
    }

    const handleBlur = () => {
        setIsEditing(false);
        if (inputValue !== initialValue && !expenseId) {
        fetch(`/editTrip/${tripId}`, {
            method: "PATCH",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
                },
            body: JSON.stringify({ [field] : inputValue})
            })
                .then(res => res.json())
                .then((data) => {
                    setUpdateData(data)
                    console.log(data)
                })
                .catch((error) => {
                    console.log(error); 
                })
        }

        if (inputValue !== initialValue && expenseId) {
            fetch(`/editExpense/${tripId}/${expenseId}`, {
                method: "PATCH",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                    },
                body: JSON.stringify({ [field] : inputValue})
                })
                    .then(res => res.json())
                    .then((data) => {
                        setUpdateData(data)
                        console.log(data)
                    })
                    .catch((error) => {
                        console.log(error); 
                    })
            }
        }
    
    return (
        <Span onClick={handleClick}>
            {isEditing && field === "category" 
            ? <select autofocus className="form-select" id="category" name="category" onChange={handleChange} onBlur={handleBlur}>
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
                autoFocus
                type={inputType}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                maxlength={inputType === "text" ? "40" : null}
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