const WEBHOOK_URL = "https://discord.com/api/webhooks/1474853981883859238/Kb28vWClSFnHJa3aKSnoOTnQ8vQUK4ZrUb5qSX8sNA_hs-mglR7ybRF933Ehz9Eotfbb";

const elements = {
    cookieBanner: document.getElementById("cookieBanner"),
    acceptCookies: document.getElementById("acceptCookies"),
    reportForm: document.getElementById("reportForm"),
    sendButton: document.getElementById("sendReportButton"),
    formStatus: document.getElementById("formStatus"),
    senderName: document.getElementById("senderName"),
    subject: document.getElementById("subject"),
    category: document.getElementById("reportCategory"),
    location: document.getElementById("incidentLocation"),
    people: document.getElementById("peopleInvolved"),
    vehicle: document.getElementById("vehicleInfo"),
    date: document.getElementById("incidentDate"),
    time: document.getElementById("incidentTime"),
    message: document.getElementById("message")
};

function initCookieBanner() {
    if (!elements.cookieBanner || !elements.acceptCookies) return;

    if (localStorage.getItem("cookiesAccepted") === "true") {
        elements.cookieBanner.style.display = "none";
        return;
    }

    elements.acceptCookies.addEventListener("click", () => {
        localStorage.setItem("cookiesAccepted", "true");
        elements.cookieBanner.style.display = "none";
    });
}

function normalizeValue(value, fallback = "Nespecificat") {
    return value && value.trim() ? value.trim() : fallback;
}

function getReportData() {
    return {
        name: normalizeValue(elements.senderName?.value, "Anonim"),
        subject: normalizeValue(elements.subject?.value, "Fără subiect"),
        category: normalizeValue(elements.category?.value, "Nespecificată"),
        location: normalizeValue(elements.location?.value),
        people: normalizeValue(elements.people?.value),
        vehicle: normalizeValue(elements.vehicle?.value),
        date: normalizeValue(elements.date?.value),
        time: normalizeValue(elements.time?.value),
        message: normalizeValue(elements.message?.value, "")
    };
}

function resetReportForm() {
    elements.reportForm?.reset();
}

function setFormStatus(message, type = "") {
    if (!elements.formStatus) return;
    elements.formStatus.textContent = message;
    elements.formStatus.className = `form-status ${type}`.trim();
}

function setLoadingState(isLoading) {
    if (!elements.sendButton) return;

    elements.sendButton.disabled = isLoading;
    elements.sendButton.textContent = isLoading
        ? "Se trimite..."
        : "Trimite sesizarea oficială";
}

function clampText(text, maxLength = 1000) {
    if (!text) return "Nespecificat";
    return text.length > maxLength ? `${text.slice(0, maxLength - 3)}...` : text;
}

function buildDiscordPayload(data) {
    return {
        username: "DIICOT OIRP",
        avatar_url: "https://cdn.discordapp.com/attachments/1485011354271354902/1485242593653559296/download__4_-removebg-preview.png",
        content: " **Sesizare nouă primită**",
        embeds: [
            {
                title: "Formular oficial DIICOT",
                description: "A fost înregistrată o nouă sesizare prin portalul oficial.",
                color: 2105893,
                fields: [
                    { name: "Nume / sursă", value: data.name, inline: true },
                    { name: "Subiect", value: data.subject, inline: true },
                    { name: "Categorie", value: data.category, inline: true },
                    { name: "Locație", value: data.location, inline: true },
                    { name: "Persoane implicate", value: data.people, inline: true },
                    { name: "Vehicule", value: data.vehicle, inline: true },
                    { name: "Dată", value: data.date, inline: true },
                    { name: "Oră", value: data.time, inline: true },
                    { name: "Detalii", value: clampText(data.message, 1800) }
                ],
                footer: {
                    text: "DIICOT • Sistem automat de sesizări"
                },
                timestamp: new Date().toISOString()
            }
        ]
    };
}

async function handleReportSubmit(event) {
    event.preventDefault();

    const data = getReportData();

    if (!data.message) {
        setFormStatus("Te rugăm să completezi descrierea sesizării înainte de trimitere.", "error");
        return;
    }

    if (WEBHOOK_URL === "Phttps://discord.com/api/webhooks/1476980265875279994/au0VNZ_hAcinDJRXuHAXR4XHeddWQhrQ8UL6MZ-5BcIm3orQ5dTajZ48RHTCEkHKo3Px") {
        setFormStatus("Adaugă mai întâi webhook-ul Discord în script.js.", "error");
        return;
    }

    setFormStatus("Sesizarea se trimite...");
    setLoadingState(true);

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(buildDiscordPayload(data))
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        resetReportForm();
        setFormStatus("Sesizarea a fost transmisă cu succes către DIICOT.", "success");
    } catch (error) {
        console.error("Eroare la trimiterea sesizării:", error);
        setFormStatus("A apărut o eroare la trimitere. Încearcă din nou sau contactează un administrator.", "error");
    } finally {
        setLoadingState(false);
    }
}

function initReportForm() {
    if (!elements.reportForm) return;
    elements.reportForm.addEventListener("submit", handleReportSubmit);
}

initCookieBanner();
initReportForm();

function initGallerySlider() {
    const slider = document.getElementById("gallerySlider");
    const slides = slider ? Array.from(slider.querySelectorAll(".gallery-slide")) : [];
    const prevButton = document.getElementById("galleryPrev");
    const nextButton = document.getElementById("galleryNext");

    if (!slider || !slides.length || !prevButton || !nextButton) {
        return;
    }

    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === index);
        });

        currentIndex = index;
    }

    function showNextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    function showPrevSlide() {
        const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
        showSlide(prevIndex);
    }

    prevButton.addEventListener("click", showPrevSlide);
    nextButton.addEventListener("click", showNextSlide);

    showSlide(0);
}

initGallerySlider();