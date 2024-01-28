import Link from "next/link";

export const Footer = () => {
  return (
    <footer className='footer'>
      <div>
        <Link href='https://developers.ceramic.network' target='_blank' rel='noreferrer'>
          Learn about Ceramic
        </Link>
      </div>
      <div>
        <Link href='https://forum.ceramic.network' target='_blank' rel='noreferrer'>
          Ask Questions
        </Link>
      </div>
      <div>
        <Link
          href='/'
          onClick={() => {
            localStorage.removeItem("logged_in");
            window.location.href = "/";
          }}
        >
          Logout
        </Link>
      </div>
    </footer>
  );
};
