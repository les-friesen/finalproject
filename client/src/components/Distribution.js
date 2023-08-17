import styled from "styled-components";
import { sumArray } from "../helpers";

const Distribution = ({participants, formData, setFormData, isChecked, setIsChecked}) => {

    const handleCheckbox = (index) => {
        if (formData.distribution[index] === "0") {
            let newArray = [...formData.distribution]; 
            newArray[index] = "1";
            setFormData( {...formData, distribution: newArray})
            let newArray2 = [...isChecked]
            newArray2[index] = true; 
            setIsChecked(newArray2)
        } else {
            let newArray = [...formData.distribution]; 
            newArray[index] = "0"; 
            setFormData( {...formData, distribution: newArray})
            let newArray2 = [...isChecked]
            newArray2[index] = false; 
            setIsChecked(newArray2)
        }
    }

    const handleDistribution = (index, value) => {
        if (value === "0") {
            let newArray2 = [...isChecked]
            newArray2[index] = false; 
            setIsChecked(newArray2)
        }  else {
            let newArray3 = [...isChecked]
            newArray3[index] = true; 
            setIsChecked(newArray3)
        }
        let newArray = [...formData.distribution]; 
        newArray[index] = value;
        setFormData( {...formData, distribution: newArray})
    }

    return (
        <Wrapper>
        {   participants.map((participant, index) => {
                return (
                    <div className="participant" key={index}>
                        <div className="person">
                        <input 
                            type="checkbox" 
                            name="distribution" 
                            value={index} 
                            checked={isChecked[index]} 
                            onChange={(e) => handleCheckbox(e.target.value)}/> 
                        <span>{participant} </span>
                        </div>
                        <div className="ratioAndAmount">
                        <input 
                            required
                            type="number" 
                            value={formData.distribution[index]} onKeyDown={ (e) => (e.key === '-' ) && e.preventDefault()} 
                            id={index} 
                            step=".01" 
                            min="0" 
                            max="200" 
                            onChange={(e) => handleDistribution(e.target.id, e.target.value)}/> 
                        <span>{formData.amount && (formData.amount*formData.distribution[index]/sumArray(formData.distribution)).toFixed(2)}</span>
                        </div> 
                    </div>
                )
            })
        }
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-top: 10px; 
    margin-bottom: 20px;  
    width: 250px; 
    display: flex; 
    flex-direction: column; 

    .participant {
        display: flex; 
        flex-direction: row; 
        align-items: center; 
        justify-content: space-between; 
        margin-top: 5px; 
    }

    .person span {
        margin-left: 20px; 
    }

    .ratioAndAmount {
        width: 130px; 
        display: flex;
        flex-direction: row;
        justify-content: space-between; 
        align-items: center; 

        input {
            width: 40px; 
        }
    }

    span {
        font-family: var(--font-raleway);
        
    }
`

export default Distribution 