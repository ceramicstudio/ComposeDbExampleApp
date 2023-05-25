export const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <a href="https://developers.ceramic.network" target="_blank">
          Learn about Ceramic
        </a>
      </div>
      <div>
        <a href="https://forum.ceramic.network" target="_blank">
          Ask Questions
        </a>
      </div>
        <div>
            <a href="/" onClick={() => {
                localStorage.removeItem('logged_in')
                window.location.href = "/";
            }}>
                Logout
            </a>
        </div>
    </footer>
  )
}