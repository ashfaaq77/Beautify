import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from "axios";
import { useHistory } from "react-router-dom";
// import AuthContext from "../../context/AuthContext";
import Walker from "../../inc/Walker";

import {
    CButton,
    CCard,
    CCardBody,
    CSelect,
    CCol,
    CForm,
    CInput,
    CInputGroup,
    CListGroup,
    CListGroupItem,
    CInputCheckbox,
    CRow,
    CFormGroup,
    CTextarea,
    CLabel,
} from '@coreui/react';

import {
    CIcon
} from '@coreui/icons-react';

const Product = ({ match }) => {

    const [title, setTitle] = useState(match.params.id);
    const [errormsg, setErrormsg] = useState("");
    const [successmsg, setSuccessmsg] = useState("");

    const [productTitle, setProductTitle] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [salePrice, setSalesPrice] = useState("");
    const [taxable, setTaxable] = useState(0);
    const [stock, setStock] = useState(0);
    const [quantity, setQuatity] = useState("");
    const [preOrders, setPreOrders] = useState(0);

    const [categoriesList, setCategoriesList] = useState([]);
    const [attributesList, setAttributesList] = useState([]);

    const [categoriesArray, setCategoriesArray] = useState([]);
    const [attributesArray, setAttributesArray] = useState([]);

    const [selectedAttributesObj, setSelectedAttributesObj] = useState([]);

    const [selectedAttributesArrays, setSelectedAttributesArrays] = useState({});

    const [categories, setCategories] = useState("");
    const [selectedAttributes, setSelectedAttributes] = useState("");

    const [currentProducts, setCurrentProducts] = useState({});
    const history = useHistory();

    let selectedAttributesArray = {};

    function getProduct(id) {
        const productUrl = "http://localhost:5000/products/" + id;
        try {
            axios.get(productUrl).then((res) => {
                console.log(res);
                setCurrentProducts(res.data);
                setProductTitle(res.data.title);
                setProductDescription(res.data.description);
                setSku(res.data.sku);
                setPrice(res.data.regular_price);
                setSalesPrice(res.data.sale_price);

                if (res.data.taxable) {
                    setTaxable(1);
                } else {
                    setTaxable(0);
                }

                if (res.data.stock) {
                    setStock(1);
                } else {
                    setStock(0);
                }

                if (res.data.quantity) {
                    setQuatity(1);
                } else {
                    setQuatity(0);
                }

                setPreOrders(res.data.pre_orders);

                if (Object.keys(res.data.ProductCategories).length > 0) {
                    let selectedCat = [];
                    Object.keys(res.data.ProductCategories).forEach((i, k) => {
                        if (selectedCat.indexOf(res.data.ProductCategories[i].CategoryId) === -1) {
                            selectedCat.push(res.data.ProductCategories[i].CategoryId.toString());
                        }
                    })

                    setCategoriesArray([...categoriesArray, ...selectedCat]);
                }

                getAttributes(res.data.ProductAttributes);

            });
        } catch (err) {
            console.error(err);
        }
    }

    //Hooks
    useEffect(() => {
        getCategories();
        // getAttributes();

        if (match.params.id > 0) {
            setTitle("Edit Product");
            getProduct(match.params.id);
        } else {
            setTitle("Add New Product");
            getAttributes();
        }
    }, []);


    //Getter
    function getCategories() {
        try {
            const url = "http://localhost:5000/categories/";

            axios.get(url).then((res) => {
                if (res.data.length > 0) {
                    setCategoriesList(Walker(res.data, [], [], []))
                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    function getAttributes(attributesS = {}) {
        try {
            const url = "http://localhost:5000/attributes/";

            axios.get(url).then((res) => {
                setAttributesArray(res.data);

                setAttributesList(res.data.map((i) => {
                    return (<option key={i.id} value={i.id}>{i.name}</option>)
                }));

                console.log(attributesS);
                if (Object.keys(attributesS).length > 0) {

                    const newValues = [];
                    const newObjs = {};

                    Object.keys(attributesS).forEach((i, k) => {
                        const selectedAttributesCopy = res.data.find((j) => {
                            return j.id == attributesS[i].AttributeId;
                        });

                        console.log([
                            selectedAttributesCopy,
                        ]);

                        if (selectedAttributesCopy.id != undefined) {

                            const field = selectedAttributesCopy.type == 'text' ? true : false;

                            const key = Math.random();

                            const newValue = {
                                'id': selectedAttributesCopy.id,
                                'key': key,
                                'name': selectedAttributesCopy.name,
                                'values': selectedAttributesCopy.values,
                                'value': "",
                                'field': field,
                            };

                            newValues.push(newValue);
                            newObjs[key] = attributesS[i].values;
                        }
                    });

                    selectedAttributesArray = { ...selectedAttributesArray, ...newObjs };

                    setSelectedAttributesArrays({ ...selectedAttributesArrays, ...selectedAttributesArray });

                    setSelectedAttributesObj([...selectedAttributesObj, ...newValues]);

                }
            })
        } catch (err) {
            console.error(err);
        }
    }

    //Setter
    const productTitleOnChange = (e) => {
        setProductTitle(e.target.value);
    }

    const skuOnChange = (e) => {
        setSku(e.target.value);
    }

    const descriptionOnChange = (e) => {
        setProductDescription(e.target.value);
    }

    const priceOnChange = (e) => {
        setPrice(e.target.value);
    }

    const salePriceOnChange = (e) => {
        setSalesPrice(e.target.value);
    }

    const taxableOnChange = (e) => {
        if (e.target.checked) {
            setTaxable(1);
        } else {
            setTaxable(0);
        }
    }

    const stockOnChange = (e) => {
        if (e.target.checked) {
            setStock(1);
        } else {
            setStock(0);
        }
    }

    const quantityOnChange = (e) => {
        setQuatity(e.target.value);
    }

    const preOrdersOnChange = (e) => {
        if (e.target.checked) {
            setPreOrders(1);
        } else {
            setPreOrders(0);
        }
    }

    async function attributesOnChange(e) {
        await setSelectedAttributesArrays({ ...selectedAttributesArrays, ...selectedAttributesArray });
        setSelectedAttributes(e.target.value);
    }

    const attributesData = (e) => {
        const sel = selectedAttributesObj.find((i) => {
            return i.key == e.target.name;
        });

        selectedAttributesArray = selectedAttributesArrays;
        selectedAttributesArray[sel.key] = e.target.value;

    }

    //delete attributes
    async function removeAttributes(e) {
        e.preventDefault();
        if (e.target.attributes.idremove != undefined) {
            const id_to_remove = e.target.attributes.idremove.value;
            const newAttributes = selectedAttributesObj.filter((element) => {
                return element.key != id_to_remove
            })
            setSelectedAttributesObj(newAttributes);

            const newAttibutesArray = selectedAttributesArrays;

            if (newAttibutesArray[id_to_remove]) {
                delete newAttibutesArray[id_to_remove];
            }

            await setSelectedAttributesArrays(newAttibutesArray);

        }
    }

    //attribute
    async function attributeOnClick(e) {
        e.preventDefault();

        if (selectedAttributes != "") {
            const selectedAttributesCopy = attributesArray.find((i) => {
                return i.id == selectedAttributes;
            });

            if (selectedAttributesCopy.id != undefined) {

                const field = selectedAttributesCopy.type == 'text' ? true : false;

                const key = Math.random();

                const newValue = {
                    'id': selectedAttributesCopy.id,
                    'key': key,
                    'name': selectedAttributesCopy.name,
                    'values': selectedAttributesCopy.values,
                    'value': "",
                    'field': field,
                };

                const newObj = {};
                newObj[key] = "";

                selectedAttributesArray = { ...selectedAttributesArray, ...newObj };

                await setSelectedAttributesArrays({ ...selectedAttributesArrays, ...selectedAttributesArray });

                setSelectedAttributesObj([...selectedAttributesObj, newValue]);

            }
        }

    };


    const categoriesSelect = (e) => {
        if (categoriesArray.indexOf(e.target.value.toString()) != -1) {
            setCategoriesArray(categoriesArray.filter((id) => {
                return id != e.target.value;
            }));
        } else {
            setCategoriesArray([...categoriesArray, e.target.value]);
        }
    }

    const test = (e) => {
        console.log("click");
    }


    //Update
    const updateProduct = (e) => {
        e.preventDefault();

        console.log([
            'Attributes',
            selectedAttributesArrays,
            selectedAttributesArray,
            selectedAttributesObj
        ]);

        const attributesSelectedFinal = {};

        Object.keys(selectedAttributesArrays).forEach((i, k) => {
            let value = selectedAttributesArrays[i];

            let obj = selectedAttributesObj.find((e) => {
                return e.key == i;
            });

            if (obj) {
                if (!attributesSelectedFinal[obj.id]) {
                    attributesSelectedFinal[obj.id] = [];
                }

                attributesSelectedFinal[obj.id].push(value);
            }
        })

        const data = {
            'title': productTitle,
            'description': productDescription,
            'sku': sku,
            'regular_price': parseFloat(price),
            'sale_price': parseFloat(salePrice),
            'taxable': parseInt(taxable),
            'stock': parseInt(stock),
            'quantity': parseInt(quantity),
            'pre_orders': parseInt(preOrders),
            'attributes': attributesSelectedFinal,
            'categories': categoriesArray
        }

        const url = "http://localhost:5000/products/" + match.params.id;

        axios.post(url, data).then((res) => {
            console.log(res);

        });
    }

    return (
        <CRow>
            <CCol lg={6}>
                <CCard>
                    <CCardBody>
                        <CForm onSubmit={updateProduct}>
                            <h5>{title}</h5>
                            <p>{successmsg}</p>
                            <p>{errormsg}</p>
                            <CLabel htmlFor="basic-url">Product Name</CLabel>
                            <CInputGroup className="mb-4">
                                <CInput type="text" placeholder="Name" defaultValue={productTitle} onChange={productTitleOnChange} />
                            </CInputGroup>
                            <CLabel htmlFor="basic-url">Product SKU</CLabel>
                            <CInputGroup className="mb-4">
                                <CInput type="text" placeholder="SKU" defaultValue={sku} onChange={skuOnChange} />
                            </CInputGroup>
                            <CLabel htmlFor="basic-url">Description</CLabel>
                            <CInputGroup className="mb-4">
                                <CTextarea
                                    name="textarea-input"
                                    id="textarea-input"
                                    rows="9"
                                    placeholder="Description..."
                                    defaultValue={productDescription}
                                    onChange={descriptionOnChange}
                                />
                            </CInputGroup>
                            <CLabel htmlFor="basic-url">Product Price</CLabel>
                            <CInputGroup className="mb-4">
                                <CInput type="number" placeholder="price" defaultValue={price} onChange={priceOnChange} />
                            </CInputGroup>
                            <CLabel htmlFor="basic-url">Sale Price</CLabel>
                            <CInputGroup className="mb-4">
                                <CInput type="number" placeholder="Sale Price" value={salePrice} onChange={salePriceOnChange} />
                            </CInputGroup>
                            <CInputGroup className="mb-4">
                                <CLabel>Taxable</CLabel>
                                <CInputCheckbox
                                    id="taxable"
                                    value="1"
                                    checked={taxable}
                                    onChange={taxableOnChange}
                                />
                            </CInputGroup>

                            <CInputGroup className="mb-4">
                                <CLabel>Enable Stock?</CLabel>
                                <CInputCheckbox
                                    id="stock"
                                    value="1"
                                    checked={stock}
                                    onChange={stockOnChange}
                                />
                            </CInputGroup>
                            {stock == 1 && (
                                <CInputGroup className="mb-4">
                                    <CLabel>Quantity</CLabel>
                                    <CInput type="number" defaultValue={quantity} onChange={quantityOnChange} />
                                </CInputGroup>
                            )}
                            <CInputGroup className="mb-4">
                                <CLabel>Allow Pre Orders?</CLabel>
                                <CInputCheckbox
                                    id="pre_orders"
                                    value="1"
                                    checked={preOrders}
                                    onChange={preOrdersOnChange}
                                />
                            </CInputGroup>


                            <CFormGroup>
                                <CInputGroup className="mb-4">
                                    <CLabel>Attributes</CLabel>
                                </CInputGroup>

                                <CInputGroup className="mb-4">
                                    <CSelect custom name="type" id="attribute" onChange={attributesOnChange}>
                                        <option key="0" value="">Select Attributes</option>
                                        {attributesList}
                                    </CSelect>
                                    <CButton color="primary" className="px-4" onClick={attributeOnClick}>Add Attribute</CButton>
                                </CInputGroup>
                                <CListGroup className="attributes-wrapper">
                                    {selectedAttributesObj.map((i) => {
                                        return (
                                            <CListGroupItem key={Math.random()}>
                                                <p>{i.name}</p>
                                                {i.field ? (
                                                    <CInput name={i.key} className="attributes-field" type="text" defaultValue={selectedAttributesArrays[i.key]} onChange={attributesData} />
                                                ) : (
                                                    <CSelect name={i.key} custom className="attribute-selected attributes-field" defaultValue={selectedAttributesArrays[i.key]} onChange={attributesData}>
                                                        <option key={Math.random()} value="">Select a value</option>
                                                        {
                                                            i.values.split("\n").map((option) => {
                                                                const count = Math.random();
                                                                if (option.split(":").length == 1) {
                                                                    return (
                                                                        <option key={count} value={option}>{option}</option>
                                                                    )
                                                                } else {
                                                                    const options = option.split(":");
                                                                    return (
                                                                        <option key={count} value={options[0]}>{options[1]}</option>
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    </CSelect>
                                                )}
                                                <CButton className="px-4" idremove={i.key} onClick={removeAttributes}><CIcon idremove={i.key} onClick={removeAttributes} name="cilX"></CIcon></CButton>
                                            </CListGroupItem>
                                        );
                                    })}
                                </CListGroup>
                            </CFormGroup>

                            <CFormGroup>
                                <CInputGroup className="mb-4">
                                    <CLabel>Categories</CLabel>
                                </CInputGroup>

                                <CInputGroup className="mb-4">
                                    <CFormGroup key={Math.random()} variant="checkbox" className="categories" id="categories" name="type">
                                        {categoriesList.map((element) => {
                                            const mystyle = {
                                                'marginLeft': element.count
                                            };

                                            const checked = categoriesArray.indexOf(element.id.toString()) != -1 ? "checked" : false;

                                            return (
                                                <div style={mystyle} key={Math.random()}>
                                                    <CInputCheckbox
                                                        key={element.id}
                                                        className="checkbox-categories"
                                                        name={element.name}
                                                        parent={element.parent}
                                                        value={element.id}
                                                        onClick={categoriesSelect}
                                                        defaultChecked={checked}
                                                    />
                                                    <CLabel variant="checkbox" className="form-check-label" htmlFor="checkbox-categories">{element.name}</CLabel>
                                                </div>
                                            )
                                        })}
                                    </CFormGroup>
                                </CInputGroup>
                            </CFormGroup>

                            <CRow>
                                <CCol xs="12">
                                    <CButton color="primary" className="px-4" type="submit">{title}</CButton>
                                </CCol>
                            </CRow>
                        </CForm>
                    </CCardBody>
                </CCard>
            </CCol>
        </CRow >
    )
}

export default Product;



// 1. Product
// 1. Regular Price
// 2. Sale Price
// 3. Choose if taxable
//     4. SKU
// 5. Enable stock management
// 1. Quantity
// 2. Allow pre orders

// 6. Shipping ?

// 7. Attributes
// 1. Add
// 2. select

// 8. Categories
// 1. Add
// 2. Select

// 9. Wysiwig Field
// 10. Title

// 11. Gallery
// 12. Featured Image

// 13. Measurement
// 1. Weight
// 2. Dimensions

// 14. Customer Reviews
// 1. Product
// 2. User
