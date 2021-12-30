import React from 'react';

const ReviewTile = function(props) {
  return (
    <div className="individual-review">
      <div className="review-star-rating">Rating: {props.starRating}</div>
      <div className="review-date">Review Date: {props.reviewDate}</div>
      <div className="review-summary">Review Summary: {props.reviewSummary}</div>
      <div className="review-full-body">Full Review: {props.reviewBody}</div>
      {props.reviewImages.map((image) => {
        return <img className="review-images" key={image.id} src={image.url}></img>
      })}
      <div className="recommend-this-product">{(props.reviewRecommendation ? 'I Recommend this Product \u2713' : null)}</div>
      <div className="reviewer-name">Username: {props.reviewerName}</div>
      <div className="response-from-seller">{(props.reviewResponse ? 'Response from Seller: ' : null)}</div>
      <div className="rating-helpfulness">Was this review helpful? {props.reviewHelpfulness}</div>
    </div>
  )
}

export default ReviewTile;

