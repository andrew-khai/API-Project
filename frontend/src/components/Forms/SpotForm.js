import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SpotForm.css"
import { createASpot, editSpotThunk } from "../../store/spots";

const SpotForm = ({ spot, formType }) => {
  // console.log('spot', spot)

  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);

  const history = useHistory();
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [country, setCountry] = useState(spot?.country);
  const [name, setName] = useState(spot?.name);
  const [description, setDescription] = useState(spot?.description);
  const [price, setPrice] = useState(spot?.price);
  // const [previewImage, setPreviewImage] = useState(spot?.previewImage);
  // console.log('spot', spot)
  const imageArr = spot?.SpotImages || [];
  const init = ['', '', '', '', '']
  imageArr.forEach((image, index) => init[index] = image.url)
  // console.log('init', init)
  const [spotImages, setSpotImages] = useState(init);
  const [errors, setErrors] = useState({});

  console.log('spotImages over here', spotImages)

  // useEffect(() => {
  // const errorsObj = {};
  //   if (!spotImages[0]) errors.spotImages[0] = "Preview image is required";
  //   if (!spotImages[1].endsWith('.png') || !spotImages[1].endsWith('.jpg') || !spotImages[1].endsWith('.jpeg')) errors.spotImages[1] = "Image URL must end in .png, .jpg, or .jpeg";
  //   if (!spotImages[2].endsWith('.png') || !spotImages[2].endsWith('.jpg') || !spotImages[2].endsWith('.jpeg')) errors.spotImages[2] = "Image URL must end in .png, .jpg, or .jpeg";
  //   if (!spotImages[3].endsWith('.png') || !spotImages[3].endsWith('.jpg') || !spotImages[3].endsWith('.jpeg')) errors.spotImages[3] = "Image URL must end in .png, .jpg, or .jpeg";
  //   if (!spotImages[4].endsWith('.png') || !spotImages[4].endsWith('.jpg') || !spotImages[4].endsWith('.jpeg')) errors.spotImages[4] = "Image URL must end in .png, .jpg, or .jpeg";
  //   setErrors(errorsObj)
  // }, [spotImages[0], spotImages[1], spotImages[2], spotImages[3], spotImages[4]])

  if (!sessionUser) return <><h1>Page Not Found</h1></>;
  if (sessionUser.id !== spot.ownerId) return <><h2>Forbidden</h2></>

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    spot = { ...spot, address, city, state, country, name, description, price }


    if (formType === 'Create Spot') {
      const newSpot = await dispatch(createASpot(spot))
      // ! Add Images thunk
      // const addImage = await dispatch(imageThunk(spot.id, image))
      // console.log('newSpot', newSpot)
      // console.log('new error', newSpot?.errors)

      if (newSpot.errors) {
        // console.log('form errors', newSpot.errors)
        setErrors(newSpot.errors);
        return;
      }

      history.push(`/spots/${newSpot.id}`)
    }

    if (formType === 'Update Spot') {
      const updatedSpot = await dispatch(editSpotThunk(spot));

      if (updatedSpot.errors) {
        setErrors(updatedSpot.errors);
        return
      }

      history.push(`/spots/${updatedSpot.id}`)
    }
  }

  return (
    <div id="form-container">
      <form onSubmit={handleSubmit}>
        <div id="location-container">
          {formType === "Create Spot" ?
            <h2>Create a Spot</h2> :
            <h2>Update your Spot</h2>
          }
          <h3>Where's your place located?</h3>
          <p>Guests will only get your exact address once they book a reservation.</p>
          <div id="location-details">
            <label>
              Country
              {errors.country &&
                <span className="errors">{errors.country}</span>
              }
              <br></br>
              <input
                type='text'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="Country"
                style={{ width: '430px' }}
              >
              </input>
            </label>
            <label>
              Street Address
              {errors.address &&
                <span className="errors">{errors.address}</span>
              }
              <br></br>
              <input
                type='text'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
                style={{ width: '430px' }}
              >
              </input>
            </label>
            <label>
              City
              {errors.city &&
                <span className="errors">{errors.city}</span>
              }
              <br></br>
              <input
                type='text'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                style={{ width: '430px' }}
              >
              </input>
            </label>
            <label>
              State
              {errors.state &&
                <span className="errors">{errors.state}</span>
              }
              <br></br>
              <input
                type='text'
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="STATE"
                style={{ width: '430px' }}
              >
              </input>
            </label>
          </div>
        </div>
        <div id="description-container">
          <h3>Describe your place to guests</h3>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <textarea
            type='textarea'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            style={{ width: '430px', height: '100px' }}
          />
          {errors.description &&
            <p className="errors">{errors.description}</p>
          }
        </div>
        <div id="title-spot-container">
          <h3>Create a title for your spot</h3>
          <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
          <input
            text='text'
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            style={{ width: '430px' }}
          >
          </input>
          {errors.name &&
            <p className="errors">{errors.name}</p>
          }
        </div>
        <div id="price-container">
          <h3>Set a base price for your spot</h3>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <label>
            $
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price per night (USD)"
              style={{ width: '415px', marginLeft: '5px' }}
            >
            </input>
            {errors.price &&
              <p className="errors">{errors.price}</p>
            }
          </label>
        </div>
        <div id="spot-images-container">
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>
          {/* !!! need to handle errors for images !!! */}
          {spotImages.map((image, index) => (
            <input
              type="text"
              value={image}
              onChange={(e) => {
                const newSpotImages = [...spotImages]
                newSpotImages[index] = e.target.value;
                setSpotImages(newSpotImages);
              }}
              placeholder={index === 0 ? "Preview Image URL" : "Image URL"}
              style={{ width: '430px' }}
            >
            </input>
          ))
          }

        </div>
        <div class="create-spot-button-container">
          {formType === "Create Spot" ?
            <button type="submit">
              Create Spot
            </button> :
            <button type="submit">
              Update your Spot
            </button>
          }
        </div>
      </form>
    </div>
  )
}

export default SpotForm;
