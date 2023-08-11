import { useState } from "react";
import styled from "styled-components"; 
import { FiFilePlus, FiFileMinus } from "react-icons/fi"; 
import { useAuth0 } from "@auth0/auth0-react";
import { currency_list } from "../data";
import { CircularProgress } from "@mui/material";

const AddTrip = ( {updateData, setUpdateData} ) => {

    const [creatingTrip, setCreatingTrip] = useState(false); 
    const [formData, setFormData] = useState(); 
    const { user, getAccessTokenSilently } = useAuth0(); 

    const handleCreate = () => {
        if (creatingTrip) {
            setFormData()
        }
        setCreatingTrip(!creatingTrip)
    }

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
            userId: user.sub
            })
    }

    const AddTrip = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/addTrip`, {
                method: "POST",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
                })
            const data = await response.json();
                setUpdateData(data);
                setFormData();
                setCreatingTrip(false); 
        } catch (error) {
            console.log(error);
        }
        }

    const handleSubmit = (e) => {
        e.preventDefault();
        setUpdateData("loading");
        AddTrip(); 
    }

    return (
        <Wrapper> 
            <button onClick={handleCreate}>{creatingTrip ? <FiFileMinus /> : <FiFilePlus /> } <span>{creatingTrip ? "Cancel" : "Create New Trip"}</span></button>
            { creatingTrip &&
            <div className="form">
                <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="tripName">Trip Name </label>
                            <input required placeholder='e.g. "Europe 2022"'className="textInput" type="text" maxLength="40" id="tripName" onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="startDate">Start Date </label>
                            <input required className="dateInput" type="date" id="startDate" onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="endDate">End Date </label>
                            <input required className="dateInput" type="date" id="endDate" onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="budget">Budget </label>
                            <input required className="numberInput" type="number" id="budget" onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="currency">Currency </label>
                            <select required className="form-select" id="currency" name="currency" onChange={(e) => handleChange(e.target.id, e.target.value)}>
                                    <optgroup>
                                        <option value=''>Select currency</option>
                                            { currency_list.map((item) => {
                                                    return (
                                                        <option value={item.code}>{item.code} - {item.name}</option>
                                                    )
                                                })
                                            }
                                    </optgroup>
                            </select>
                        </div>
                        <p className="disclaimer">Once your trip is created, all fields can be edited except base currency </p>
                        <div className="submitButton">
                            <button>{updateData === "loading" ? <CircularProgress style={{'color': 'white'}} size="1em" /> : <><FiFilePlus/> <span>Create Trip </span></>}</button>
                        </div>
                </form>
            </div>
            }
        </Wrapper>
)
}

const Wrapper = styled.div`

display: flex;
flex-direction: column;
justify-content: center;
align-items: center; 

.form {
    margin-top: 10px; 
    margin-bottom: 20px;  
    padding: 10px 20px 10px 20px; 
    display: flex; 
    flex-direction: column; 
    justify-content: center; 
    align-items: center; 
    background-color: #fcfbe3;
    opacity: 0.75; 
    width: 260px;
    border-radius: 5px;  
    font-family: var(--font-carterone)
}

input, select, optgroup {
    font-family: var(--font-raleway)
}

.field {
    width: 210px;  
    margin: 0px 10px 10px 10px; 
    display: flex; 
    flex-direction: row; 
    justify-content: space-between; 
    align-items: center; 
}

.numberInput, .textInput {
    width: 112px; 
}

.dateInput {
    width: 115px; 
}

.form-select,  {
    width: 120px;
}

.disclaimer {
    font-style: italic;
    color: red; 
    margin-bottom: 10px; 
    font-weight: bold; 
}

.submitButton {
    display: flex;
    justify-content: center; 
    align-items: center; 
}

button {
    background-color: #17918b; 
    border: none;
    border-radius: 10px; 
    height: 40px; 
    width: 200px; 
    color: #fcfbe3; 
    font-family: var(--font-poppins);
    font-size: 1em;  
    display: flex;
    justify-content: center;
    align-items: center; 
    span {
        margin-left: 5px; 
    }
}

button:hover {
    cursor: pointer; 
}
`; 

export default AddTrip; 