
function Home() {

const handleLogin = (e) => {
  e.preventDefault();
  console.log("Form submitted")
}
const handleSignup = (e) => {
  e.preventDefault();
  console.log("Form submitted")
}
    return (
        <div>
        <h2>Portfolio Designer</h2>
        <h3>Log in</h3>
        <form onSubmit={handleLogin}>
            <label>Username</label>
            <br></br>
            <input type="text" id="unameLogin" name="userUname"></input>
            <br></br>
            <label>Password</label>
            <br></br>
            <input id="pwordLogin" type="password" name="userPword"></input>
            <br></br>
            <button type="submit" id="loginSubmit">Log in</button>
        </form>
        <hr></hr>
        <h3>Sign Up</h3>
        <form onSubmit={handleSignup}>
            <label>Username</label>
            <br></br>
            <input type="text" id="unameSignup" name="userUname"></input>
            <br></br>
            <label>Password</label>
            <br></br>
            <input id="pwordLogin" type="password" name="userPword"></input>
            <br></br>
            <button type="submit" id="loginSubmit">Sign Up</button>
        </form>
        </div>
        );
    
}
export default Home;