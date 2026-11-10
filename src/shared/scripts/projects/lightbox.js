const lightbox = document.getElementById("{{project}}Lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

const galleryButtons = [...document.querySelectorAll(".gallery-item")];
const galleryImages = galleryButtons.map(button => button.querySelector("img"));
let activeImage = 0;
let lightboxOpener;
function showImage(index) {
    activeImage = (index + galleryImages.length) % galleryImages.length;
    const image = galleryImages[activeImage];
    lightboxImage.src = image.getAttribute("data-defer-src") || image.src;
    lightboxImage.alt = image.alt;
}
galleryButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        lightboxOpener = button;
        showImage(index);
        lightbox.classList.add("active");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("{{project}}-lightbox-open");
        lightboxClose.focus();
    });
});
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showImage(activeImage - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showImage(activeImage + 1));
function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    document.body.classList.remove("{{project}}-lightbox-open");
    lightboxOpener?.focus({ preventScroll: true });
}
document.addEventListener("keydown", (event) => {
    if (!lightbox.classList.contains("active")) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        showImage(activeImage + (event.key === "ArrowRight" ? 1 : -1));
    }
    if (event.key === "Tab") {
        const controls = [...lightbox.querySelectorAll("button")];
        const index = controls.indexOf(document.activeElement);
        event.preventDefault();
        controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length].focus();
    }
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
        closeLightbox();
    }
});
