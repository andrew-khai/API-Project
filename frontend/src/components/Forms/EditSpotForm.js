import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { singleSpotThunk } from "../../store/spots";
import SpotForm from "./SpotForm";

const EditSpotForm = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(singleSpotThunk(spotId))
  }, [dispatch, spotId])

  const spot = useSelector(state => state.spots.singleSpot[spotId]);

  if (!spot) return(<></>)

  return (
    Object.keys(spot).length > 1 && (
      <>
        <SpotForm
          spot={spot}
          formType="Update Spot"
        />
      </>
    )
  );
}

export default EditSpotForm;
