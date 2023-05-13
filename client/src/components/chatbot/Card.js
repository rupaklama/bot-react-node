const Card = ({ payload }) => {
  return (
    <div style={{ float: "left", paddingRight: "2px", width: "33.33%" }}>
      <div className="card">
        <div className="card-image" style={{ height: "50%" }}>
          <img src={payload.structValue.fields.image.stringValue} alt={payload.structValue.fields.header.stringValue} />
          <span className="card-title">{payload.structValue.fields.header.stringValue}</span>
        </div>
        <div className="card-content">
          {payload.structValue.fields.description.stringValue}

          <p>
            <a href="/">{payload.structValue.fields.price.stringValue}</a>
          </p>
        </div>
        <div className="card-action">
          <a href={payload.structValue.fields.link.stringValue} target="_blank" rel="noreferrer">
            GET NOW
          </a>
        </div>
      </div>
    </div>
  );
};
export default Card;
