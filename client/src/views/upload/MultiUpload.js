import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
// import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import ImageSlider from "../imageslider/ImageSlider";

import axios from "axios";


import {
    CLabel,
    CInputFile,
    CButton
} from '@coreui/react';

import serverRoutes from "../../points";
import createServerUrl from "../../inc/functions";

const MultiUpload = (props) => {

    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState(0);

    const singleImageChange = (e) => {
        const filesToUpload = Array.from(e.target.files)
        console.log([
            'files',
            filesToUpload
        ]);
        setFiles(filesToUpload);
    }

    const uploadImage = (e) => {
        console.log([
            'upload',
            files
        ]);

        const formData = new FormData();

        files.forEach((file, i) => {
            formData.append("image", file)
        });

        const url = createServerUrl(serverRoutes.products, props.productId + "/uploadImageGallery");

        axios({
            method: "POST",
            url: url,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" }
        }).then((res) => {
            if (res.data.success != undefined && res.data.success == true) {
                const imageUrl = createServerUrl(serverRoutes.public, props.productId + "/images/" + res.data.imageId + "/?time=" + parseInt(Math.random() * 10000));

                const im = images;
                im.push({
                    id: res.data.imageId,
                    url: imageUrl,
                });
                setImages(im);
                setStatus(Math.random() * 10000);
                alert("Image uploaded");
            }
        })
    }

    const getGalleryImages = () => {
        const url = createServerUrl(serverRoutes.products, props.productId + "/getGallery");

        axios({
            method: "GET",
            url: url,
        }).then((res) => {
            console.log(res.data);
            if (res.data.success != undefined && res.data.success == true) {
                const im = [];
                for (var i = 0; i < res.data.images.length; i++) {
                    const imageUrl = createServerUrl(serverRoutes.public, props.productId + "/images/" + res.data.images[i].id + "/?time=" + parseInt(Math.random() * 10000));

                    im.push({
                        id: res.data.images[i].id,
                        url: imageUrl,
                    });
                }
                setImages(im);
                setStatus(Math.random() * 10000);
            }
        })
    }

    const deleteImage = (e) => {
        if (e.target.attributes.getNamedItem('data-id')) {
            const id = parseInt(e.target.attributes.getNamedItem('data-id').value);

            const url = createServerUrl(serverRoutes.public, props.productId + "/images/" + id + "/delete");

            //delete

            axios.post(url).then((res) => {
                if (res.data.success == true) {

                    const im = images.filter(i => i.id != id);
                    setImages(im);
                    setStatus(Math.random() * 10000);
                    alert("Image deleted");
                }
            })
        } else {
            alert('cannot find id. click again');
        }
        //delete image
    }

    useEffect(async () => {
        console.log("useEffect single");
        getGalleryImages();
    }, []);

    return (
        <div className="wrapper-upload-box">
            <div className="upload-box">
                <div className="upload-body">
                    <div className="title">
                        <CLabel col md="12" htmlFor="file-single-input">Gallery Images</CLabel>
                    </div>
                    <div className="upload-image">
                        <CInputFile id="file-single-input" name="file-single-input" onChange={singleImageChange} />
                        <CButton color="primary" className="px-4" onClick={uploadImage}>Upload</CButton>
                    </div>
                    <ImageSlider images={images} productId={props.productId} delete={deleteImage}></ImageSlider>
                </div>
            </div>
        </div>
    )

}

MultiUpload.propTypes = {
    productId: PropTypes.number
};

MultiUpload.defaultProps = {
    productId: 0
}

export default MultiUpload;
