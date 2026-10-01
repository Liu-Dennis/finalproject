import { useState, useEffect } from "react";
import { Button, Form, Alert } from 'react-bootstrap';

// Only rendered when the server says the logged in user owns this page.
function EditSidebar({ profile, postCount, editMode, onToggleEditMode, onNewPost, onSaveProfile }) {
    const [bio, setBio] = useState(profile.bio);
    const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null); // { variant, text }

    // keep the form in sync if the profile is reloaded
    useEffect(() => {
        setBio(profile.bio);
        setAvatarUrl(profile.avatarUrl);
    }, [profile.bio, profile.avatarUrl]);

    const dirty = bio !== profile.bio || avatarUrl !== profile.avatarUrl;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            await onSaveProfile({ bio, avatarUrl });
            setMessage({ variant: "success", text: "Profile saved" });
        } catch (err) {
            setMessage({ variant: "danger", text: err.message });
        } finally {
            setSaving(false);
        }
    };

    return (
        <aside className="editSidebar">
            <h2 className="h5">Your portfolio</h2>

            <Form.Check
                type="switch"
                id="edit-mode-switch"
                label={editMode ? "Editing" : "Previewing as a visitor"}
                checked={editMode}
                onChange={onToggleEditMode}
                className="mb-3"
            />

            {editMode && (
                <>
                    <section className="editSidebarSection">
                        <h3 className="h6">Posts ({postCount})</h3>
                        <Button className="w-100" onClick={onNewPost}>+ New post</Button>
                        <Form.Text muted>Edit or delete a post with the buttons on each card.</Form.Text>
                    </section>

                    <section className="editSidebarSection">
                        <h3 className="h6">Profile</h3>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-2" controlId="sidebar-bio">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={4}
                                    maxLength={1000}
                                    value={bio}
                                    onChange={e => setBio(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="sidebar-avatar">
                                <Form.Label>Profile picture URL</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="https://..."
                                    value={avatarUrl}
                                    onChange={e => setAvatarUrl(e.target.value)}
                                />
                            </Form.Group>
                            {message && <Alert variant={message.variant} className="py-1 px-2 small">{message.text}</Alert>}
                            <Button type="submit" variant="secondary" className="w-100" disabled={!dirty || saving}>
                                {saving ? "Saving..." : "Save profile"}
                            </Button>
                        </Form>
                    </section>
                </>
            )}
        </aside>
    );
}
export default EditSidebar;
