import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../pages/useUser';

export function NavBar() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <header className="purple-background">
        <div className="container">
          <div className="row">
            <div className="column-full d-flex align-center">
              <Link to="form">
                <h1 className="white-text">Code Journal</h1>
              </Link>
              <Link to="/" className="entries-link white-text">
                <h3>Entries</h3>
              </Link>
              <div className="container m-4">
                <div className="flex flex-wrap mb-4">
                  {!user && (
                    <>
                      <div className="relative flex-grow flex-1 px-4">
                        <button
                          className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                          onClick={() => navigate('auth/sign-up')}>
                          Sign Up
                        </button>
                      </div>
                      <div className="relative flex-grow flex-1 px-4">
                        <button
                          className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                          onClick={() => navigate('auth/sign-in')}>
                          Sign In
                        </button>
                      </div>
                    </>
                  )}
                  {user && (
                    <div className="relative flex-grow flex-1 px-4">
                      <button
                        className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                        onClick={() => {
                          handleSignOut();
                          navigate('auth/sign-in');
                        }}>
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
                {user && (
                  <p className="py-2">
                    Signed in as {user.username} with ID: {user.userId}
                  </p>
                )}
                {!user && <p>Not signed in</p>}
              </div>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
