import "./Header.css";

const Header = () => {
  return (
    <div onClick={() => window.scroll(0, 0)} className="header">
      <span>
        CineCrate <span role="img" aria-label="popcorn">🍿</span>
      </span>
    </div>
  );
};

export default Header;