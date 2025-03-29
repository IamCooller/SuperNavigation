document.addEventListener("DOMContentLoaded", async() => {
    try {
        // Fetch navigation data from JSON file
        const response = await fetch("../assets/data/navigation.json");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const { cities } = await response.json();
        const headerNav = document.getElementById("header-nav");
        const indicator = document.querySelector(".indicator");
        const timeDiv = document.getElementById("time-value");
        let timeInterval;
        let resizeTimeout;

        // Position the indicator under the active navigation link
        const moveIndicator = (el) => {
            if (!el) return;

            const { left, width } = el.getBoundingClientRect();
            const { left: navLeft } = document.querySelector(".header__wrapper").getBoundingClientRect();
            indicator.style.transition = "all 0.3s ease";
            indicator.style.left = `${left - navLeft}px`;
            indicator.style.width = `${width}px`;
        };

        // Immediately update indicator position without animation
        const updateIndicatorImmediately = (el) => {
            if (!el) return;

            indicator.style.transition = "none";
            const { left, width } = el.getBoundingClientRect();
            const { left: navLeft } = document.querySelector(".header__wrapper").getBoundingClientRect();
            indicator.style.left = `${left - navLeft}px`;
            indicator.style.width = `${width}px`;

            // Force a reflow to apply the styles immediately
            indicator.offsetHeight;
        };

        // Function to check if timezone is valid
        const isValidTimeZone = (tz) => {
            if (!tz || typeof tz !== "string") return false;
            try {
                Intl.DateTimeFormat(undefined, { timeZone: tz });
                return true;
            } catch (e) {
                return false;
            }
        };

        // Update the time display based on the selected city's timezone
        const updateTime = (timezone) => {
            clearInterval(timeInterval);

            // Check if timezone is valid
            if (!isValidTimeZone(timezone)) {
                timeDiv.textContent = "Invalid timezone!";
                timeDiv.style.color = "red";
                console.error(`Invalid timezone specified: ${timezone}`);
                return;
            }

            // Reset text color if it was previously set to red
            timeDiv.style.color = "";

            const refresh = () => {
                const now = new Date();
                try {
                    // Safari-safe implementation
                    timeDiv.textContent = new Intl.DateTimeFormat("en-US", {
                        timeZone: timezone,
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: true,
                    }).format(now);
                } catch (e) {
                    // Fallback if Intl.DateTimeFormat fails with the timezone
                    console.warn(`Error formatting time for timezone ${timezone}:`, e);
                    timeDiv.textContent = "Time format error!";
                    timeDiv.style.color = "red";
                }
            };
            refresh();
            timeInterval = setInterval(refresh, 1000);
        };

        // Set a city as active and update UI elements
        const setActiveCity = (city, link) => {
            document.querySelectorAll(".nav-link").forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
            moveIndicator(link);

            // Update tabpanel connection
            const timePanel = document.getElementById("time-panel");
            timePanel.setAttribute("aria-labelledby", link.id);

            updateTime(city.timezone || "UTC");
        };

        // Create navigation links dynamically from the JSON data
        cities.forEach((city, i) => {
            const a = document.createElement("a");
            a.className = "nav-link";
            a.href = `#${city.section}`;
            a.dataset.section = city.section;
            a.dataset.timezone = city.timezone;
            a.textContent = city.label;

            // Add accessibility attributes
            a.setAttribute("role", "tab");
            a.setAttribute("aria-selected", i === 0 ? "true" : "false");
            a.setAttribute("aria-controls", `time-${city.section}`);
            a.id = `tab-${city.section}`;

            a.addEventListener("click", (e) => {
                e.preventDefault();

                // Update ARIA states
                document.querySelectorAll(".nav-link").forEach((navLink) => {
                    navLink.setAttribute("aria-selected", "false");
                });
                a.setAttribute("aria-selected", "true");

                setActiveCity(city, a);
            });
            headerNav.appendChild(a);
            // Set first city as active by default
            if (i === 0) {
                a.classList.add("active");
                // Use a small delay to ensure elements are properly rendered
                setTimeout(() => updateIndicatorImmediately(a), 10);

                // Set initial tabpanel connection
                const timePanel = document.getElementById("time-panel");
                timePanel.setAttribute("aria-labelledby", a.id);

                updateTime(city.timezone || "UTC");
            }
        });

        // Handle resize events with debouncing and immediate updates
        window.addEventListener("resize", () => {
            const active = document.querySelector(".nav-link.active");
            if (!active) return;

            // Immediately update without animation during resize
            updateIndicatorImmediately(active);

            // Debounce the final animation
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Restore animation and make final adjustment when resize stops
                moveIndicator(active);
            }, 100);
        });
    } catch (error) {
        console.error("Error loading navigation data:", error);
    }
});