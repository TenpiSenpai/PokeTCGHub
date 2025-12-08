export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('lazy-load', {
        mounted(el: HTMLElement) {
            function loadImage() {
                const imageElement = Array.from(el.children).find(
                    el => el.nodeName === "IMG"
                );
                if (imageElement) {
                    imageElement.addEventListener("load", () => {
                        setTimeout(() => el.classList.add("loaded"), 100);
                    });
                    imageElement.addEventListener("error", () => console.log("error"));
                    (imageElement as HTMLImageElement).src = (imageElement as HTMLImageElement).dataset.url!;
                }
            }

            function handleIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        loadImage();
                        observer.unobserve(el);
                    }
                });
            }

            function createObserver() {
                const options = {
                    root: null,
                    threshold: 0
                };
                const observer = new IntersectionObserver(handleIntersect, options);
                observer.observe(el);
            }
            if (window["IntersectionObserver"]) {
                createObserver();
            } else {
                loadImage();
            }
        }
    })
})