import { Button, Form } from 'react-bootstrap';
import "./editTools.css";

// Owner-only edit panel. Only rendered when the server says you own this page.
function FileUpload({ onOpen }) {
    return (
        <aside className="editSidebar">
            <h2 className="h5">Upload Files</h2>
            <Button className="w-100" onClick={onOpen}>
                🖹 Upload Images
            </Button>
        </aside>
    );
}
export default FileUpload;
