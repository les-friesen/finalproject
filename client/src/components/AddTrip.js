import { useState, useContext } from "react";
import styled from "styled-components"; 
import { FiFilePlus, FiFileMinus, FiTrash2 } from "react-icons/fi"; 
import { useAuth0 } from "@auth0/auth0-react";
import { currency_list } from "../data";
import { CircularProgress } from "@mui/material";
import { ReloadContext } from "./reloadContext";

// Component for adding a new trip

const AddTrip = () => {

    const { setReload, isLoading, setIsLoading } = useContext(ReloadContext);
    
    // State for opening/closing Add Trip form. 
    const [creatingTrip, setCreatingTrip] = useState(false); 

    // Initializing formData state with empty array of participants. 
    const [formData, setFormData] = useState({ participants : []}); 

    // State for adding a new participant. 
    const [addParticipant, setAddParticipant] = useState(""); 

    const { user, getAccessTokenSilently } = useAuth0(); 

    // Function for opening/closing Add Trip form. 
    const handleCreate = () => {
        if (creatingTrip) {
            setFormData({ participants : []})
        }
        setCreatingTrip(!creatingTrip)
    }

     // Function for handling changes when typing in a participant's name. 
    const handleParticipantChange = (e) => {
        setAddParticipant(e.target.value)
    }

    // Function for adding a new participant. Will push the new name to the Participants
    // array in the formData state. 
    const handleAddParticipant = () => {
        addParticipant.length > 0 && 
        setFormData({
            ...formData,
            participants: [ ...formData.participants, addParticipant]

        })
        setAddParticipant(""); 
    }

    // Function for deleting a participant. 
    const deleteParticipant = (index) => {
        let newArray = [...formData.participants]
        newArray.splice(index, 1)
        setFormData({
            ...formData,
            participants : newArray
        })
    }

    // Function for changes to formData fields. 
    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
            userId: user.sub
            })
    }

    // Function for adding a trip when form is completed. 
    const AddTrip = async () => {
        setIsLoading("loadingtrip")
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`https://travel-tracker-server.vercel.app/addTrip`, {
                method: "POST",
                headers : {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData)
                })
            const data = await response.json();
                setIsLoading("");
                setReload(data); 
                setFormData({ participants : []});
                setCreatingTrip(false); 
        } catch (error) {
            console.log(error);
            setIsLoading("");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
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
                            <input 
                                required 
                                placeholder='e.g. "Europe 2022"'
                                className="textInput" 
                                type="text" 
                                maxLength="40" 
                                id="tripName" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="startDate">Start Date </label>
                            <input 
                                required 
                                className="dateInput" 
                                type="date" 
                                id="startDate" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="endDate">End Date </label>
                            <input 
                                required 
                                className="dateInput" 
                                type="date" 
                                id="endDate" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="budget">Budget </label>
                            <input 
                                required 
                                className="numberInput" 
                                type="number" 
                                id="budget" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="currency">Currency </label>
                            <select 
                                required 
                                className="form-select" 
                                id="currency" 
                                name="currency" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)}>
                                    <optgroup>
                                        <option value=''>Select currency</option>
                                            { currency_list.map((item) => {
                                                    return (
                                                        <option key={item.code} value={item.code}>
                                                            {item.code} - {item.name}
                                                        </option>
                                                    )
                                                })
                                            }
                                    </optgroup>
                            </select>
                        </div>
                        <div className="field">
                            <button 
                                onClick={handleAddParticipant} 
                                disabled={formData.participants?.length >= 6 ? true : false} 
                                className="addParticipant" 
                                type="button">
                                    Add participant
                            </button>
                            <input 
                                className="textInput" 
                                maxLength={30} 
                                placeholder="Enter name" 
                                value={addParticipant} 
                                type="text" 
                                name="participant" 
                                onChange={(e) => handleParticipantChange(e)}>
                            </input>   
                        </div>
                        <div className="participantList">
                            <p className="participant-title"> Participants ({formData.participants?.length}/6) </p>
                            { formData.participants?.map((participant, index) => {
                                return (
                                    <div className="participant" key={index}>
                                    <p>{participant}</p>
                                    <button type="button" onClick={() => deleteParticipant(index)}className="trash"><FiTrash2 size={15}/></button>
                                    </div>
                                )
                            })}
                        
                        </div>
                            <p className="disclaimer">
                                Add up to 6 participants to split expenses. 
                                <br/><br/> 
                                Note that the participant list and the currency chosen to balance the trip can not be edited after creating the trip
                            </p>
                        <div className="submitButton">
                            <button 
                                type="submit">
                                    {isLoading === "loadingtrip" 
                                        ? <CircularProgress style={{'color': 'white'}} size="1em" />
                                        : <><FiFilePlus/> <span>Create Trip </span></>
                                    }
                            </button>
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
        width: 300px;
        border-radius: 5px;  
        font-family: var(--font-carterone)
    }

    input, select, optgroup {
        font-family: var(--font-raleway)
    }

    .field {
        width: 260px;  
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

    .participantList {

        .participant-title {
            font-family: var(--font-carterone);
            margin-left: 10px; 
        }

        .participant {
            font-family: var(--font-poppins); 
            margin-left: 10px; 
            margin-top: 5px; 
            display: flex;
            flex-direction: row; 
            align-items: center; 
            justify-content: space-between; 
        }

    .trash {
            margin-right: 30px; 
            height: 25px; 
            width: 25px; 
            border: none; 
        
            button : hover {
                cursor: pointer; 
            }
        } 
    }

    .addParticipant {
        width: 100px; 
        height: 26px; 
        font-size: 0.7em; 
    }

    .form-select,  {
        width: 120px;
    }

    .disclaimer {
        padding: 10px;  
        margin-top: 10px; 
        font-style: italic;
        color: green; 
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
`

export default AddTrip; 