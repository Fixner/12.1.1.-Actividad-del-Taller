document.addEventListener("DOMContentLoaded", function() {
    // Cargar los datos de las películas
    fetch("https://japceibal.github.io/japflix_api/movies-data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Datos cargados correctamente:", data);

            const buscar = document.getElementById("btnBuscar");
            const input = document.getElementById("inputBuscar");
            const lista = document.getElementById("lista");

            // Buscar películas
            buscar.addEventListener("click", function() {
                let valueInput = input.value.trim().toLowerCase();
                lista.innerHTML = "";

                if (valueInput !== "") {
                    const resultados = data.filter(pelicula =>
                        pelicula.title.toLowerCase().includes(valueInput) ||
                        pelicula.genres.join(", ").toLowerCase().includes(valueInput) ||
                        (pelicula.tagline && pelicula.tagline.toLowerCase().includes(valueInput)) ||
                        (pelicula.overview && pelicula.overview.toLowerCase().includes(valueInput))
                    );

                    if (resultados.length > 0) {
                        resultados.forEach(pelicula => {
                            const li = document.createElement("li");
                            const h5 = document.createElement("h4");
                            const p = document.createElement("p");
                            const titleContainer = document.createElement("div");
                            const starsContainer = document.createElement("div");

                            li.classList.add("card-content");
                            h5.classList.add("card-title");
                            p.classList.add("card-tagline");
                            starsContainer.classList.add("stars-container");
                            titleContainer.classList.add("title-container");

                            // Calcular el promedio de estrellas (redondeado)
                            const voteAverage = Math.round((pelicula.vote_average / 10) * 5);

                            // Añadir estrellas
                            for (let i = 1; i <= 5; i++) {
                                const star = document.createElement("span");
                                star.classList.add("fa", "fa-star");
                                if (i <= voteAverage) {
                                    star.classList.add("checked");
                                }
                                starsContainer.appendChild(star);
                            }

                            h5.textContent = pelicula.title;
                            p.textContent = pelicula.tagline || "Sin tagline disponible";

                            titleContainer.appendChild(h5);
                            titleContainer.appendChild(starsContainer);
                            li.appendChild(titleContainer);
                            li.appendChild(p);
                            lista.appendChild(li);

                            // Mostrar detalles de la película al hacer clic
                            li.addEventListener("click", function(event) {
                                mostrarDetalles(pelicula, event.target);
                            });
                        });
                    } else {
                        console.log("No se encontraron resultados.");
                    }
                } else {
                    console.log("El campo de búsqueda está vacío.");
                }
            });
        })
        .catch(error => {
            console.error("Error al cargar los datos:", error);
        });

    // Función para mostrar detalles de la película
    function mostrarDetalles(pelicula, targetElement) {
        // Eliminar cualquier overlay o detalle previo
        const previousOverlay = document.querySelector('.overlay');
        const previousDetalles = document.querySelector('.detalles-container');
        if (previousOverlay) previousOverlay.remove();
        if (previousDetalles) previousDetalles.remove();

        // Crear el overlay
        const overlay = document.createElement("div");
        overlay.classList.add("overlay");
        document.body.appendChild(overlay);

        // Crear el contenedor de detalles
        const detallesContainer = document.createElement("div");
        detallesContainer.classList.add("detalles-container");

        // Título, descripción y géneros
        const title = document.createElement("h2");
        const overview = document.createElement("p");
        const hr = document.createElement("hr");
        const genres = document.createElement("p");
        const genresMore = document.createElement("div");

        title.classList.add("detalles-title");
        overview.classList.add("detalles-overview");
        hr.classList.add("detalles-hr");
        genres.classList.add("detalles-genres");
        genresMore.classList.add("container-genresMore");

        title.textContent = pelicula.title;
        overview.textContent = pelicula.overview;

        // Generar lista de géneros
        const genresArray = pelicula.genres;
        const genreNames = genresArray.map(genre => genre.name); 
        genres.textContent = "Géneros: " + genreNames.join(", ");

        // Crear el dropdown con más información
        const dropdownDiv = document.createElement("div");
        dropdownDiv.classList.add("dropdown");

        const dropdownLink = document.createElement("a");
        dropdownLink.classList.add("btn", "btn-secondary", "dropdown-toggle");
        dropdownLink.href = "#";
        dropdownLink.role = "button";
        dropdownLink.setAttribute("data-bs-toggle", "dropdown");
        dropdownLink.setAttribute("aria-expanded", "false");
        dropdownLink.textContent = "Más información";

        const dropdownMenu = document.createElement("ul");
        dropdownMenu.classList.add("dropdown-menu");

        const year = pelicula.release_date.split("-")[0];

        const option1 = document.createElement("li");
        option1.textContent = "Año: " + year; 
        dropdownMenu.appendChild(option1);

        const option2 = document.createElement("li");
        option2.textContent = "Duración: " + pelicula.runtime + " min"; 
        dropdownMenu.appendChild(option2);

        const option3 = document.createElement("li");
        option3.textContent = "Presupuesto: $" + pelicula.budget.toLocaleString(); 
        dropdownMenu.appendChild(option3);

        const option4 = document.createElement("li");
        option4.textContent = "Ingresos: $" + pelicula.revenue.toLocaleString(); 
        dropdownMenu.appendChild(option4);

        dropdownDiv.appendChild(dropdownLink);
        dropdownDiv.appendChild(dropdownMenu);

        genresMore.appendChild(genres);
        genresMore.appendChild(dropdownDiv);

        detallesContainer.appendChild(title);
        detallesContainer.appendChild(overview);
        detallesContainer.appendChild(hr);
        detallesContainer.appendChild(genresMore);

        // Añadir el contenedor de detalles al body
        document.body.appendChild(detallesContainer);

        // Posicionar el contenedor de detalles cerca del elemento clicado
        const rect = targetElement.getBoundingClientRect();
        detallesContainer.style.position = "absolute";
        detallesContainer.style.top = `${rect.bottom + window.scrollY}px`; // Colocarlo debajo del elemento
        detallesContainer.style.left = `${rect.left + window.scrollX}px`;  // Alinearlo con el elemento

        // Mostrar el overlay y el contenedor
        overlay.style.display = "block";
        detallesContainer.style.display = "block";

        // Cerrar el overlay al hacer clic
        overlay.addEventListener("click", function() {
            document.body.removeChild(detallesContainer);
            document.body.removeChild(overlay);
        });
    }
});
