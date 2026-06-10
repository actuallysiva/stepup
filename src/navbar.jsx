import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Navbar () {

   const navigate = useNavigate();

    return (

        <div className="navbar">

            {/* LOGO */}

            <div className="logoCard">

                <h2>StepUP</h2>

            </div>

            {/* NAV LINKS */}

            <div className="navLinks">

                <Link to='/'>Home</Link>

                <Link to='/men'>Men</Link>

                <Link to='/women'>Women</Link>

                <Link to='/kids'>Kids</Link>

            </div>

            {/* SEARCH */}

            <div className="searchBar">

                <input
                    type="text"
                    placeholder="Search shoes..."
                />

            </div>

            {/* ACTION BUTTONS */}

            <div className="sidebuttons">

                <button onClick={()=>navigate('/login/')}>
                    Seller?
                </button>

                <button
                    type="button"
                    onClick={()=>navigate('/wishlist')}
                >
                    ❤️
                </button>

                <button
                    type="button"
                    onClick={()=>navigate('/cart')}
                >
                    🛒
                </button>

                <button
                    type="button"
                    onClick={()=>navigate('/userProfile')}
                >
                    Profile
                </button>

            </div>

        </div>

    );
}