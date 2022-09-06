import Rating from "@mui/material/Rating";
import { getRating } from "../utils/rating";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

function BikeRating(props) {
    const { reviews = [], bikeId, isManager } = props;

    const onChange = (event, newValue) => {
        try {
            const bikeDocRef = doc(db, "bikes", bikeId);
            updateDoc(bikeDocRef, { reviews: [...reviews, newValue] });
        } catch (err) {
            console.log("Failed to update ratings", err);
        }
    };

    return (
        <Rating
            disabled={isManager}
            onChange={onChange}
            value={reviews.length >= 1 ? getRating(reviews) : 0}
            name="rating"
            size="large"
            precision={1}
        />
    );
}

export default BikeRating;
