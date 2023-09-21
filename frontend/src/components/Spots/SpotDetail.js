import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as spotActions from "../../store/spots";
import * as reviewActions from "../../store/reviews";
import { monthEquivalent } from "../../utilities/monthEquivalencies";
import OpenModalButton from "../Modals/OpenModalButton";
import useModal from "../../context/OpenModalContext";
import DeleteReviewModal from "../Modals/DeleteReviewModal";
import PostReviewModal from "../Modals/PostReviewModal";
import "./css/SpotDetail.css"


function SpotDetail() {
    const dispatch = useDispatch();
    const currSpot = useSelector(state => state.spots);
    const currSpotReviews = useSelector(state => Object.values(state.reviews));
    const sessionUser = useSelector(state => state.session.user);
    const {id} = useParams();
    const {setOnModalContent} = useModal();

    useEffect(() => {
        dispatch(spotActions.fetchSingleSpot(id));
        dispatch(reviewActions.fetchSpotReviews(id))
    }, [id])


    const previewImg = currSpot && currSpot.SpotImages && currSpot.SpotImages.find(image => image.preview === true)
    const filteredAdditionalImgs = currSpot && currSpot.SpotImages && currSpot.SpotImages.filter((image => image.preview === false))
    const additionalImgs = filteredAdditionalImgs && filteredAdditionalImgs.map((additionalImg) => {
        return (
            <img src={additionalImg && additionalImg.url} alt={currSpot && currSpot.name} key={additionalImg && additionalImg.id} className="additional-imgs"></img>
        )
    })

    const loadSpotDetails = currSpot && currSpot.Owner && currSpotReviews && sessionUser && (
        <>
        <div className="single-spot-info-header">
            <h1>{currSpot.name}</h1>
            <h2>{currSpot.city}, {currSpot.state}</h2>
        </div>
        <div className="imgs-div">
            <div className="preview-img-div">
            <img src={previewImg && previewImg.url} alt={currSpot.name} className="preview-image"></img>
            </div>
            <div className="additional-imgs-div">
                {additionalImgs}
            </div>
        </div>
        <div className="single-spot-info-container">
            <div className="single-spot-description">
                <h2>{`Hosted by ${currSpot.Owner.firstName} ${currSpot.Owner.lastName}`}</h2>
                <p>{currSpot.description}</p>
            </div>
            <div className="single-spot-info">
                <p>${currSpot.price} night</p>
                <p><i className="fa-solid fa-star" style={{color: "#000000"}}></i>{currSpot.avgStarRating ? currSpot.avgStarRating : "New"} • {currSpot.numReviews && currSpot.numReviews === 1 ? `${currSpot.numReviews} review` : `${currSpot.numReviews} reviews`}</p>
                <button onClick={() => {alert("Feature Coming Soon...")}}>Reserve</button>
            </div>
        </div>

        <hr></hr>
        <div className="reviews-container">
            <div className="review-info">
                <p><i className="fa-solid fa-star" style={{color: "#000000"}}></i>{currSpot.avgStarRating ? currSpot.avgStarRating : "New"} • {currSpot.numReviews && currSpot.numReviews === 1 ? `${currSpot.numReviews} review` : `${currSpot.numReviews} reviews`}</p>
            </div>
            <div className="reviews-div">
                <div className={currSpot.Owner.id !== sessionUser.id && !currSpotReviews.length || currSpotReviews.find((rev => rev.userId !== sessionUser.id)) ? "show-button" : "hide-buttons"}>
                    {console.log(currSpot.Owner.id,currSpotReviews )}
                    <OpenModalButton
                        buttonText="Post Your Review"
                        onButtonClick={() => {setOnModalContent(<PostReviewModal spotId={id}/>)}}
                        modalComponent={<PostReviewModal />}
                    />
                </div>
                {currSpotReviews && currSpotReviews.map((review) => {
                    return (
                        <div className="review">
                            <p>{ review.User && review.User.firstName}</p>
                            <p>{monthEquivalent(review.createdAt.slice(5,7))} {review.createdAt.slice(0,4)}</p>
                            <p>{review.review}</p>
                            <div className={review.userId === sessionUser.id ? "show-button" : "hide-buttons"}>
                                <OpenModalButton
                                    buttonText="Delete"
                                    onButtonClick={() => {setOnModalContent(<DeleteReviewModal reviewId={review.id} spotId={id}/>)}}
                                    modalComponent={<DeleteReviewModal />}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

        </>
    )


    return (
        <div className="single-spot-container">
            {loadSpotDetails}
        </div>
    )
}

export default SpotDetail;
