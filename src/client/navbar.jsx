import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from "react";
import { NavbarBrand, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function PFolioNavBar() {
    const [username, setUsername] = useState("")

    useEffect(() => {
        // GET request using fetch inside useEffect React hook
        fetch('/user/username')
            .then(response => response.json())
            .then(data => setUsername(data));

    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    }, []);

    const handleLogOut = async (e) => {
        console.log("Client Logout")
        e.preventDefault()
        const response = await fetch('/auth/logout', {
            method: "GET",
            redirect: "manual"
            })
        if (response.type === 'opaqueredirect') {
            window.location.href = response.url
        }
    }

    return (
        <>
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand >Home</Navbar.Brand> {/* this should be a link that goes to /pfolio/uid of current user */}
                {username !== "" ? <Navbar.Brand>Logged in as {username}</Navbar.Brand> : <Navbar.Brand>Not Logged In</Navbar.Brand>}
                <Button onClick={handleLogOut}>Log Out</Button>
            </Container>
        </Navbar>
        </>
    );
}


export default PFolioNavBar;