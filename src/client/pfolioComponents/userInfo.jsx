
// widget1 from the mockup: profile picture + name + bio
function UserInfo({ img, name, bio }) {
    return (
        <div className="userInfo">
            <img src={img} alt={`${name}'s profile picture`} className="userInfoPfp" />
            <div className="userInfoText">
                <h1 className="userInfoName">{name}</h1>
                <p className="userInfoBio">{bio || <span className="text-muted">No bio yet.</span>}</p>
            </div>
        </div>
    );
}
export default UserInfo
