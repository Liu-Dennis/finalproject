
import { useParams } from 'react-router-dom';
function UserPortfolio(){
    //need some way to check auth here, if auth and user is correct then display admin edit panel
    const { username } = useParams(); 
    return (
        <div>{username}</div>
    );
}
export default UserPortfolio;