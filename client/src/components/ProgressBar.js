import styled from 'styled-components'

// Component for the progress bar which shows how much of the total budget has been spent, 
// and will change color accordingly.  

const ProgressBar = ( { completed } ) => {

    return (
        <Container>
            <Filler style={{ width : completed > 100 ? "100%" : `${completed}%`, 
                            backgroundColor : completed < 70 ? "green" : completed > 95 ? "red" : "orange" 
                            }}>
                <Label>{completed > 6 ? `${completed}%` : ""}</Label>
            </Filler>
        </Container>
    )
}

const Container = styled.div`
    height: 25px;
    width: 100%;
    background-color: #e0e0de;
    border-radius: 5px; 
    margin-bottom: 20px; 
`

const Filler = styled.div`
    height: 100%;
    border-radius: inherit;
    display: flex; 
    flex-direction: row; 
    justify-content: flex-end; 
    align-items: center; 
`

const Label = styled.span`
    padding: 5px;
    color: white;
    font-weight: bold;
`

export default ProgressBar 