// Progress Circle Animation on Scroll
document.addEventListener("DOMContentLoaded", function () {
  const skillItems = document.querySelectorAll(".skill-item");
  let animated = false;

  // Function to animate progress circles
  function animateProgressCircles() {
    skillItems.forEach((item, index) => {
      const progressCircle = item.querySelector(".progress");
      const percentageSpan = item.querySelector(".percentage");
      const targetPercent = parseInt(
        percentageSpan.getAttribute("data-percent")
      );

      // Calculate circle circumference
      const radius = 45;
      const circumference = 2 * Math.PI * radius;

      // Set initial stroke-dasharray and stroke-dashoffset
      progressCircle.style.strokeDasharray = circumference;
      progressCircle.style.strokeDashoffset = circumference;

      // Animate with delay for staggered effect
      setTimeout(() => {
        // Calculate offset based on percentage
        const offset = circumference - (targetPercent / 100) * circumference;

        // Animate the circle
        progressCircle.style.transition = "stroke-dashoffset 1.5s ease-in-out";
        progressCircle.style.strokeDashoffset = offset;

        // Animate the percentage text
        animatePercentage(percentageSpan, targetPercent);
      }, index * 200); // 200ms delay between each circle
    });
  }

  // Function to animate percentage counter
  function animatePercentage(element, target) {
    let current = 0;
    const increment = target / 60; // 60 frames for smooth animation
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / 60;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      element.textContent = Math.round(current) + "%";
    }, stepTime);
  }

  // Intersection Observer for scroll detection
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animateProgressCircles();
          animated = true; // Prevent re-animation
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the skills section is visible
      rootMargin: "0px 0px -50px 0px", // Add some margin for better UX
    }
  );

  // Observe the skills section
  const skillsSection = document.getElementById("skills");
  if (skillsSection) {
    observer.observe(skillsSection);
  }

  // Fallback: If Intersection Observer is not supported
  if (!("IntersectionObserver" in window)) {
    window.addEventListener("scroll", function () {
      if (!animated) {
        const skillsSection = document.getElementById("skills");
        const rect = skillsSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Check if skills section is in viewport
        if (rect.top < windowHeight && rect.bottom > 0) {
          animateProgressCircles();
          animated = true;
        }
      }
    });
  }

  // Optional: Reset animation function (if you want to re-trigger on scroll up)
  function resetAnimation() {
    animated = false;
    skillItems.forEach((item) => {
      const progressCircle = item.querySelector(".progress");
      const percentageSpan = item.querySelector(".percentage");

      progressCircle.style.transition = "none";
      progressCircle.style.strokeDashoffset = 2 * Math.PI * 45;
      percentageSpan.textContent = "0%";
    });
  }

  const resetObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting && animated) {
          resetAnimation();
        }
      });
    },
    {
      threshold: 0,
      rootMargin: "100px 0px 100px 0px",
    }
  );

  if (skillsSection) {
    resetObserver.observe(skillsSection);
  }
  
});
const handleSubmit = event => {
  event.preventDefault();

  const myForm = event.target;
  const formData = new FormData(myForm);

  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString()
  })
    .then(() => navigate("/thank-you/"))
    .catch(error => alert(error));
};
