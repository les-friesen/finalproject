// Shows overall budget, what you've spent so far
// Displays all trip details

// Displays all expenses. At top (or bottom) add button to add expense 
// After fetching data based on tripId, check to make sure userId of the trip
// matches the user.sub in the Auth0Provider. If not a match - navigate to home page

// If data is fetched before user confirmed, it's rerouting back to homepage :S
// Features to add: Sort data by different fields. Add custom categories?


import { useAuth0 } from "@auth0/auth0-react";
import beach1 from "../assets/beach1.jpg"
import styled from 'styled-components'
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import EditableField from "./EditableField";
import Expense from "./Expense";
import AddExpense from "./AddExpense";

const TripDetails = () => {

    const { tripId } = useParams(); 
    const { user } = useAuth0();
    const [ tripData, setTripData ] = useState(); 
    const [ updateData, setUpdateData] = useState(); 
    const navigate = useNavigate(); 

    useEffect(() => {
        fetch(`/getTrip/${tripId}`)
            .then(res => res.json())
            .then((data) => {
                if (!data.data) {
                    navigate("/") }
                else {
                    setTripData(data.data) 
                }
            })
            .catch((err) => {
                console.log(err); 
        }) 
    }, [updateData])

    const calcTotal = (array) => {
        let total = 0;
        array.forEach((item) => {
            total += +item.amount
        })
        return total.toFixed(2)
    }
    
    const calcPercent = (amount, budget) => {
        const percent = (+amount/+budget)*100
        return `${percent.toFixed(1)}%`
    }

return (
    <Background>
        {  !tripData
        ?   <ProgressDiv>
                <CircularProgress /> 
            </ProgressDiv>
        :   user?.sub !== tripData.userId 
        ?   navigate("/")
        :   <>
                <div className="body">
                    <div className="title">
                        <EditableField inputType="text" field="tripName" initialValue={tripData.tripName} tripId={tripData._id} setUpdateData={setUpdateData}/>
                    </div>
                    <div>
                        <EditableField inputType="date" field="startDate" initialValue={tripData.startDate} tripId={tripData._id} setUpdateData={setUpdateData}/>
                        <span> to </span>
                        <EditableField inputType="date" field="endDate" initialValue={tripData.endDate} tripId={tripData._id} setUpdateData={setUpdateData} />
                    </div>
                    <div> 
                        <span>Total Budget: </span> 
                        <EditableField inputType="number" field="budget" initialValue={tripData.budget} tripId={tripData._id} setUpdateData={setUpdateData} />
                        <span>  {tripData.currency}</span>
                    </div>
                    <div>
                        You have spent {calcTotal(tripData.expenses)} {tripData.currency} so far, which is {calcPercent(calcTotal(tripData.expenses), tripData.budget)} of your allotted budget. 
                    </div> 
                    <div>This is the trip details page. You have {tripData.expenses.length} expenses so far</div>
                </div>
                <AddExpense updateData={updateData} setUpdateData={setUpdateData} tripId={tripData._id} baseCurrency={tripData.currency}/>
                { tripData.expenses.length > 0 && 
                <table>
                    <tbody>
                    <tr>
                        <th>name</th>
                        <th>category</th>
                        <th>date</th>
                        <th>amount - {tripData.currency}</th>
                        <th>delete</th>
                    </tr>
                    {
                        tripData.expenses.map((expense) => {
                            return (
                                <Expense key={expense.expenseId} expenseDetails={expense} updateData={updateData} setUpdateData={setUpdateData} tripId={tripData._id}/>
                            )
                        })
                    }
                    </tbody>
                </table>
                }
            </>
        }
    </Background>
)
}

const ProgressDiv = styled.div`
width: 100vw;
height: 100vh;
display: flex;
align-items: center;
justify-content: center; 
`

const Background = styled.div`
background: transparent url(${beach1}) no-repeat center; 
background-position: fixed; 
background-size: cover; 
background-attachment: fixed; 
display: flex; 
flex-direction: column; 
align-items: center; 
min-height: 100vh; 

.body {
    margin-top: 10px; 
    display: flex; 
    flex-direction: column; 
    background-color: #fcfbe3;
    opacity: 0.75; 
    width: 85vw;
    border-radius: 5px;  
    
    div, p {
        padding-left: 20px; 
        margin-top: 5px; 
        margin-bottom: 5px; 
        font-family: var(--font-raleway);
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
}

table {
    margin-top: 10px; 
    margin-bottom: 30px; 
    width: 85vw;
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
        padding-right: 5px; 
        display: table-cell; 
        vertical-align: middle; 
    }

    th {
        text-align: left;
        font-family: var(--font-carterone); 
        color: #fcfbe3;
        font-weight: 900; 
        background-color: #17918b; 
    }

    button {
        background: transparent; 
        border: none; 

        :hover {
            cursor: pointer; 
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
}
`

export default TripDetails; 