
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";

function UserPortfolio(){
    //need some way to check auth here, if auth and user is correct then display admin edit panel

    const { uid } = useParams(); 
    const [data, setData] = useState([])

    // on load, fetch the data with the id passed in the url
    // useEffect(() => {
    //     fetch("/user/portfolio", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({
    //             userid: uid
    //         })
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data);
    //         setData(data);
    //     });
    // }, []);

    return (
        <>
            <div>{uid}</div>
            {/* <WidgetDisplay widgets={data} /> */}
        </>
    );
}
export default UserPortfolio;