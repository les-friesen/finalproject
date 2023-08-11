import styled from "styled-components"; 
import { FiTrash2, FiFilePlus } from "react-icons/fi";
import EditableField from "./EditableField";
import { Link } from "react-router-dom";
import { calcPercent, calcTotal } from "../helpers";
import ProgressBar from "./ProgressBar";
import { useAuth0 } from "@auth0/auth0-react";

const Trip = ( {tripData, setUpdateData} ) => {

    const { tripName, startDate, endDate, currency, expenses, budget, _id } = tripData; 
    const { getAccessTokenSilently } = useAuth0(); 
    const total = calcTotal(expenses);

    const handleDelete = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/deleteTrip/${_id}`, {
                method: "DELETE",
                headers : {
                    "authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
                setUpdateData(data)
        } catch (error) {
        console.log(error);
        }
    }

    return (
        <Wrapper>
            <div className="title">
                <EditableField  
                    inputType="text" 
                    field="tripName" 
                    initialValue={tripName} 
                    tripId={_id} 
                    setUpdateData={setUpdateData}/>
            </div>
            <div className="paragraph">
                <EditableField 
                    inputType="date" 
                    field="startDate" 
                    initialValue={startDate} 
                    tripId={_id} 
                    setUpdateData={setUpdateData}/>
                <span> to </span>
                <EditableField 
                    inputType="date" 
                    field="endDate" 
                    initialValue={endDate} 
                    tripId={_id} 
                    setUpdateData={setUpdateData}/>
            </div>
            <div className="paragraph"> 
                <span>Total Budget: </span> 
                <EditableField 
                    inputType="number" 
                    field="budget" 
                    initialValue={budget} 
                    tripId={_id} 
                    setUpdateData={setUpdateData} />
                <span>  {currency}</span>
            </div>
            <div className="paragraph">
                <p> You have spent {total} {currency} so far, which is {calcPercent(total, budget)}% of your allotted budget. </p>
            </div>
            <ProgressBar completed={calcPercent(total, budget)} />
            <div className="lastRow">
                <div className="empty"></div>
                <div className="expenseButton">
                    <StyledLink to={`/${_id}`}><button><FiFilePlus/> <span>Add/Edit Expenses</span></button></StyledLink>
                </div>
                <div className="buttonWrapper">
                    <button onClick={handleDelete}><FiTrash2 size={20}/></button>
                </div>
            </div>
        </Wrapper>
    )
}

const StyledLink = styled(Link)`
text-decoration: none; 
`

const Wrapper = styled.div`
margin: 20px; 
padding: 20px 20px 10px 20px; 
display: flex; 
flex-direction: column; 
background-color: #fcfbe3;
opacity: 0.75; 
width: 85vw;
border-radius: 5px;  

.paragraph, p {
    margin-top: 5px; 
    margin-bottom: 5px; 
}

input {
    font-family: var(--font-raleway); 
    background: transparent;
    border: none;
}

input[type="number"] {
    width: 50px; 
}

.title input {
    font-size: 0.9em;  
}

.number {
    width: 40px; 
}

.title {
    font-size: 2em; 
}

.lastRow {
    display: flex; 
    flex-direction: row; 
    justify-content: space-between; 
}

.empty {
    width: 40px; 
}

.buttonWrapper {
    display: flex;
    justify-content: flex-end; 

    button {
        background-color: #fcfbe3;
        width: 40px; 
        border: none; 
    }

    button : hover {
        cursor: pointer; 
    }
}

.expenseButton {
    margin-bottom: 0px; 
    display: flex;
    flex-direction: row;
    justify-content: center;

    button {
        text-decoration: none; 
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
}
`; 

export default Trip; 