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
import ProgressBar from "./ProgressBar";

const TripDetails = () => {

    const { tripId } = useParams(); 
    const { getAccessTokenSilently } = useAuth0();
    const [ tripData, setTripData ] = useState(); 
    const [ updateData, setUpdateData] = useState(); 
    const navigate = useNavigate(); 
    const [sortedItems, setSortedItems] = useState();
    const [direction, setDirection] = useState("ascending")
    const [sortBy, setSortBy] = useState("date")

    const fetchTrip = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/getTrip/${tripId}`, 
                { headers : {
                    "authorization" : `Bearer ${token}`
                }}
                )
            const data = await response.json();
            if (data.status !== 200) {
                navigate("/")
            }
            else {
                setTripData(data.data);
                if (direction && sortBy) {
                    setSortedItems(sortTableData(data.data.expenses, {sortBy, direction}))
                } else {
                    setSortedItems(data.data.expenses)
                }
            } 
        } catch (error) {
            console.log(error);
            navigate("/")
        }
    };
    
    useEffect(() => {
        fetchTrip(); 
    }, [updateData])

return (
    <Background>
        {  !tripData 
        ?   <ProgressDiv>
                <CircularProgress /> 
            </ProgressDiv>  
        :   <>
                <div className="body">
                    <div className="title">
                        <EditableField 
                            inputType="text" 
                            field="tripName" 
                            initialValue={tripData.tripName} 
                            tripId={tripData._id} 
                            setUpdateData={setUpdateData}/>
                    </div>
                    <div className="field">
                        <EditableField 
                            inputType="date" 
                            field="startDate" 
                            initialValue={tripData.startDate} 
                            tripId={tripData._id} 
                            setUpdateData={setUpdateData}/>
                        <span> to </span>
                        <EditableField 
                            inputType="date" 
                            field="endDate" 
                            initialValue={tripData.endDate} 
                            tripId={tripData._id} 
                            setUpdateData={setUpdateData}/>
                    </div>
                    {tripData.participants?.length > 1 && 
                    <div className="paragraph">
                    <p> <span>Participants: </span>
                    {tripData.participants?.map((participant, index) => {
                        return (
                            <span key={index}>
                            <span>{participant}</span> 
                            <span>{index + 1 === tripData.participants?.length ? <span>. </span> : <span>, </span>}</span>
                            </span>)
                        })}
                    </p>
                    </div>}
                    <div className="field"> 
                        <span>Total Budget: </span> 
                        <EditableField 
                            inputType="number" 
                            field="budget" 
                            initialValue={tripData.budget} 
                            tripId={tripData._id} 
                            setUpdateData={setUpdateData} />
                        <span>  {tripData.currency}</span>
                    </div>
                    <div className="field">
                        You have spent {calcTotal(tripData.expenses)} {tripData.currency} so far, which is {calcPercent(calcTotal(tripData.expenses), tripData.budget)}% of your allotted budget. 
                    </div> 
                    <ProgressBar completed={calcPercent(calcTotal(tripData.expenses), tripData.budget)} />
                    <div className="field">This is the trip details page. You have {tripData.expenses.length} expenses so far</div>
                </div>
                <AddExpense 
                    updateData={updateData} 
                    setUpdateData={setUpdateData} 
                    tripId={tripData._id} 
                    baseCurrency={tripData.currency}
                    participants={tripData.participants ? tripData.participants : []}/>
                { tripData.expenses.length > 0 && 
                <SortableTable 
                    participants={tripData.participants}
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
        margin-top: 40px; 
        display: flex; 
        flex-direction: column; 
        background-color: #fcfbe3;
        opacity: 0.75; 
        width: 85vw;
        border-radius: 5px;  
        padding: 20px; 
        font-family: var(--font-raleway);

        .field, .title, p {
            
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