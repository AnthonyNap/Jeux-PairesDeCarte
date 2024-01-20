// Initialisation des variables
var motifsCartes = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9];
var etatsCartes = new Array(18).fill(0);
var cartesRetournees = [];
var nbPairesTrouvees = 0;
var score = 0;
var imgCartes;
var flipSound = document.getElementById("flipSound");
var matchSound = document.getElementById("matchSound");

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
        img.src = "fondcarte.png";
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
        carte.src = "fondcarte.png";
        carte.setAttribute("class", "back"); // Retourne la carte face cachée
    } else if (etatsCartes[noCarte] == 1) {
        carte.src = "carte"+motifsCartes[noCarte]+".png";
        carte.setAttribute("class", "front"); // Retourne la carte face visible
        flipSound.play(); // Joue le son de retournement
    } else {
        carte.style.visibility = "hidden"; // Cache la carte si une paire est trouvée
        matchSound.play(); // Joue le son de correspondance
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
function controleJeu(noCarte){
    // On ne peut retourner que deux cartes à la fois
	if(cartesRetournees.length < 2){
        // Si la carte cliquée est face cachée
		if(etatsCartes[noCarte] == 0){
            // On retourne la carte
			etatsCartes[noCarte] = 1;
            // On enregistre la carte retournée
			cartesRetournees.push(noCarte);
            // On met à jour l'affichage
			majAffichage(noCarte);
		}

        // Si deux cartes ont été retournées
		if(cartesRetournees.length == 2){
            // Par défaut, on suppose que les cartes ne forment pas une paire
			var nouveauEtat = 0;
            // On vérifie si les deux cartes forment une paire
			if(motifsCartes[cartesRetournees[0]] == motifsCartes[cartesRetournees[1]]){
                // Les cartes forment une paire, on les marque comme résolues
				nouveauEtat = -1;
                // On augmente le nombre de paires trouvées
				nbPairesTrouvees++;
                // On augmente le score
                majScore(10);
			} else {
                // Les cartes ne forment pas une paire, on diminue le score
                majScore(-2);
            }

            // On met à jour l'état des deux cartes retournées
			etatsCartes[cartesRetournees[0]] = nouveauEtat;
			etatsCartes[cartesRetournees[1]] = nouveauEtat;

            // On attend un peu avant de retourner les cartes ou de les cacher
			setTimeout(function(){
				majAffichage(cartesRetournees[0]);
				majAffichage(cartesRetournees[1]);
                // On vide la liste des cartes retournées pour le prochain tour
				cartesRetournees = [];
                // Si toutes les paires ont été trouvées, on propose de rejouer
				if(nbPairesTrouvees == 9){
					rejouer();
				}
			}, 750);
		}
	}
}

initialiseJeu(); 