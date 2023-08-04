import { useEffect, useState } from "react"

const StarRatingInput = ({ stars, disabled, onChange }) => {
  // console.log('star rating input', starRating)
  const [activeRating, setActiveRating] = useState(stars);

  useEffect(() => {
    setActiveRating(stars);
  }, [stars])

  return (
    <>
      <div
        className={activeRating >= 1 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(1);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(1);
        }}
      >
        <i className="fa-regular fa-star" ></i>
      </div>
      <div
        className={activeRating >= 2 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(2);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(2);
        }}
      >
        <i class="fa-regular fa-star" ></i>
      </div>
      <div
        className={activeRating >= 3 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(3);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(3);
        }}
      >
        <i class="fa-regular fa-star" ></i>
      </div>
      <div
        className={activeRating >= 4 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(4);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(4);
        }}
      >
        <i class="fa-regular fa-star" ></i>
      </div>
      <div
        className={activeRating >= 5 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(5);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(5);
        }}
      >
        <i class="fa-regular fa-star" ></i>
      </div>
    </>
  )
}

export default StarRatingInput;
