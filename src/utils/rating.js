export const getRating = (reviews = []) => {
    const sum = (accumulator, currentValue) => accumulator + currentValue;
    return Math.ceil(reviews.reduce(sum, 0) / reviews.length);
}