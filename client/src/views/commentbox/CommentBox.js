import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

//component - CoreUI / CommentBox
import {
    CTextarea,
} from '@coreui/react';

import CIcon from '@coreui/icons-react';


const CommentBox = props => {

    /**
     * Set User via context
     */

    const [chat, setChat] = useState("");
    const [chatroom, setChatroom] = useState([]);

    const chatOnChange = (e) => {
        setChat(e.target.value);
    }

    const addToChat = (e) => {
        var c = {
            msg: chat,
            user: "Ashfaaq @ 13/08/2021 05:04:04pm"
        };

        setChatroom([...chatroom, c]);
        setChat("");
    }

    return (
        <div class="wrapper-chat">
            <div class="chat-box">
                <div class="chat-body">
                    <div class="msg-insert">
                        {chatroom.length > 0 &&
                            chatroom.map((i, k) => {
                                console.log(i);
                                return (
                                    <div class='msg-receive user'>
                                        {i.msg}
                                        <br />
                                        <span class="commentator-name">User: {i.user}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div class="chat-text">
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
    tag: "",
    className: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    color: PropTypes.string,
    shape: PropTypes.oneOf(['', 'pill'])
};

CommentBox.defaultProps = {
    tag: 'span'
}

export default CommentBox
