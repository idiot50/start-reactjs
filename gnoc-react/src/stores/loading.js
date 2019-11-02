let numberOfAxiosCallPending = 0;

export function onShowLoading() {
    numberOfAxiosCallPending++;
    let loadingElement = document.getElementsByClassName('class-loading-overlay');
    if (loadingElement && loadingElement.length > 0) {
        loadingElement[0].classList.remove('class-hide-loading-overlay');
    }
};

export function onHideLoading() {
    numberOfAxiosCallPending--;
    if(numberOfAxiosCallPending === 0) {
        let loadingElement = document.getElementsByClassName('class-loading-overlay');
        if (loadingElement && loadingElement.length > 0) {
            loadingElement[0].classList.add('class-hide-loading-overlay');
        }
    }
};