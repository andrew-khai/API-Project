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
    SpotImages: []
  }

  return (
    <SpotForm
      spot={spot}
      formType="Create Spot"
      />
  )
}

export default CreateASpotForm;
