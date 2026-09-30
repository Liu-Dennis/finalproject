import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from "react";

function PFolioNavBar(props) {
    const [username, setUsername] = useState("")

    // useEffect(() => {
    //     fetch('/user/username', 
    //         {method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }}
    //     ).then((response) => {
    //         if(!response.ok) {
    //             console.log("Failed to get username for the navbar")
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         console.log(data);
    //         setUsername(data);
    //     })
    // })


    return (
        <>
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Home</Navbar.Brand> {/* goes back to login for now, but will go back to the auth user's page */}
                <Navbar.Brand>Logged in as </Navbar.Brand>
            </Container>
        </Navbar>
        </>
    );
}


export default PFolioNavBar;