import SellerLayout from "./layouts/SellerLayout";

export default function UploadStock(){

    return(

        <SellerLayout>

        <div>
        <div className="containerUploadStock">

            <div className="uploadCard">

                <h2>Upload New Stock</h2>

                <div className="containerInput">

                    <input
                        type="text"
                        placeholder="Product Name"
                    />

                    <select>

                        <option>
                            Select Category
                        </option>

                        <option>
                            Men
                        </option>

                        <option>
                            Women
                        </option>

                        <option>
                            Kids
                        </option>

                    </select>

                    <input
                        type="text"
                        placeholder="Brand"
                    />

                    <textarea
                        placeholder="Product Description"
                    />

                    <input
                        type="number"
                        placeholder="Size"
                    />

                    <input
                        type="text"
                        placeholder="Color"
                    />

                    <input
                        type="number"
                        placeholder="Price"
                    />

                    <input
                        type="number"
                        placeholder="Quantity"
                    />

                    <input
                        type="file"
                    />

                </div>

                <div className="uploadActions">

                    <button>
                        Upload Stock
                    </button>

                    <button className="secondaryBtn">
                        Reset
                    </button>

                </div>

                <div className="containerUploadAvailable">

                    <a href="">
                        Check Availability
                    </a>

                </div>

            </div>

             </div>

            </div>

        </SellerLayout>

    );
}