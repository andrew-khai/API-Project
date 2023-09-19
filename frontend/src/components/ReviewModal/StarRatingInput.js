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
        className={activeRating >= 1.0 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(1.0);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(1.0);
        }}
      >
        <i className={activeRating >= 1.0 ? "fa-solid fa-star" : "fa-regular fa-star"} ></i>
      </div>
      <div
        className={activeRating >= 2.0 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(2.0);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(2.0);
        }}
      >
        <i className={activeRating >= 2.0 ? "fa-solid fa-star" : "fa-regular fa-star"} ></i>
      </div>
      <div
        className={activeRating >= 3.0 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(3.0);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(3.0);
        }}
      >
        <i className={activeRating >= 3.0 ? "fa-solid fa-star" : "fa-regular fa-star"} ></i>
      </div>
      <div
        className={activeRating >= 4.0 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(4.0);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(4.0);
        }}
      >
        <i className={activeRating >= 4.0 ? "fa-solid fa-star" : "fa-regular fa-star"} ></i>
      </div>
      <div
        className={activeRating >= 5.0 ? "filled" : "empty"}
        onMouseEnter={() => {
          if (!disabled) setActiveRating(5.0);
        }}
        onMouseLeave={() => {
          if (!disabled) setActiveRating(stars);
        }}
        onClick={() => {
          if (!disabled) onChange(5.0);
        }}
      >
        <i className={activeRating >= 5.0 ? "fa-solid fa-star" : "fa-regular fa-star"} ></i>
      </div>
    </>
  )
}

export default StarRatingInput;
