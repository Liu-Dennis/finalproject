
function Home() {
  return (
    <>
      <Methods />
      <LocalForm />
    </>

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
        <form action="/auth/local" method="post">
          <input name="username" required />
          <input name="password" type="password" required />
          <button type="submit">Sign in</button>
        </form>
    </div>
  );
}

export default Home;