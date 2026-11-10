document.querySelectorAll(".story-lens").forEach((storyLens) => {
    const problemTrigger = storyLens.querySelector(".story-lens-problem-trigger");
    const solutionTrigger = storyLens.querySelector(".story-lens-solution-trigger");

    const setActiveStory = (story) => {
        storyLens.dataset.active = story;
    };

    problemTrigger?.addEventListener("mouseenter", () => setActiveStory("problem"));
    problemTrigger?.addEventListener("focus", () => setActiveStory("problem"));
    problemTrigger?.addEventListener("click", () => setActiveStory("problem"));

    solutionTrigger?.addEventListener("mouseenter", () => setActiveStory("solution"));
    solutionTrigger?.addEventListener("focus", () => setActiveStory("solution"));
    solutionTrigger?.addEventListener("click", () => setActiveStory("solution"));
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenuOverlay();
        if (lightbox.classList.contains("active")) {
            closeLightbox();
        }
    }
});