import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useState, useEffect } from "react";
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


function PFolioNavBar() {
    // { _id, username } of the logged in user, or null if logged out
    const [me, setMe] = useState(null)

    useEffect(() => {
        fetch('/api/me')
            .then(response => response.json())
            .then(data => setMe(data))
            .catch(() => setMe(null));
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
    const handleLogInRedirect = (e) => {
        window.location.href = '/'
    }

    return (
        <>
        <Navbar bg="primary" data-bs-theme="dark">
            <Container>
                {me ? <Navbar.Brand>Logged in as {me.username}</Navbar.Brand> : <Navbar.Brand>Not Logged In</Navbar.Brand>}
                <div className="d-flex gap-2">
                    {me && <Button as={Link} to={`/pfolio/${me._id}`}>My portfolio</Button>}
                    {me ? <Button onClick={handleLogOut}>Log Out</Button> : <Button onClick={handleLogInRedirect}>Log In</Button>}
                </div>
            </Container>
        </Navbar>
        </>
    );
}


export default PFolioNavBar;
