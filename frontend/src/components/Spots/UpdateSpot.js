import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";

function UpdateSpot() {
    const dispatch = useDispatch();
    const history = useHistory();
    const {id} = useParams();
    const currSpotSelector = useSelector(state => state.spots);
    let currSpot;

    for (let info in currSpotSelector) {
        currSpot = currSpotSelector[info];
    }
    console.log(currSpot)
    const [address, setAddress] = useState(currSpot.address);
    const [city, setCity] = useState(currSpot.city);
    const [state, setState] = useState(currSpot.state);
    const [country, setCountry] = useState(currSpot.country);
    const [lat, setLat] = useState(currSpot.lat);
    const [lng, setLng] = useState(currSpot.lng);
    const [name, setName] = useState(currSpot.name);
    const [description, setDescription] = useState(currSpot.description);
    const [price, setPrice] = useState(currSpot.price);
    const [previewImg, setPreviewImg] = useState(currSpot.previewImage);
    const [valErrors, setValErrors] = useState({});
    const [canSubmit, setCanSubmit] = useState(true);
    const [disableSubmit, setDisableSubmit] = useState(false);


    useEffect(() => {
        const errors = {};
        if (!address) errors.address = "Address is required"
        if (!city) errors.city = "City is required"
        if (!state) errors.state = "State is required"
        if (!country) errors.country = "Country is required"
        if (!lat) errors.lat = "Latitude is required"
        if (!lng) errors.lng = "Longitude is required"
        if (!description) errors.description = "Description needs a minimum of 30 characters"
        if (description && description.length < 30) errors.description = "Description needs a minimum of 30 characters"
        if (!name) errors.name = "Name is required"
        if (!price) errors.price = "Price is required"
        if (!previewImg) errors.previewImg = "Preview image is requred"
        setValErrors(errors);
    }, [address,
        city,
        state,
        country,
        lat,
        lng,
        description,
        name,
        price,
        previewImg,
    ]);

    useEffect(() => {
        console.log(Object.values(valErrors).length, ':length of errors')
        if (canSubmit && !Object.values(valErrors).length) setDisableSubmit(false);
        if (!canSubmit && Object.values(valErrors).length) setDisableSubmit(true);
        if (!canSubmit && !Object.values(valErrors).length) setDisableSubmit(false);
    }, [valErrors, canSubmit])


    const handleFormSubmit = (e) => {
        e.preventDefault();

        if (Object.values(valErrors).length) {
            setCanSubmit(false);
            setDisableSubmit(true);
            console.log('Current errors:', valErrors)
            console.log('You have errors to fix')
        }
        else {
            setCanSubmit(true);
            const newSpot = {
                address,
                city,
                state,
                country,
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                name,
                description,
                price: parseInt(price)
            };

            const newSpotPrevImg = {
                url: previewImg,
                preview: true
            };
            dispatch(spotActions.updateSingleSpot(id, newSpot, newSpotPrevImg));
            history.push(`/spots/${id}`)
        }
    };



    return (
        <div className="create-spot-component-div">
            <h1>Update your Spot</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="spot-location-div">
                    <h2>Where's your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                        <label>Country</label>
                        <div className="errors-div">{!canSubmit && valErrors.country && `* ${valErrors.country}`}</div>
                        <input
                        type="text"
                        placeholder="Country"
                        name="country"
                        value={country}
                        onChange={(e) => {setCountry(e.target.value)}}
                        />
                        <label>Street Address</label>
                        <div className="errors-div">{!canSubmit && valErrors.address && `* ${valErrors.address}`}</div>
                        <input
                        type="text"
                        placeholder="Address"
                        name="address"
                        value={address}
                        onChange={(e) => {setAddress(e.target.value)}}
                        />
                        <label>City</label>
                        <div className="errors-div">{!canSubmit && valErrors.city && `* ${valErrors.city}`}</div>
                        <input
                        type="text"
                        placeholder="City"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        />
                        <label>State</label>
                        <div className="errors-div">{!canSubmit && valErrors.state && `* ${valErrors.state}`}</div>
                        <input
                        type="text"
                        placeholder="STATE"
                        name="state"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        />
                        <label>Latitude</label>
                        <div className="errors-div">{!canSubmit && valErrors.lat && `* ${valErrors.lat}`}</div>
                        <input
                        type="text"
                        placeholder="Latitude"
                        name="latitude"
                        value={lat}
                        onChange={(e) => setLat(e.target.value)}
                        />
                        <label>Longitude</label>
                        <div className="errors-div">{!canSubmit && valErrors.lng && `* ${valErrors.lng}`}</div>
                        <input
                        type="text"
                        placeholder="Longitude"
                        name="longitude"
                        value={lng}
                        onChange={(e) => setLng(e.target.value)}
                        />
                </div>

                <hr></hr>

                <div className="spot-description-div">
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>
                        <textarea
                        placeholder="Please write at least 30 characters"
                        name="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                         <div className="errors-div">{!canSubmit && valErrors.description && `* ${valErrors.description}`}</div>
                </div>

                <hr></hr>

                <div className="spot-title-div">
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        <input
                        type="text"
                        placeholder="Name of your spot"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        ></input>
                         <div className="errors-div">{!canSubmit && valErrors.name && `* ${valErrors.name}`}</div>
                </div>

                <hr></hr>

                <div className="spot-price-div">
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        <input
                        type="number"
                        placeholder="Price per night (USD)"
                        name="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        ></input>
                         <div className="errors-div">{!canSubmit && valErrors.price && `* ${valErrors.price}`}</div>
                </div>

                <hr></hr>

                <div className="spot-images-div">
                    <h2>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                        <input
                        type="text"
                        placeholder="Preview Image URL"
                        name="preview-img"
                        value={previewImg}
                        onChange={(e) => {setPreviewImg(e.target.value)}}
                        ></input>
                         <div className="errors-div">{!canSubmit && valErrors.previewImg && `* ${valErrors.previewImg}`}</div>
                        <input
                        type="text"
                        placeholder="Image URL"
                        ></input>
                        <input
                        type="text"
                        placeholder="Image URL"
                        ></input>
                        <input
                        type="text"
                        placeholder="Image URL"
                        ></input>
                        <input
                        type="text"
                        placeholder="Image URL"
                        ></input>
                </div>

                <hr></hr>

                <div className="submit-button-div">
                    <button type="submit" className="submit-button" disabled={disableSubmit}>Update your Spot</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateSpot;
