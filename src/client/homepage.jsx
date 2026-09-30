
function Home() {
  return (
    <main className="form-signin w-100 m-auto">
      <LocalForm />
      <Methods />
    </main>
  );
}

function Methods() {
  return (
    <div>
      <a className="btn btn-primary" href="/auth/github">
        <button>Log in with GitHub</button>
      </a>
    </div>
  );
}

function LocalForm() {

  return (
    <form action="/auth/local" method="post">
      <div className="form-group mb-3">
        <label htmlFor="username">Username</label>
        <input className="form-control"name="username" required />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="password">Password</label>
        <input className="form-control" name="password" type="password" required />
      </div>
      <button className="btn btn-primary" type="submit">Sign in</button>
    </form>
  );
}

export default Home;