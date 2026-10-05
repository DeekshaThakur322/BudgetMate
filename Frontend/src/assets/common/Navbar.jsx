import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header>
      <div className="logo">
        BudgetMate
      </div>

      <nav>
        <div>
          <Link className="link" to="/">
            Dashboard
          </Link>
        </div>

        <div>
          <Link className="link" to="/budget">
            Budget
          </Link>
        </div>

        <div>
          <Link className="link" to="/createbudget">
            Create Budget
          </Link>
        </div>
      </nav>

      <div className="auth">
        {isAuthenticated ? (
          <>
            Welcome back {user?.userName}
            <Link className="link" to="/sign-out">
                Signout
              </Link>
          </>
        ) : (
          <>
          {" "}
            <div>
              <Link className="link" to="/signin">
                Signin
              </Link>
            </div>

            <div>
              <Link className="link" to="/signup">
                Signup
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;