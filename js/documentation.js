document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("documentation-container");
    if (!container) return;

    const botName = container.dataset.bot;
    fetch(`documentation/${botName}.json`)
        .then(res => res.json())
        .then(data => {
            if (data.categories) {
                Object.keys(data.categories).forEach(cat => {
                    const catElem = document.createElement("h3");
                    catElem.textContent = cat;
                    container.appendChild(catElem);

                    data.categories[cat].forEach(cmd => {
                        const cmdElem = document.createElement("div");
                        cmdElem.classList.add("command-card");
                        cmdElem.innerHTML = `
                            <h4>${cmd.name}</h4>
                            ${cmd.image ? `<img src="${cmd.image}" alt="${cmd.name}" class="cmd-img">` : ""}
                            ${cmd.description ? `<p><strong>Description :</strong> ${cmd.description}</p>` : ""}
                            <p><strong>Fonctionnement :</strong> ${cmd.howto}</p>
                        `;
                        container.appendChild(cmdElem);
                    });
                });
            }
        })
        .catch(err => {
            container.innerHTML = `<p>Impossible de charger la documentation.</p>`;
            console.error(err);
        });
});
