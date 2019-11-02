import React from 'react';
import { CSSTransition } from 'react-transition-group';

export const CustomCSSTransition = ({children, ...props}) => {
    // return (
    //     !props.isVisible ?
    //     children
    //     :
    //     props.content
    //     // <div>
    //     //     {
    //     //         !props.isVisible && (
    //     //             children
    //     //         )
    //     //     }
    //     //     <CSSTransition
    //     //         in={props.isVisible}
    //     //         timeout={300}
    //     //         classNames="show-hide"
    //     //         unmountOnExit
    //     //     >
    //     //     {props.content}
    //     //     </CSSTransition>
    //     // </div>
    // );
    return (
        <div>
            <div className={props.isVisible ? 'class-hidden' : ''}>{children}</div>
            {
                props.isVisible && (props.content)
            }
        </div>
    );
}
