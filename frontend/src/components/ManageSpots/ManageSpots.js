import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getAllSpots } from "../../store/spots";

const ManageSpots = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSpots())
  }, [dispatch])

  const allSpots = useSelector(state => state.spots.allSpots)
  console.log(allSpots)

  return (
    <>
      <h1>MANAGE SPOTS</h1>
    </>
  )
}

export default ManageSpots;
