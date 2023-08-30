import styled from 'styled-components'
import { useState } from 'react'
import { sumArray } from '../helpers';
import {FaBalanceScaleLeft, FaBalanceScaleRight} from 'react-icons/fa'


const Balances = ({expenses, participants}) => {

    const [viewBalances, setViewBalances] = useState(false);
    
    let users = [];
    participants.forEach((participant, index) => {

        let totalPaid = 0;
            expenses.filter((expense) => expense.paidBy === participant).forEach((expense) => {
                totalPaid += +expense.amount 
            })
        let totalUsed = 0;
            expenses.forEach((expense) => {
                let denominator = sumArray(expense.distribution)
                totalUsed += +(expense.distribution[index])/denominator*(+expense.amount)
            })
        let balance = (totalPaid-totalUsed).toFixed(2)
        console.log(balance)
        let object = {}
        object.name = participant;
        object.amount = +balance
        
        users.push(object)
        
        })

    let calculatedAmounts = []; 
    users.forEach(user => {
        calculatedAmounts.push({name: user.name, amount: user.amount})}
    )

    let whoOwesWho = [];

    while (Math.round(Math.max(...calculatedAmounts.map(item => item.amount))) !== 0) {
        let sorted = calculatedAmounts.sort((a,b) => a.amount - b.amount);
        let i = 0;
        let value = +(sorted[sorted.length - 1].amount + sorted[i].amount).toFixed(2)

        if (value > 0) {
            whoOwesWho.push(sorted[i].name + " owes " + sorted[sorted.length - 1].name + " " + Math.abs(sorted[i].amount).toFixed(2))
            sorted[i].amount = 0
            sorted[sorted.length - 1].amount = value;
            calculatedAmounts=[...sorted]
            
        } else {
            whoOwesWho.push(sorted[i].name + " owes " + sorted[sorted.length - 1].name + " " + sorted[sorted.length - 1].amount.toFixed(2))
            sorted[i].amount = sorted[i].amount + sorted[sorted.length - 1].amount
            sorted[sorted.length - 1].amount = 0;
            calculatedAmounts=[...sorted]
        }
    } 
    
    const handleView = () => {
        setViewBalances(!viewBalances)
    }

    return (
        <Wrapper> 
            <button onClick={handleView}>
                {viewBalances ? <FaBalanceScaleLeft /> : <FaBalanceScaleRight /> } 
                <span> {viewBalances ? "Cancel" : "Balances" }</span>
            </button>
            { viewBalances && 
                <div className="container">
                    <div className="balances">
                    { users.map((user, index) => {
                        return (
                            <div key={index}>
                                <p className="participant">{user.name}</p>
                                <p className={
                                    +users[index].amount >= 0 
                                    ? "owed"
                                    : "owing"} >
                                    {users[index].amount.toFixed(2)}</p> 
                            </div>
                        )
                    })
                    }
                    </div>
                    <div className="whoOwesContainer">
                        <div className="whoOwesWho">
                            { users.length > 2 &&
                                <p className="participant">Suggested reimbursements</p>
                            }
                            {
                            whoOwesWho.map((item, index) => {
                                return (
                                    <p key={index}>{item}</p>
                                )
                            })
                            }
                        </div>
                    </div>
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

    .container {
        margin-top: 10px;   
        padding: 10px 20px 0px 20px; 
        display: flex; 
        flex-direction: column;  
        background-color: white;
        opacity: 0.75; 
        width: 550px;
        border-radius: 5px;  
        border: solid #17918b 2px; 

        .balances {
            display: flex;
            flex-direction: row; 
            justify-content: space-around; 
            margin-bottom: 20px; 
        }

        .whoOwesContainer {
            display: flex; 
            align-items: center; 
            justify-content: center;  
        }

        .whoOwesWho {
            display: flex; 
            flex-direction: column; 
            align-items: flex-start; 
            margin-bottom: 20px; 
        }

        .participant {
            font-family: var(--font-carterone);
            text-decoration: underline; 
        }

        .suggested {
            font-family: var(--font-carterone);
        }

        .owed {
            color: green;
            font-weight: bold;
        }

        .owing {
            color: red; 
            font-weight: bold; 
        }

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
`

export default Balances;