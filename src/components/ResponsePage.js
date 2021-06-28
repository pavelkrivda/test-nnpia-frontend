import React from 'react';

export default function ResponsePage(props) {
    return (
        <div>
            <br/>
            <h2>{props.location.state.title}</h2>
            <div>
                {props.location.state.message}
            </div>
        </div>
    );
}
