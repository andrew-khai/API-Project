import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import "./SpotForm.css"
import { createASpot } from "../../store/spots";

const SpotForm = ({ spot, formType }) => {

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
  const [previewImage, setPreviewImage] = useState(spot?.previewImage)
  const [imageOne, setImageOne] = useState('')
  const [imageTwo, setImageTwo] = useState('')
  const [imageThree, setImageThree] = useState('')
  const [imageFour, setImageFour] = useState('')
  const [errors, setErrors] = useState({});

  if (!sessionUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    spot = {...spot, address, city, state, country, name, description, price, previewImage, imageOne, imageTwo, imageThree, imageFour}

    if (formType === 'Create Spot') {
      const newSpot = await dispatch(createASpot(spot))
      console.log('newSpot', newSpot)

      if (newSpot.errors) {
        setErrors(newSpot.errors);
        return;
      }

      history.push(`/spots/${newSpot.id}`)
    }
  }

  return (
    <>
      {sessionUser && (
        // todo Eventually will be form types
        <div id="form-container">
          <form onSubmit={handleSubmit}>
            <div id="location-container">
              <h2>Create a Spot</h2>
              <h3>Where's your place located?</h3>
              <p>Guests will only get your exact address once they book a reservation.</p>
              <div id="location-details">
                <label>
                  Country {errors.country}
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
                id=""
                type='textarea'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please write at least 30 characters"
                style={{ width: '430px', height: '100px' }}
              />
              {/* <p className="errors">{errors.description}</p> */}
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
                  style={{ width: '415px', marginLeft: '5px'}}
                >
                </input>
              </label>
            </div>
            <div id="spot-images-container">
              <h3>Liven up your spot with photos</h3>
              <p>Submit a link to at least one photo to publish your spot.</p>
              <input
                type="text"
                value={previewImage}
                onChange={(e) => setPreviewImage(e.target.value)}
                placeholder="Preview Image URL"
                style={{ width: '430px' }}
              >
              </input>
              <input
                type="text"
                value={imageOne}
                onChange={(e) => setImageOne(e.target.value)}
                placeholder="Image URL"
                style={{ width: '430px' }}
              >
              </input>
              <input
                type="text"
                value={imageTwo}
                onChange={(e) => setImageTwo(e.target.value)}
                placeholder="Image URL"
                style={{ width: '430px' }}
              >
              </input>
              <input
                type="text"
                value={imageThree}
                onChange={(e) => setImageThree(e.target.value)}
                placeholder="Image URL"
                style={{ width: '430px' }}
              >
              </input>
              <input
                type="text"
                value={imageFour}
                onChange={(e) => setImageFour(e.target.value)}
                placeholder="Image URL"
                style={{ width: '430px' }}
              >
              </input>
            </div>
            <div class="create-spot-button-container">
              <button type="submit">
                Create Spot
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

export default SpotForm;
