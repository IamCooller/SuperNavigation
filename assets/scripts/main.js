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

        // Position the indicator under the active navigation link
        const moveIndicator = (el) => {
            const { left, width } = el.getBoundingClientRect();
            const { left: navLeft } = document.querySelector(".header__wrapper").getBoundingClientRect();
            indicator.style.left = `${left - navLeft}px`;
            indicator.style.width = `${width}px`;
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
            a.addEventListener("click", (e) => {
                e.preventDefault();
                setActiveCity(city, a);
            });
            headerNav.appendChild(a);
            // Set first city as active by default
            if (i === 0) {
                a.classList.add("active");
                setTimeout(() => moveIndicator(a), 0);
                updateTime(city.timezone || "UTC");
            }
        });

        // Use requestAnimationFrame for smooth indicator positioning
        // This helps with Safari's rendering and animation issues
        window.addEventListener("resize", () => {
            requestAnimationFrame(() => {
                const active = document.querySelector(".nav-link.active");
                if (active) moveIndicator(active);
            });
        });
    } catch (error) {
        console.error("Error loading navigation data:", error);
    }
});