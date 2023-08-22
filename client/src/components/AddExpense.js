import { useState } from "react";
import styled from "styled-components"; 
import { FiFilePlus, FiFileMinus } from "react-icons/fi"; 
import { currency_list } from "../data";
import {BiCalculator} from "react-icons/bi"; 
import { CircularProgress } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import Distribution from "./Distribution";

const AddExpense = ( {participants, updateData, setUpdateData, tripId, baseCurrency} ) => {

    const [creatingExpense, setCreatingExpense] = useState(false); 
    const [usingCalculator, setUsingCalculator] = useState(false); 
    const [formData, setFormData] = useState(() => {
        const arr = Array(participants.length).fill("1");
        return { amount: 0, distribution: arr}
    })
    const [currencyData, setCurrencyData] = useState({rate: 0}); 
    const { getAccessTokenSilently } = useAuth0(); 
    const [ isChecked, setIsChecked ] = useState(() => {
        const arr = Array(participants.length).fill(true);
        return arr; 
    })

    const handleCreate = () => {
        if (creatingExpense) {
            setFormData(() => {
                const arr = Array(participants.length).fill("1");
                return { amount: 0, distribution: arr}
            })
            setIsChecked(() => {
                const arr = Array(participants.length).fill(true);
                return arr; 
            })
            setCurrencyData({rate: 0})
        }
        setCreatingExpense(!creatingExpense)
    }

    const handleUsingCalculator = () => {
        if (usingCalculator) {
            setCurrencyData({rate: 0});
        }
        setUsingCalculator(!usingCalculator); 
    }

    const handleCurrencyChange = (key, value) => {
        setCurrencyData({
            ...currencyData,
            [key]: value
        })

        if (currencyData.currency  && key === "currencyDate") {
                fetch(`/getHistoricalRate/${currencyData.currency}/${baseCurrency}/${value}`)
                .then(res => res.json())
                .then((data) => {
                    setCurrencyData({...currencyData, [key]: value, rate: data.data.result})
                    if (currencyData.amount) {
                        const convertedAmount = (data.data.result)*(currencyData.amount)
                        setFormData({...formData, amount: convertedAmount.toFixed(2)})
                    }
                })
                .catch((err) => {
                    console.log(err); 
            }) 
        }

        if (currencyData.currencyDate && key === "currency") {
                fetch(`/getHistoricalRate/${value}/${baseCurrency}/${currencyData.currencyDate}`)
                .then(res => res.json())
                .then((data) => {
                    setCurrencyData({...currencyData, [key]: value, rate: data.data.result})
                    if (currencyData.amount) {
                        const convertedAmount = (data.data.result)*(currencyData.amount)
                        setFormData({...formData, amount: convertedAmount.toFixed(2)})
                    }
                })
                .catch((err) => {
                    console.log(err); 
            }) 
        }

        if (currencyData.rate !== 0 && key === "amount") {
            const convertedAmount = value*currencyData.rate
            setFormData({...formData, amount: convertedAmount.toFixed(2)})
        }

        if (currencyData.amount && key === "rate") {
            const convertedAmount = value*currencyData.amount
            setFormData({...formData, amount: convertedAmount.toFixed(2)})
        }
    }

    const handleChange = (key, value) => {
        setFormData({
            ...formData,
            [key]: value,
            })
    }

    const addExpense = async () => {
        try {
            const token = await getAccessTokenSilently();
            const response = await fetch(`/addExpense/${tripId}`, {
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
                setFormData(() => {
                    const arr = Array(participants.length).fill("1");
                    return { amount: 0, distribution: arr}
                });
                setCreatingExpense(false); 
                setCurrencyData({rate: 0}) 
        } catch (error) {
            console.log(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setUpdateData("loading");
        addExpense(); 
    }

    return (
        <Wrapper> 
            <button onClick={handleCreate}>
                {creatingExpense ? <FiFileMinus /> : <FiFilePlus /> } 
                <span> {creatingExpense ? "Cancel" : "Add Expense" }</span>
            </button>
            { creatingExpense &&
            <div className="form">
                <form onSubmit={handleSubmit}>
                        <div className="field">
                            <label htmlFor="tripName">name </label>
                            <input 
                                required 
                                placeholder='e.g. "Pizza lunch"'
                                className="textInput" 
                                maxLength="40" 
                                type="text" 
                                id="name" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="type">category</label>
                            <select 
                                required 
                                className="form-select" 
                                id="category" 
                                name="category" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)}>
                                    <option value=''>Select category</option>
                                    <option value="Groceries">Groceries</option>
                                    <option value="Restaurants/Bars">Restaurants/Bars</option>
                                    <option value="Transportation">Transportation</option>
                                    <option value="Accommodations">Accommodations</option>
                                    <option value="Health/Hygiene">Health/Hygiene</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Shopping">Shopping</option>
                                    <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="startDate">date </label>
                            <input 
                                required 
                                className="dateInput" 
                                type="date" 
                                id="date" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        <div className="field">
                            <label htmlFor="amount">amount - {baseCurrency}</label>
                            <input 
                                required 
                                className="numberInput" 
                                value={formData.amount} 
                                type="number" 
                                step=".01" 
                                id="amount" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)} />
                        </div>
                        { participants.length > 1 &&
                        <>
                        <div className="field">
                            <label htmlFor="paidBy">paid by</label>
                            <select 
                                required 
                                className="form-select" 
                                id="paidBy" 
                                name="paidBy" 
                                onChange={(e) => handleChange(e.target.id, e.target.value)}>
                                    <option value="">Select participant</option>
                                        { participants.map((participant, index) => {
                                            return (
                                                <option key={index} value={participant}>{participant}</option>
                                            )
                                        })
                                        }
                            </select>
                        </div>
                        <div className="break"></div>
                        <div className="distribution">
                            <label className="distributionLabel" htmlFor="distribution">for whom? (distribution ratio)</label>
                            <Distribution 
                                formData={formData} 
                                setFormData={setFormData} 
                                participants={participants} 
                                isChecked={isChecked} 
                                setIsChecked={setIsChecked}/>
                        </div>
                        </>
                        }
                        <div className="submitButton" style={{left: participants.length > 1 ? '145px' : '0px'}}>
                            <button className="addExpenseButton"> 
                                {updateData === "loading" 
                                    ? <CircularProgress style={{'color': 'white'}} size="1em" /> 
                                    : <><FiFilePlus/> <span>Add Expense</span></>} 
                            </button>
                        </div>
                </form>
                <div className="currency">
                    { usingCalculator 
                    ?<div>
                        <div className="field">
                                <label htmlFor="currency">currency </label>
                                <select 
                                    className="form-select" 
                                    id="currency" 
                                    name="currency" 
                                    onChange={(e) => handleCurrencyChange(e.target.id, e.target.value)}>
                                        <optgroup>
                                            <option value=''>Select currency</option>
                                                { currency_list.map((item) => {
                                                        return (
                                                            <option key={item.code} value={item.code}>{item.code} - {item.name}</option>
                                                        )
                                                    })
                                                }
                                        </optgroup>
                                </select>
                        </div>
                        <div className="field">
                                <label htmlFor="currencyDate">exchange date </label>
                                <input 
                                    required 
                                    className="dateInput" 
                                    max={new Date().toJSON().slice(0, 10)} 
                                    type="date" id="currencyDate" 
                                    onChange={(e) => handleCurrencyChange(e.target.id, e.target.value)}/>
                        </div>
                        <div className="field">
                                <label htmlFor="rate">rate </label>
                                <input 
                                    className="numberInput" 
                                    value={currencyData.rate} 
                                    type="number" 
                                    step=".000001" 
                                    id="rate" 
                                    onChange={(e) => handleCurrencyChange(e.target.id, e.target.value)}/>
                        </div>
                        <div className="field">
                                <label htmlFor="amount">amount {currencyData.currency ? ` - ${currencyData.currency}` : ""}</label>
                                <input 
                                    required 
                                    className="numberInput" 
                                    type="number" 
                                    step=".01" 
                                    id="amount" 
                                    onChange={(e) => handleCurrencyChange(e.target.id, e.target.value)}/>
                        </div>
                    </div> 
                    :<div className="emptySpace">
                        <p>If you paid for your expense with a currency other than {baseCurrency}, click below to use the optional currency converter!</p>
                    </div>
                    }
                    <div className="conversionDiv">
                        <button 
                            onClick={handleUsingCalculator} 
                            className="conversiontool">
                                <BiCalculator /> 
                                <span>{usingCalculator? "Cancel" : "Currency Converter"}</span>
                        </button>
                    </div>
                    { participants.length > 1 &&
                        <>
                            <div className="break2" />
                            <div className="emptySpace2">
                                <p>By default, the expense will be divided equally among all participants.
                                Remove participants or customize ratio as needed!</p>
                            </div>
                        </>
                    }
                </div>
            </div>
            }
        </Wrapper>
)
}

