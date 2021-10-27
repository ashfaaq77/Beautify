import React from 'react'

import 'react-slideshow-image/dist/styles.css'
import { Slide } from 'react-slideshow-image';

import PropTypes from 'prop-types'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';


const ImageSlider = (props) => {



    if (props.images.length <= 0) {
        return (
            <h1>No Images</h1>
        )
    }

    console.log([
        'images slider',
        props.images
    ]);
    return (
        <div className="slide-container">
            <Slide>
                {props.images.map((slideImage, index) => (
                    <div className="each-slide" key={index}>
                        <img src={slideImage.url} style={{ width: "500px", objectFit: "cover" }}></img>
                        <div class="image-delete">
                            <FontAwesomeIcon icon={faTimesCircle} data-id={slideImage.id} onClick={props.delete}></FontAwesomeIcon>
                        </div>
                    </div>
                ))}
            </Slide>
        </div >
    )

}

ImageSlider.propTypes = {
    images: PropTypes.array,
    productId: PropTypes.number
};

ImageSlider.defaultProps = {
    images: [],
    productId: 0
}

export default ImageSlider
