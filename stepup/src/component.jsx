import { useNavigate } from 'react-router-dom';

export default function Component(props) {
  const navigate = useNavigate();

  if (!props.image) return null;

  return (
    <div className="card" onClick={() => navigate(`/details/${props.id}`)}>
      <img src={props.image} alt={props.name} />
      <h2>Name : {props.name}</h2>
      <h3>Color: {props.color}</h3>
      <h5>Price: {props.price}</h5>
      <h5>Size: {props.size}</h5>
    </div>
  );
}
