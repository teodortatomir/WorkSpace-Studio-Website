const searchPanel = document.getElementById('homeSearchPanel');
const searchButtons = document.querySelectorAll('#heroSearchToggle, .home-main-nav .nav-search-button');
const searchClose = searchPanel.querySelector('.home-search-close');
let searchTrigger;

searchButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (searchPanel.open) return;
        searchTrigger = button;
        searchPanel.showModal();
        document.body.classList.add('home-search-open');
        searchButtons.forEach(trigger => trigger.setAttribute('aria-expanded', 'true'));
    });
});

searchClose.addEventListener('click', () => searchPanel.close());
searchPanel.addEventListener('close', () => {
    document.body.classList.remove('home-search-open');
    searchButtons.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    searchTrigger?.focus({ preventScroll: true });
});
