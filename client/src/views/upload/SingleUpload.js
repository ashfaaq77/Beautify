import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import axios from "axios";

import {
    CTextarea,
    CLabel,
    CInputFile
} from '@coreui/react';

import serverRoutes from "../../points";
import createServerUrl from "../../inc/functions";

const SingleUpload = (props) => {

    const [image, setImage] = useState("");

    const singleImageChange = (e) => {

        const files = Array.from(e.target.files)
        const formData = new FormData();

        files.forEach((file, i) => {
            formData.append("image", file)
        });

        const url = createServerUrl(serverRoutes.products, props.productId + "/uploadImageFeatured");

        axios({
            method: "POST",
            url: url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        }).then((res) => {
            if (res.data.success != undefined && res.data.success == true) {
                const imageUrl = createServerUrl(serverRoutes.public, props.productId + "/images/featured/?time=" + parseInt(Math.random() * 10000));

                setImage(imageUrl);
                alert("Image Uploaded");
            }

        })
    }

    const getFeaturedImage = () => {
        const imageUrl = createServerUrl(serverRoutes.public, props.productId + "/images/featured/?time=" + parseInt(Math.random() * 10000));

        setImage(imageUrl);
    }


    useEffect(async () => {
        console.log("useEffect single");
        getFeaturedImage();
    }, []);

    console.log(image);
    return (
        <div className="wrapper-upload-box">
            <div className="upload-box">
                <div className="upload-body">
                    <CLabel col md="12" htmlFor="file-single-input">Featured Image</CLabel>
                    <CInputFile id="file-single-input" name="file-single-input" onChange={singleImageChange} />
                    <img src={image} width="500px"></img>
                </div>
            </div>
        </div>
    )

}

SingleUpload.propTypes = {
    productId: PropTypes.number
};

SingleUpload.defaultProps = {
    productId: 0
}

export default SingleUpload
