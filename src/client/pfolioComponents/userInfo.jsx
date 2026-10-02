
function UserInfo(props){
    //pfp and user bio
    const pfpStyle = {
    width: '200px',
    height: '200px',
    borderRadius: '50%',

  };
    return(
        <>
        <div>
        <img src={props.img} alt="Image not found" style={pfpStyle}>
        </img>
        <p>{props.txt}</p>
        </div>
        </>
    )
}
export default UserInfo