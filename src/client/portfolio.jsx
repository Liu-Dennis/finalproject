
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import WidgetDisplay from "./pfolioComponents/widgetDisplay.jsx";
import "./portfolio.css"
import PFolioNavBar from './pfolioComponents/navbar.jsx';
import UserInfo from './pfolioComponents/userInfo.jsx';
import usePortfolio from './pfolioComponents/usePortfolio.js';
import EditSidebar from './pfolioComponents/editSidebar.jsx';
import PostGrid from './pfolioComponents/postGrid.jsx';
import PostFormModal from './pfolioComponents/postFormModal.jsx';
import defaultPfp from './assets/stockPhotoGuy.png';
import FileUpload from './pfolioComponents/fileUpload.jsx';
import UploadFileModal from './pfolioComponents/uploadFileModal.jsx';

function UserPortfolio(){
    const { uid } = useParams(); 
    const [data, setData] = useState([])
    const { posts, profile, isOwner, editMode, setEditMode, savePost, deletePost, saveProfile } = usePortfolio(uid)
    // null = closed, { post: null } = creating, { post } = editing that post
    const [modal, setModal] = useState(null)
    const [fileModal, setFileModal] = useState(false)

    // on load, fetch the data with the id passed in the url
    useEffect(() => {
        fetch("/user/widgets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userid: uid
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setData(data);
        });
    }, []);

    return (
        <>
            <PFolioNavBar uid={uid}></PFolioNavBar>
            <div className='columnContainer'>
                <div className='infoEditContainer'>
                <UserInfo img={profile?.avatarUrl || defaultPfp} txt={profile?.bio || "No bio yet."}></UserInfo>
                {isOwner && (
                    <EditSidebar
                        postCount={posts.length}
                        editMode={editMode}
                        onToggleEditMode={() => setEditMode(m => !m)}
                        onNewPost={() => setModal({ post: null })}
                        profile={profile}
                        onSaveProfile={saveProfile}
                    />
                )}
                {isOwner && (<FileUpload onOpen={() => setFileModal(true)} />)}
                </div>
                <div className='postContainer'>
                    <PostGrid
                        posts={posts}
                        editable={isOwner && editMode}
                        emptyMessage={isOwner ? 'No posts yet. Use "+ New post" to add your first piece.' : 'No work posted yet.'}
                        onEdit={(post) => setModal({ post })}
                        onDelete={deletePost}
                    />

                    {/* <div>{uid}</div>
                    <WidgetDisplay widgets={data} /> */}
                </div>
            </div>
            {isOwner && (
                <PostFormModal
                    show={modal !== null}
                    post={modal?.post ?? null}
                    onHide={() => setModal(null)}
                    onSave={async (fields) => { await savePost(modal?.post, fields); setModal(null); }}
                />
            )}

            {isOwner && (<UploadFileModal show={fileModal} onHide={() => setFileModal(false)} uid={uid} />)}
            
            
        </>
    );
}
export default UserPortfolio;