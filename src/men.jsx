
import image1 from './assets/shoe1.webp'
import image2 from './assets/shoe2.webp'
import image3 from './assets/shoe3.webp'
import image4 from './assets/shoe4.jpg'
import image5 from './assets/shoe5.jpg'
import image6 from './assets/shoe6.webp'
import image7 from './assets/shoe7.jpg'
import image8 from './assets/shoe8.jpg'
import image9 from './assets/shoe9.jpg'
import image10 from './assets/shoe10.jpg'
import image11 from './assets/shoe11.jpg'
import image12 from './assets/shoe12.jpg'
import Component from './component'


export default function Men () {
        const shoeListMen = [
            {
                id:1,
                name: "Sneaker", 
                color :"Red", 
                price: "800",
                image : image1,
                size : "8 9 10 11"
            },
            {
                id:2,
                name: "High Heels", 
                color :"Red", 
                price: "1900",
                image : image8,
                size : "7 8 9"
            },
            {
                id:3,
                name: "Kids Shoe", 
                color :"Blue", 
                price: "1800",
                image : image9,
                size : "5 6 7"
            },
            {
                id:4,
                name: "Crocs", 
                color :"White", 
                price: "2800",
                image : image4,
                size : "8 9 10"
            },
            {
                id:5,
                name: "Blue Sneaker",
                color: "Blue",
                price: "2000",
                image: image5,
                size: "9 10 11"
            },
            {
                id:6,
                name: "Heels",
                color: "Black",
                price: "2000",
                image: image7,
                size: "7 8"
            },
            {
                id:7,
                name: "Sneakers",
                color: "White",
                price: "2000",
                image: image2,
                size: "10 11 12"
            },
            {
                id:8,
                name: "Formal Shoe",
                color: "Black",
                price: "3000",
                image: image3,
                size: "8 9 10"
            },
            {
                id:9,
                name: "Sandals",
                color: "Brown",
                price: "2000",
                image: image6,
                size: "8 9 10"
            },
            {
                id:10,
                name: "Kid Shoes",
                color: "Red",
                price: "900",
                image: image10,
                size: "5 6 7"
            },
            {
                id:11,
                name: "Sneaker",
                color: "Mixed Color",
                price: "2000",
                image: image11,
                size: "7 8 9 10 11"
            },
            {
                id:12,
                name: "Sport Shoe",
                color: "Blue",
                price: "1000",
                image: image12,
                size: "7 8 9 10"
            }
            ]
        const dataMap = shoeListMen.map((shoes,index)=> 
                    <Component 
                        key = {index}
                        id = {shoes.id} 
                        name = {shoes.name} 
                        color = {shoes.color} 
                        price = {shoes.price} 
                        image = {shoes.image}
                        size = {shoes.size}
                        />
                    );
    return(
        <div className="card-elements">
        {dataMap}
        </div>
    )
}
