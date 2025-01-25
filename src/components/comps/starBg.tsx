import "./starBgCss.css";

const StarBG = () => {
  const linesArray = new Array(11).fill(null); // Creates an array with 10 items for the lines

  return (
    <div className="fullscreen-bg">
      <div className="lines">
        {linesArray.map((_, index) => (
          <div key={index} className="line"></div>
        ))}
      </div>
    </div>
  );
};

export default StarBG;

