
function Home() {
  return (
    <Methods />
    );
}


function Methods() {
  return (
    <div>
      <a href="/auth/github">
        <button>Log in with GitHub</button>
      </a>
    </div>
  );
}

function LocalForm() {

  return (
    <div>
    <h2>Portfolio Designer</h2>
    <h3>Log in</h3>
    <form onSubmit={handleLogin}>
        <label>Username</label>
        <br/>
        <input type="text" id="uname-login" name="user-uname"></input>
        <br/>
        <label>Password</label>
        <br/>
        <input type="password" id="pword-login" name="user-pword"></input>
        <br/>
        <button type="submit" id="login-submit">Log in</button>
    </form>
    </div>
  );
}

export default Home;