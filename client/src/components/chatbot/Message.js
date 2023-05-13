const Message = props => {
  return (
    <div className="col s12 m8 offset-m2 l6 offset-l3">
      <div className="card-panel grey lighten-5 z-depth-1">
        <div className="row valign-wrapper">
          {props.speaks === "user" && (
            <div className="col s2">
              <a href="/" className="btn-floating btn-large waves-effect waves-light red">
                {props.speaks}
              </a>
            </div>
          )}

          <div className="col s10">
            <span className="black-text" style={{ margin: "0 1rem" }}>
              {props.text}
            </span>
          </div>

          {props.speaks === "bot" && (
            <div className="col s2" style={{ marginRight: "1rem" }}>
              <a href="/" className="btn-floating btn-large waves-effect waves-light red">
                {props.speaks}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Message;
