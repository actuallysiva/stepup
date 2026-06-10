import { useNavigate } from "react-router-dom";

export default function Profile(){

    const navigate = useNavigate();

    return(

        <div className="profileContainer">

            <div className="profileCard">

                <div className="profileHeader">

                    <div className="profileImage">

                        <img
                            src=""
                            alt="Profile"
                        />

                    </div>

                    <h2>Siva Kumar</h2>

                    <p>
                        Premium Member
                    </p>

                </div>

                <div className="profileDetails">

                    <div className="detailRow">

                        <span>Name</span>

                        <span>Siva Kumar</span>

                    </div>

                    <div className="detailRow">

                        <span>Email</span>

                        <span>example@email.com</span>

                    </div>

                    <div className="detailRow">

                        <span>Mobile</span>

                        <span>9876543210</span>

                    </div>

                    <div className="detailRow">

                        <span>Address</span>

                        <span>
                            Chennai, Tamil Nadu
                        </span>

                    </div>

                </div>

                <div className="profileStats">

                    <div className="statBox">

                        <h3>12</h3>

                        <p>Orders</p>

                    </div>

                    <div className="statBox">

                        <h3>5</h3>

                        <p>Wishlist</p>

                    </div>

                </div>

                <div className="profileActions">

                    <button className="editBtn">
                        Edit Profile
                    </button>

                    <button className="logoutBtn" onClick={()=>navigate('/')}>
                        Logout
                    </button>

                </div>

            </div>

        </div>

    );
}