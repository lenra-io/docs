(() => {
    const observer = new IntersectionObserver(
        ([e]) => e.target.toggleAttribute('stuck', e.intersectionRatio < 1),
        { threshold: [1] }
    );

    document.querySelectorAll(".sticky").forEach(function (element) {
        observer.observe(element);
    });
})();