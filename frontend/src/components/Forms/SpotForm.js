import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import "./SpotForm.css"
import { addImageThunk, createASpot, editSpotThunk } from "../../store/spots";
import LoadingModal from "../LoadingModal";

const SpotForm = ({ spot, formType }) => {
  // console.log('spot', spot)

  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  // const singleSpot = useSelector(state => {
  //   console.log('state here -----', state)
  // })
  // console.log('singlespot here-----', singleSpot)

  //   const images = [{url: url1, preview:true}, {url:url2, preview:false}...]
  // const [url1, setUrl1]
  // const [url2, setUrl2]
  // const array = [{url:url1, preview: true}, {url:url2, preview:false}...}
  // console.log(spot.SpotImages)

  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(spot?.address);
  const [city, setCity] = useState(spot?.city);
  const [state, setState] = useState(spot?.state);
  const [country, setCountry] = useState(spot?.country);
  const [lat, setLat] = useState(spot?.lat);
  const [lng, setLng] = useState(spot?.lng);
  const [name, setName] = useState(spot?.name);
  const [description, setDescription] = useState(spot?.description);
  const [price, setPrice] = useState(spot?.price);
  const [previewImage, setPreviewImage] = useState(spot.SpotImages ? spot.SpotImages[0] ? spot.SpotImages[0].url : '' : '');
  const [imageOne, setImageOne] = useState(spot.SpotImages ? spot.SpotImages[1] ? spot.SpotImages[1].url : '' : '');
  const [imageTwo, setImageTwo] = useState(spot.SpotImages ? spot.SpotImages[2] ? spot.SpotImages[2].url : '' : '');
  const [imageThree, setImageThree] = useState(spot.SpotImages ? spot.SpotImages[3] ? spot.SpotImages[3].url : '' : '');
  const [imageFour, setImageFour] = useState(spot.SpotImages ? spot.SpotImages[4] ? spot.SpotImages[4].url : '' : '');
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState(null);
  // const [submitted, setSubmitted] = useState(false);

  // console.log('submitted here wooo======', submitted)

  // console.log('preview image here', previewImage)
  // console.log('images', images)

  // useEffect(() => {
  //   const errorsObj = {}
  //   if (!previewImage) errorsObj.previewImage = "Preview image is required";
  //   // if (!previewImage.startsWith('http' || 'https'))
  //   if (!imageOne.endsWith('.png' || '.jpeg' || '.jpg' || '.webp')) errorsObj.imageOne = "Must end with .png, .jpg, or .jpeg";
  //   if (!imageTwo.endsWith('.png' || '.jpeg' || '.jpg' || '.webp')) errorsObj.imageTwo = "Must end with .png, .jpg, or .jpeg";
  //   if (!imageThree.endsWith('.png' || '.jpeg' || '.jpg' || '.webp')) errorsObj.imageThree = "Must end with .png, .jpg, or .jpeg";
  //   if (!imageFour.endsWith('.png' || '.jpeg' || '.jpg' || '.webp')) errorsObj.imageFour = "Must end with .png, .jpg, or .jpeg";
  //   setErrors(errorsObj);
  // }, [previewImage, imageOne, imageTwo, imageThree, imageFour])

  const imageArray = [
    { url: previewImage, preview: true },
    { url: imageOne, preview: false },
    { url: imageTwo, preview: false },
    { url: imageThree, preview: false },
    { url: imageFour, preview: false },
  ]
  // if (formType === "Update Spot") {
  //   console.log('i am here in the form from  edit')
  // }

  // console.log('spot', spot)
  // const imageArr = spot?.SpotImages || [];
  // const init = ['', '', '', '', '']
  // imageArr.forEach((image, index) => init[index] = image.url)
  // console.log('init', init)
  // const [spotImages, setSpotImages] = useState(init);

  // console.log('spotImages over here', spotImages)
  // console.log('preview image here ------', previewImage)
  // console.log('image one here ------', imageOne)
  // console.log('image two here ------', imageTwo)
  // console.log('image three here ------', imageThree)
  // console.log('image four here ------', imageFour)

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
  if (sessionUser.id !== spot.ownerId && formType === 'Update Spot') return <><h2>Forbidden</h2></>

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true);
    spot = { ...spot, address, city, state, country, name, description, price, lat, lng }

    // let errorsObj: = {}

    // setErrors(errorsObj)

    if (formType === 'Create Spot') {
      const newSpot = await dispatch(createASpot(spot))
      // ! Add Images thunk

      const addImage = await dispatch(addImageThunk(images, newSpot.id));
      // console.log('added image here ----', addImage)


      if (newSpot.errors) {
        console.log('form errors', newSpot.errors)
        setErrors(newSpot.errors);
        setIsLoading(false)
        return;
      }

      // if (addImage.errors) {
      //   setErrors(addImage.errors);
      //   return
      // }

      history.push(`/spots/${newSpot.id}`)
    }

    if (formType === 'Update Spot') {
      // console.log('in the update spot if block')
      const updatedSpot = await dispatch(editSpotThunk(spot));
      const addImages = await dispatch(addImageThunk(imageArray, updatedSpot.id))
      // console.log('updated spot here --------', updatedSpot)

      if (updatedSpot.errors) {
        // console.log('in this updated spot errors if block')
        setErrors(updatedSpot.errors);
        setIsLoading(false)
        return
      }

      // const addImage = await dispatch(addImageThunk(imageArray, updatedSpot.id));
      setIsLoading(false)
      history.push(`/spots/${updatedSpot.id}`)
    }
  }

  const updateFiles = e => {
    const files = e.target.files;
    setImages(files);
  };

  return (
    <div id="form-container">
      {isLoading && <LoadingModal />}
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
            <div className="lat-lng-container">
              <label>
                Latitude
                <br></br>
                <input
                  style={{ width: "123%" }}
                  type='number'
                  placeholder='Latitude'
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                />
                {errors.lat &&
                  <span className="errors">{errors.lat}</span>
                }
              </label>
              <label style={{marginRight: "30px"}}>
                Longitude
                <br></br>
                <input
                  style={{ width: "123%" }}
                  type='number'
                  placeholder='Longitude'
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  required
                />
                {errors.lng &&
                  <span className="errors">{errors.lng}</span>
                }
              </label>
            </div>
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
          <label style={{ display: "flex" }}>
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
        {formType === "Create Spot" &&
          <div id="spot-images-container">
            <h3>Liven up your spot with photos</h3>
            <p>Upload at least one photo to publish your spot</p>
            <label>
              Images to Upload
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                multiple
                onChange={updateFiles} />
            </label>

          </div>
        }
        {/* <input
            type="url"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
            placeholder="Preview Image URL"
            style={{ width: '430px' }}
            required
          >
          </input>
          {errors.previewImage &&
            <p className="errors">{errors.previewImage}</p>}
          <input
            type="url"
            value={imageOne}
            onChange={(e) => setImageOne(e.target.value)}
            placeholder="Image URL"
            style={{ width: '430px' }}
          >
          </input>
          {errors.imageOne &&
            <p className="errors">{errors.imageOne}</p>}
          <input
            type="url"
            value={imageTwo}
            onChange={(e) => setImageTwo(e.target.value)}
            placeholder="Image URL"
            style={{ width: '430px' }}
          >
          </input>
          {errors.imageTwo &&
            <p className="errors">{errors.imageTwo}</p>}
          <input
            type="url"
            value={imageThree}
            onChange={(e) => setImageThree(e.target.value)}
            placeholder="Image URL"
            style={{ width: '430px' }}
          >
          </input>
          {errors.imageThree &&
            <p className="errors">{errors.imageThree}</p>}
          <input
            type="url"
            value={imageFour}
            onChange={(e) => setImageFour(e.target.value)}
            placeholder="Image URL"
            style={{ width: '430px' }}
          >
          </input>
          {errors.imageFour &&
            <p className="errors">{errors.imageFour}</p>} */}

        {/* <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p> */}
        {/* !!! need to handle errors for images !!!
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
          } */}

        <div className="create-spot-button-container">
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