const Wrapper = styled.div`
    margin-top: 10px; 
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center; 

    .form {
        margin-top: 10px; 
        margin-bottom: 10px;  
        padding: 10px 20px 10px 20px; 
        display: flex; 
        flex-direction: row; 
        justify-content: space-between; 
        background-color: #fcfbe3;
        width: 550px;
        border-radius: 5px;  
        font-family: var(--font-carterone)
    }

    .currency {
        padding: 10px 20px 10px 20px 
        display: flex; 
        flex-direction: column; 
    }

    .currencyTitle {
        font-family: var(--font-raleway);
        text-align: center; 
        margin-bottom: 20px; 
    }

    input, select, optgroup {
        font-family: var(--font-raleway)
    }

    .field {
        width: 250px;  
        margin: 0px 10px 10px 0px; 
        display: flex; 
        flex-direction: row; 
        justify-content: space-between; 
        align-items: center; 
    }

    .break {
        width: 260px;  
        margin: 20px 10px 10px 0px; 
        border-bottom: solid black 1px; 
        height: 10px; 
    }

    .break2 {
        width: 250px;  
        margin: 0px 10px 10px 0px; 
        border-bottom: solid black 1px; 
        height: 10px; 
    }

    .distribution {
        padding-top: 10px; 
        .distributionLabel {
            margin-top: 20px; 
        }
    }

    .numberInput, .textInput {
        width: 120px; 
    }

    .dateInput {
        width: 123px; 
    }

    .form-select,  {
        width: 128px;
    }

    .submitButton {
        display: flex;
        justify-content: center; 
        align-items: center; 
        position: relative;
        
    }

    .conversionDiv {
        display: flex;
        justify-content: center; 
        align-items: center; 
    }

    button, .conversiontool {
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

    .emptySpace {
        height: 124px; 
        width: 250px; 
        display: flex;
        justify-content: center; 
        align-items: center; 
        flex-direction: column; 
        p {
            font-family: var(--font-raleway);
            margin-bottom: 5px; 
            text-align: center; 
        }
    }

    .emptySpace2 {
        margin-top: 20px; 
        width: 250px; 
        display: flex;
        justify-content: center; 
        align-items: center; 
        flex-grow: 1; 
        flex-direction: column; 
        p {
            font-family: var(--font-raleway);
            margin-bottom: 5px; 
            text-align: center; 
        }
    }

    .converter {
        background-color: white;
        width: 180px; 
        color: black; 
        align-self: flex-end; 
    }

    button:hover {
        cursor: pointer; 
    }
`; 

export default AddExpense; 