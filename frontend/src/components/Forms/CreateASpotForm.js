import SpotForm from "./SpotForm";

const CreateASpotForm = () => {
  const spot = {
    address: '',
    city: '',
    state: '',
    country: '',
    name: '',
    description: '',
    price: '',
    previewImage: '',
    imageOne: '',
    imageTwo: '',
    imageThree: '',
    imageFour: '',
  }

  return (
    <SpotForm
      spot={spot}
      formType="Create Spot"
      />
  )
}

export default CreateASpotForm;
