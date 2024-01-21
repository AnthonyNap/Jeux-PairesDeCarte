// Initialisation des variables
var motifsCartes = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9];
var etatsCartes = new Array(18).fill(0);
var cartesRetournees = [];
var nbPairesTrouvees = 0;
var score = 0;
var imgCartes;
var flipSound = document.getElementById("flipSound");
var matchSound = document.getElementById("matchSound");
var echecSound = document.getElementById("echecSound");

function genererTableau() {
    var tapis = document.getElementById("tapis");
    var ligne1 = document.getElementById("ligne1");
    var ligne2 = document.getElementById("ligne2");

    // Assurez-vous que les lignes sont vides avant de générer les cartes
    ligne1.innerHTML = '';
    ligne2.innerHTML = '';

    for (var i = 0; i < motifsCartes.length; i++) {
        var cellule = document.createElement("td");
        var img = document.createElement("img");
        img.src = "images/fondcarte1.jpg";
        img.setAttribute("class", "back");
        img.noCarte = i;
        img.addEventListener("click", function(){
            controleJeu(this.noCarte);
        });

        cellule.appendChild(img);

        // Ajoute les 9 premières cartes dans la première ligne
        if (i < 9) {
            ligne1.appendChild(cellule);
        }
        // Ajoute les 9 dernières cartes dans la seconde ligne
        else {
            ligne2.appendChild(cellule);
        }
    }

    imgCartes = document.querySelectorAll("#tapis img");
}

// fonction majAffichage pour gérer l'animation des cartes
function majAffichage(noCarte) {
    var carte = imgCartes[noCarte];
    if(etatsCartes[noCarte] == 0) {
        carte.src = "images/fondcarte1.jpg";
        carte.setAttribute("class", "back"); // Retourne la carte face cachée
    } else if (etatsCartes[noCarte] == 1) {
        carte.src = "images/carte"+motifsCartes[noCarte]+".png";
        carte.setAttribute("class", "front"); // Retourne la carte face visible
        flipSound.play(); // Joue le son de retournement
    } else {
        carte.style.visibility = "hidden"; // Cache la carte si une paire est trouvée
        matchSound.play(); // Joue le son de correspondance
    }
	// Gestion des effets visuels pour les paires trouvées ou non
    if (cartesRetournees.length == 2) {
        var carte1 = imgCartes[cartesRetournees[0]];
        var carte2 = imgCartes[cartesRetournees[1]];
        var correspondance = motifsCartes[cartesRetournees[0]] == motifsCartes[cartesRetournees[1]];

        if (correspondance) {
            // Effet pour une paire trouvée
            carte1.classList.add("trouvee");
            carte2.classList.add("trouvee");
        } else {
            // Effet pour une paire non trouvée
            carte1.classList.add("non-trouvee");
            carte2.classList.add("non-trouvee");
        }

        // Retirer les classes après un court délai
        setTimeout(function() {
            carte1.classList.remove("trouvee", "non-trouvee");
            carte2.classList.remove("trouvee", "non-trouvee");
        }, 1000);
    }
}

// Fonction pour mettre à jour l'affichage du score
function majScore(points) {
    score += points; // Ajoute ou soustrait des points au score actuel
    document.getElementById("score").textContent = "Score: " + score; // Met à jour le texte du score dans le DOM
}

// Fonction appelée lorsque le joueur a trouvé toutes les paires
function rejouer(){
	alert("Bravo !"); // Affiche une alerte de félicitations
	location.reload(); // Recharge la page pour recommencer le jeu
}

// Ajout de l'écouteur d'événement au bouton rejouer
document.getElementById("rejouer").onclick = function() {
    initialiseJeu();
    genererTableau(); // Recréer le tableau après avoir mélangé
};

// Fonction pour mélanger les cartes au début du jeu
function initialiseJeu(){
    cartesRetournees = [];
    nbPairesTrouvees = 0;
    score = 0;
    document.getElementById("score").textContent = "Score: " + score;
    motifsCartes.sort(function() { return 0.5 - Math.random(); }); // Méthode simplifiée pour mélanger
    genererTableau(); // Recréer le tableau après avoir mélangé
}

// Ajout de l'écouteur d'événement au bouton rejouer
document.getElementById("rejouer").onclick = rejouer;

// Fonction appelée lorsqu'un utilisateur clique sur une carte
function controleJeu(noCarte) {
    // On ne peut retourner que deux cartes à la fois
    if (cartesRetournees.length < 2) {
        // Si la carte cliquée est face cachée
        if (etatsCartes[noCarte] == 0) {
            // On retourne la carte
            etatsCartes[noCarte] = 1;
            // On enregistre la carte retournée
            cartesRetournees.push(noCarte);
            // On met à jour l'affichage
            majAffichage(noCarte);
        }

        // Si deux cartes ont été retournées
        if (cartesRetournees.length == 2) {
            var correspondance = motifsCartes[cartesRetournees[0]] == motifsCartes[cartesRetournees[1]];
            var nouveauEtat = correspondance ? -1 : 0;

            if (correspondance) {
                // Les cartes forment une paire, on les marque comme résolues
                nbPairesTrouvees++;
                majScore(10); // On augmente le score
                matchSound.play(); // Joue le son de correspondance
            } else {
                // Les cartes ne forment pas une paire
                majScore(-2); // On diminue le score
                echecSound.play(); // Joue le son d'échec si les cartes ne correspondent pas
            }

            // On met à jour l'état des deux cartes retournées
            etatsCartes[cartesRetournees[0]] = nouveauEtat;
            etatsCartes[cartesRetournees[1]] = nouveauEtat;

            // On attend un peu avant de retourner les cartes ou de les cacher
            setTimeout(function () {
                majAffichage(cartesRetournees[0]);
                majAffichage(cartesRetournees[1]);
                // On vide la liste des cartes retournées pour le prochain tour
                cartesRetournees = [];
                // Si toutes les paires ont été trouvées, on propose de rejouer
                if (nbPairesTrouvees == 9) {
                    rejouer();
                }
            }, 750);
        }
    }
}

initialiseJeu(); 