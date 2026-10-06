import { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import "./editTools.css";
import "./uploadFileModal.css";

function UploadFileModal({ show, onHide, uid }) {
    const [data, setData] = useState([])
    const [redraw, setRedraw] = useState(0)

    // on load, fetch the data with the id passed in the url
    useEffect(() => {
        fetch(`/api/files/${uid}`)
        .then(response => response.json())
        .then(data => {
            setData(data.ownerFiles);
        });
    }, [show, redraw]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const files = formData.getAll("files");
        
        console.log(files);

        try {
            const response = await fetch("/api/files", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                // const result = await response.json();
                // console.log("Files uploaded successfully:", result);
                // onHide(); 
                setRedraw(redraw + 1);
                e.target.reset();
            }



        } catch (err) {
            console.log(err.message);
        } 
    };

    const handleDelete = async (e, fileId) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`/api/files/${fileId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setData(data => data.filter(entry => entry._id !== fileId));
            }

        } catch (err) {
            console.log(err.message);
        } 
    };
    
    let file_rows = data.map(entry => 
        <tr key={entry._id}>
            <td>
                <a href={`/uploads/${entry.filename}`}>
                    {entry.originalName}
                </a>
            </td>
            <td>
                <button className="btn" onClick={(e) => handleDelete(e, entry._id)}>
                    Delete
                </button>
            </td>
        </tr>
    );

    return (
        <Modal show={show} onHide={onHide} centered>
            <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>My Files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="post-title">
                        <Form.Label>Select File(s)</Form.Label>
                        <Form.Control 
                            type="file"
                            name="files" 
                            accept="image/png, image/jpeg" 
                            multiple  
                            required
                            autoFocus 
                        />
                    </Form.Group>
                    <div className="scrollable-box">
                        {data.length > 0 && (<table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">File Name</th>
                                    <th scope="col">Controls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {file_rows}
                            </tbody>
                        </table>)}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHide}> Close </Button>
                    <Button type="submit">
                        Upload File
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
}
export default UploadFileModal;
