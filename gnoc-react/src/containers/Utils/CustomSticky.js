import React, { Component } from 'react';

export const CustomSticky = ({children, ...props}) => {
    class Sticky extends Component {
        constructor(props) {
            super(props);

            this.handleScroll = this.handleScroll.bind(this);

            this.state = {
                scrollingLock: (window.scrollY > 90) ? true : false,
                scrollY: 0
            };
        }

        shouldComponentUpdate() {
            return (this.state.scrollY !== 0);
        }

        componentDidMount(){
            const elem = document.body;
            let lastClassName = elem.className;
            this.interval = setInterval(() => {
                let className = elem.className;
                if (className !== lastClassName) {
                    this.handleScroll();
                    lastClassName = className;
                }
            }, 100);
            window.addEventListener('scroll', this.handleScroll, true);
        }
        
        componentWillUnmount() {
            clearInterval(this.interval);
            window.removeEventListener('scroll', this.handleScroll, true);
        }
        
        handleScroll() {
            if (window.scrollY > 90) {
                this.setState({
                    scrollingLock: true,
                    scrollY: window.scrollY
                });
            } else if (window.scrollY <= 90) {
                this.setState({
                    scrollingLock: false,
                    scrollY: window.scrollY
                });
            }
        }

        render() {
            let width = (this.props.level === 1) ? (window.innerWidth - 317) : (window.innerWidth - 285);
            if (document.body.classList.contains('sidebar-minimized')) {
                width = width + 200;
            }
            if (!document.body.classList.contains('sidebar-lg-show')) {
                width = width + 250;
            }
            return (
                this.props.isNotSticky ?
                <div>
                    {children}
                </div>
                :
                (
                    this.state.scrollingLock ?
                    <div>
                        <div style={{height: '36px'}}></div>
                        <div id="custom-sticky" style={{ width: width,
                            zIndex: 5,
                            top: "40px",
                            position: "fixed"}}>
                            {children}
                        </div>
                    </div>
                    :
                    <div>
                        {children}
                    </div>
                )
            );
        }
    }
    return <Sticky {...props} />
}
