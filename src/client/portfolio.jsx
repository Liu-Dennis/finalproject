import { useParams } from 'react-router-dom';
import { useState, useEffect, useCallback } from "react";
import { Spinner, Alert } from 'react-bootstrap';
import "./portfolio.css";
import { api } from './api.js';
import PFolioNavBar from './pfolioComponents/navbar.jsx';
import UserInfo from './pfolioComponents/userInfo.jsx';
import PostGrid from './pfolioComponents/postGrid.jsx';
import EditSidebar from './pfolioComponents/editSidebar.jsx';
import PostFormModal from './pfolioComponents/postFormModal.jsx';
import defaultPfp from './assets/stockPhotoGuy.png';

function UserPortfolio() {
    const { uid } = useParams();

    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    // Comes from the server, which compares the session user to :uid.
    // Only decides what UI to show -- the server re-checks on every edit.
    const [isOwner, setIsOwner] = useState(false);
    const [status, setStatus] = useState("loading"); // loading | ready | notfound | error

    // Owner can flip this off to see the page the way visitors do
    const [editMode, setEditMode] = useState(true);
    // null = closed, { post: null } = creating, { post } = editing that post
    const [modal, setModal] = useState(null);

    const load = useCallback(async () => {
        setStatus("loading");
        try {
            const data = await api("GET", `/api/portfolio/${uid}`);
            setProfile(data.profile);
            setPosts(data.posts);
            setIsOwner(data.isOwner);
            setStatus("ready");
        } catch (err) {
            setStatus(err.status === 404 ? "notfound" : "error");
        }
    }, [uid]);

    // re-run when the url changes (e.g. going from one portfolio to another)
    useEffect(() => { load(); }, [load]);

    const showEditTools = isOwner && editMode;

    // ----- owner actions -----
    const handleSavePost = async (fields) => {
        if (modal?.post) {
            const updated = await api("PUT", `/api/posts/${modal.post._id}`, fields);
            setPosts(prev => prev.map(p => p._id === updated._id ? updated : p));
        } else {
            const created = await api("POST", "/api/posts", fields);
            setPosts(prev => [created, ...prev]);
        }
        setModal(null);
    };

    const handleDeletePost = async (post) => {
        if (!window.confirm(`Delete "${post.title}"? This can't be undone.`)) return;
        try {
            await api("DELETE", `/api/posts/${post._id}`);
            setPosts(prev => prev.filter(p => p._id !== post._id));
        } catch (err) {
            alert(err.message);
        }
    };

    const handleSaveProfile = async (fields) => {
        const saved = await api("PUT", "/api/profile", fields);
        setProfile(prev => ({ ...prev, ...saved }));
    };

    // ----- render -----
    if (status === "loading") {
        return (
            <>
                <PFolioNavBar />
                <div className="pfolioStatus"><Spinner animation="border" /></div>
            </>
        );
    }
    if (status !== "ready") {
        return (
            <>
                <PFolioNavBar />
                <div className="pfolioStatus">
                    <Alert variant={status === "notfound" ? "warning" : "danger"}>
                        {status === "notfound"
                            ? "This portfolio doesn't exist."
                            : "Something went wrong loading this portfolio."}
                    </Alert>
                </div>
            </>
        );
    }

    return (
        <>
            <PFolioNavBar />
            <div className="pfolioPage">
                {isOwner && (
                    <EditSidebar
                        profile={profile}
                        postCount={posts.length}
                        editMode={editMode}
                        onToggleEditMode={() => setEditMode(m => !m)}
                        onNewPost={() => setModal({ post: null })}
                        onSaveProfile={handleSaveProfile}
                    />
                )}

                <main className="pfolioMain">
                    <section className="pfolioWidget">
                        <UserInfo
                            img={profile.avatarUrl || defaultPfp}
                            name={profile.username}
                            bio={profile.bio}
                        />
                    </section>

                    <section className="pfolioWidget">
                        <h2 className="h4 mb-3">Work</h2>
                        <PostGrid
                            posts={posts}
                            editable={showEditTools}
                            emptyMessage={isOwner
                                ? "You haven't posted anything yet. Use \"New post\" in the sidebar to add your first piece."
                                : "No work posted yet."}
                            onEdit={(post) => setModal({ post })}
                            onDelete={handleDeletePost}
                        />
                    </section>
                </main>
            </div>

            {isOwner && (
                <PostFormModal
                    show={modal !== null}
                    post={modal?.post ?? null}
                    onHide={() => setModal(null)}
                    onSave={handleSavePost}
                />
            )}
        </>
    );
}
export default UserPortfolio;
