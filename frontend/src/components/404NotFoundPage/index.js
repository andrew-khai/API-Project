import "./NotFound.css"

const NotFound = () => {
  return (
    <div id="not-found-container">
      <div>
        <h1 className="not-found-title">Oops!</h1>
        <h2 className="not-found-text">We can't seem to find the page you're looking for</h2>
        <p className="not-found-text">Click here to go back to the <a className="not-found-home-link" href="/">homepage</a></p>
      </div>
      <div>
        <img src="../images/404gif.gif"></img>
      </div>
    </div>
  )
}

export default NotFound;
