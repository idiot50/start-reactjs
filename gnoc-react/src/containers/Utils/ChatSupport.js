import React, { Component } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import PropTypes from 'prop-types';
import { translate, Trans } from 'react-i18next';
import Draggable, {DraggableCore} from 'react-draggable';

class ChatSupport extends Component {
    constructor(props) {
        super(props);

        this.handleDrag = this.handleDrag.bind(this);
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onControlledDrag = this.onControlledDrag.bind(this);
        this.onControlledDragStop = this.onControlledDragStop.bind(this);
        this.toggle = this.toggle.bind(this);

        this.state = {
            popoverOpen: false,
            activeDrags: 0,
            deltaPosition: {
                x: 0, y: 0
            },
            controlledPosition: {
                x: 0, y: window.innerHeight - 75
            }
        };
    }

    handleDrag(e, ui) {
        const { x, y } = this.state.deltaPosition;
        this.setState({
            deltaPosition: {
                x: x + ui.deltaX,
                y: y + ui.deltaY
            },
        });
    }

    onStart() {
        let activeDrags = this.state.activeDrags;
        this.setState({
            activeDrags: ++activeDrags,
        });
    }

    onStop() {
        let activeDrags = this.state.activeDrags;
        this.setState({
            activeDrags: --activeDrags,
        });
    }

    onControlledDrag(e, position) {
        const maxHeight = window.innerHeight - 75;
        const maxWidth = window.innerWidth - 95;
        let x = 0, y = 0;
        if (position.x > maxWidth/2) {
            x = maxWidth;
        }
        if (position.y > 0) {
            y = position.y;
        }
        if (position.y > maxHeight) {
            y = maxHeight;
        }
        this.setState({
            controlledPosition: { x, y }
        });
    }

    onControlledDragStop(e, position) {
        this.onControlledDrag(e, position);
        this.onStop();
    }

    toggle(e) {
        if (e) {
            e.stopPropagation();
        } else {
            window.event.cancelBubble = true;
        }
        this.setState({
            popoverOpen: !this.state.popoverOpen,
        });
      }

    render() {
        const dragHandlers = { onStart: this.onStart, onStop: this.onStop };
        const { deltaPosition, controlledPosition } = this.state;
        return (
            <Draggable {...dragHandlers}
                // defaultPosition={{ x: 25, y: 25 }}
                position={controlledPosition}
                // onDrag={this.handleDrag}
                onStop={this.onControlledDragStop}
                >
                <div className="chat-support-main">
                    <i style={{position: 'absolute', marginLeft: '-15px'}} className="fa fa-comments-o"
                        id={'Popover-' + this.props.id} onClick={this.toggle}></i>
                    <Popover placement="left" isOpen={this.state.popoverOpen} target={'Popover-' + this.props.id} toggle={this.toggle}>
                        <PopoverHeader>Popover Title</PopoverHeader>
                        <PopoverBody>Sed posuere consectetur est at lobortis. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.</PopoverBody>
                    </Popover>
                </div>
            </Draggable>
        );
    }
}

ChatSupport.propTypes = {
    placeholder: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.string
};

export default translate()(ChatSupport);