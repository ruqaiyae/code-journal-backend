import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '../pages/useUser';
import { EntryList } from '../pages/EntryList';

export function NavBar() {
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <header className="purple-background">
        <div className="container">
          <div className="row">
            <div className="column-full d-flex align-center">
              <h1 className="white-text">Code Journal</h1>
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
                          onClick={() => navigate('sign-up')}>
                          Sign Up
                        </button>
                      </div>
                      <div className="relative flex-grow flex-1 px-4">
                        <button
                          className="inline-block align-middle text-center border rounded py-1 px-3 bg-blue-600 text-white"
                          onClick={() => navigate('sign-in')}>
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
                          navigate('/');
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
                {user && <EntryList />}
              </div>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
    </>
  );
}
