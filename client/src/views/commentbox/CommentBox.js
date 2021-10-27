import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import axios from "axios";

import serverRoutes from "../../points";
import createServerUrl from "../../inc/functions";

//component - CoreUI / CommentBox
import {
    CTextarea,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';


const CommentBox = (props) => {

    /**
     * Set User via context
     */

    const [chat, setChat] = useState("");
    const [chatroom, setChatroom] = useState([]);

    const chatOnChange = (e) => {
        setChat(e.target.value);
    }

    const addToChat = (e) => {
        const c = {
            msg: chat,
            user: ""
        };

        setChatroom([...chatroom, c]);
        setChat("");

        const data = {
            notes: c.msg,
        }

        const updateUrl = createServerUrl(serverRoutes.orders, props.orderid + '/notes');

        axios.post(updateUrl, data).then((res) => {
            console.log(res);
            if (res.data.message == undefined) {
                console.log(res.data);
            } else if (res.data.message == 'succcess') {
                alert(res.data.orderid);
                console.log(res);
            } else if (res.data.message != undefined) {
                alert(res.data.message);
            }
        });
    }

    useEffect(async () => {
        console.log("useEffect");
        getContent();
    }, []);


    const getContent = () => {
        const notesUrl = createServerUrl(serverRoutes.orders, props.orderid + '/notes');

        try {
            // var c = {
            //     msg: chat,
            //     user: "Ashfaaq @ 13/08/2021 05:04:04pm"
            // };
            axios.get(notesUrl).then(res => {
                if (res.data.message == 'success') {
                    // console.log(res.data.notes);
                    // var c = {
                    //     msg: chat,
                    //     user: "Ashfaaq @ 13/08/2021 05:04:04pm"
                    // };
                    const c = [];

                    res.data.notes.forEach((i) => {
                        c.push({
                            'msg': i.notes,
                            'user': i.UserId
                        })
                    })

                    setChatroom(c);
                }
            });

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="wrapper-chat">
            <div className="chat-box">
                <div className="chat-body">
                    <div className="msg-insert">
                        {chatroom.length > 0 &&
                            chatroom.map((i, k) => {
                                return (
                                    <div className='msg-receive user'>
                                        {i.msg}
                                        <br />
                                        <span className="commentator-name">User: {i.user}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="chat-text">
                        <CTextarea
                            name="textarea-input"
                            id="textarea-input"
                            rows="9"
                            placeholder="Content..."
                            onChange={chatOnChange}
                            value={chat}
                        />
                        <FontAwesomeIcon onClick={addToChat} icon={faPaperPlane} />
                    </div>
                </div>
            </div>
        </div>
    )

}

CommentBox.propTypes = {
    orderid: PropTypes.number
};

CommentBox.defaultProps = {
    orderid: 0
}

export default CommentBox
