// If data is fetched before user confirmed, it's rerouting back to homepage :S
// Add custom categories?

import { useAuth0 } from "@auth0/auth0-react";
import beach1 from "../assets/beach1.jpg"
import styled from 'styled-components'
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { CircularProgress } from "@mui/material";
import EditableField from "./EditableField";
import AddExpense from "./AddExpense";
import { calcPercent, calcTotal, sortTableData } from "../helpers";
import SortableTable from "./SortableTable";

const TripDetails = () => {

    const { tripId } = useParams(); 
    const { user } = useAuth0();
    const [ tripData, setTripData ] = useState(); 
    const [ updateData, setUpdateData] = useState(); 
    const navigate = useNavigate(); 
    const [sortedItems, setSortedItems] = useState();
    const [direction, setDirection] = useState()
    const [sortBy, setSortBy] = useState()

    useEffect(() => {
        fetch(`/getTrip/${tripId}`)
            .then(res => res.json())
            .then((data) => {
                if (!data.data) {
                    navigate("/") }
                else {
                    setTripData(data.data)
                    if (direction && sortBy) {
                        setSortedItems(sortTableData(data.data.expenses, {sortBy, direction}))
                    } else {
                        setSortedItems(data.data.expenses)
                    }
                }
            })
            .catch((err) => {
                console.log(err); 
        }) 
    }, [updateData])

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
                <AddExpense 
                    updateData={updateData} 
                    setUpdateData={setUpdateData} 
                    tripId={tripData._id} 
                    baseCurrency={tripData.currency}/>
                { tripData.expenses.length > 0 && 
                <SortableTable 
                    direction={direction} 
                    setDirection={setDirection} 
                    setSortBy={setSortBy} 
                    sortedItems={sortedItems} 
                    setSortedItems={setSortedItems} 
                    expenses={tripData.expenses} 
                    currency={tripData.currency} 
                    updateData={updateData} 
                    setUpdateData={setUpdateData} 
                    tripId={tripData._id}/>
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
`

export default TripDetails; 