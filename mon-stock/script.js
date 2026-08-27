let stock = JSON.parse(localStorage.getItem("monStock")) || [];

function sauvegarder() {
    localStorage.setItem("monStock", JSON.stringify(stock));
}

function ouvrirFormulaire() {
    document.getElementById("formulaire").style.display = "flex";
}

function fermerFormulaire() {
    document.getElementById("formulaire").style.display = "none";
}

function ajouterArticle() {

    const nom = document.getElementById("nom").value.trim();
    const categorie = document.getElementById("categorie").value.trim();
    const quantite = Number(document.getElementById("quantite").value);
    const prix = Number(document.getElementById("prix").value);
    const seuil = Number(document.getElementById("seuil").value);

    if (!nom || quantite < 0 || prix < 0) {
        alert("Merci de remplir correctement les informations.");
        return;
    }

    const article = {
        id: Date.now(),
        nom: nom,
        categorie: categorie,
        quantite: quantite,
        prix: prix,
        seuil: seuil
    };

    stock.push(article);

    sauvegarder();
    afficherStock();
    fermerFormulaire();

    document.getElementById("nom").value = "";
    document.getElementById("categorie").value = "";
    document.getElementById("quantite").value = "";
    document.getElementById("prix").value = "";
    document.getElementById("seuil").value = "";
}

function modifierQuantite(id, changement) {

    const article = stock.find(article => article.id === id);

    if (!article) return;

    article.quantite += changement;

    if (article.quantite < 0) {
        article.quantite = 0;
    }

    sauvegarder();
    afficherStock();
}

function afficherStock() {

    const zoneStock = document.getElementById("stock");
    const recherche = document.getElementById("recherche").value.toLowerCase();

    const articles = stock.filter(article =>
        article.nom.toLowerCase().includes(recherche) ||
        article.categorie.toLowerCase().includes(recherche)
    );

    zoneStock.innerHTML = "";

    if (articles.length === 0) {
        zoneStock.innerHTML =
            '<p class="vide">Aucune marchandise enregistrée.</p>';
    }

    articles.forEach(article => {

        const valeur = article.quantite * article.prix;

        let alerte = "";

        if (article.quantite <= article.seuil) {
            alerte = '<p class="alerte">⚠️ Stock faible</p>';
        }

        zoneStock.innerHTML += `
            <div class="article">

                <h3>${article.nom}</h3>

                <p class="categorie">
                    ${article.categorie || "Sans catégorie"}
                </p>

                <div class="quantite">

                    <button onclick="modifierQuantite(${article.id}, -1)">
                        −
                    </button>

                    <strong>${article.quantite}</strong>

                    <button onclick="modifierQuantite(${article.id}, 1)">
                        +
                    </button>

                </div>

                <p>Prix : ${article.prix.toFixed(2)} €</p>

                <p>Valeur : <strong>${valeur.toFixed(2)} €</strong></p>

                ${alerte}

            </div>
        `;
    });

    calculerResume();
}

function calculerResume() {

    let valeurTotale = 0;
    let nombre = 0;

    stock.forEach(article => {
        nombre += article.quantite;
        valeurTotale += article.quantite * article.prix;
    });

    document.getElementById("nombreArticles").textContent = nombre;

    document.getElementById("valeurStock").textContent =
        valeurTotale.toFixed(2).replace(".", ",") + " €";
}

afficherStock();