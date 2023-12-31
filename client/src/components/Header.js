import styled from "styled-components"; 
import { Link } from "react-router-dom";

// Navigation bar componenet
const Header = ( {loginWithPopup, logout, isAuthenticated }) => {

    // Function for going directly to signup page with Auth0
    const handleSignUp = () => { 
        loginWithPopup({authorizationParams: {
            screen_hint: "signup",
        }}); 
    }

    return (
    <NavBar>
        <StyledLink to={"/"}><p>travel tracker</p></StyledLink>
        { isAuthenticated 
            ? <button onClick={logout}>log out</button>
            : <div className="buttons">
                <button onClick={loginWithPopup}>log in</button>
                <button onClick={handleSignUp}>sign up</button>
            </div>
        }
    </NavBar>
    )
}

const StyledLink = styled(Link)`
    text-decoration: none; 
    margin-left: calc(7.5vw - 20px); 
`

const NavBar = styled.div`
    font-family: var(--font-carterone); 
    font-weight: 400; 
    font-size: 2em; 
    height: 60px; 
    background-color: #17918b; 
    border-bottom: solid #fcfbe3 3px; 
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
    align-items: center; 

    .buttons {
    height: 42px; 
    }

    p {
        color: #fcfbe3; 
    }

    button {
        background-color: #fcfbe3; 
        border: none;
        border-radius: 10px; 
        height: 30px; 
        width: 80px; 
        margin-right: calc(7.5vw - 20px); 
        font-family: var(--font-carterone); 
        margin-top: 0; 
        
    }

    button:hover {
        cursor: pointer; 
    }
`; 

export default Header; 