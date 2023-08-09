import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components"; 
import AddTrip from "./AddTrip";
import beach1 from "../assets/beach1.jpg"
import Trip from "./Trip";
import { CircularProgress } from '@mui/material';

const HomePage = () => {

    const { user, isAuthenticated } = useAuth0(); 
    const [ tripData, setTripData] = useState(); 
    const [ updateData, setUpdateData ] = useState(); 
    

    // useEffect (() => {
    //     if (user) {
    //     fetch(`/api/${user.sub}`)
    //     .then(res => res.json())
    //     .then(data => {
    //         console.log(data); 
    //         if (data.status === 200) {
    //         setUserData(data.data); 
    //         } else {
    //             fetch("/api/addUser", {
    //                 method: "POST",
    //                 headers: {
    //                     "Accept": "application/json",
    //                     "Content-Type": "application/json"
    //                     },
    //                 body: JSON.stringify({"email" : user.name, "sub" : user.sub})
    //                 })
    //                     .then(res => res.json())
    //                     .then((data) => {
    //                         setUserData(data.data); 
    //                         console.log(data)
    //                     })
    //                 }
    //     }
    //     )
    //     .catch((err) => {
    //       console.log(err); 
    //     }) 
    //     }
    // }, [isAuthenticated])

    useEffect (() => {
        if (user) {
            fetch(`/getTrips/${user.sub}`)
            .then(res => res.json())
            .then((data) => {
                    setTripData(data.data.reverse()); 
                    console.log(data)
                    })
            .catch((err) => {
                    console.log(err); 
            }) 
        }
    }, [isAuthenticated, updateData])

    return (
    <Background>
        { !user
        ? <div className="welcome">Log in or sign up to start tracking your travel expenses! </div>
        : !tripData 
        ?   <ProgressDiv>
                <CircularProgress /> 
            </ProgressDiv>
        :   <>
            <div className="welcome">
            <span>Welcome {user.nickname}! {tripData.length > 1 ? `You have created ${tripData.length} trips so far!` : tripData.length === 1 ? "You have created 1 trip so far!" : "Start by creating your first trip"}  </span>
            </div>
            <AddTrip updateData={updateData} setUpdateData={setUpdateData}/>
            {
             
            tripData.map((trip, index) => {
                return (
                    <Trip key={tripData[index]._id} tripData={trip} setUpdateData={setUpdateData}/> 
                )
                })
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

.welcome {
    margin-top: 40px; 
    margin-bottom: 20px; 
    font-size: 2em; 
    background-color: #fcfbe3; 
    width: 80vw; 
    padding: 20px; 
    font-family: var(--font-raleway); 
    font-weight: 800; 
    opacity: 0.85;  
    text-align: center; 
    border-radius: 5px; 
}

align-items: center; 
min-height: 100vh; 

p, span {
    font-family: var(--font-raleway); 
}
`; 

export default HomePage; 