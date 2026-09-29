
import { useParams } from 'react-router-dom';
function UserPortfolio(){

    const { username } = useParams(); 
    return (
        <div>{username}</div>
    );
}
export default UserPortfolio;