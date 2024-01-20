// Initialisation des variables
var motifsCartes=[1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9]; // Tableau contenant les motifs des cartes, chaque motif est répété deux fois
var etatsCartes=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]; // Tableau indiquant l'état de chaque carte (0 pour face cachée, 1 pour face visible, -1 pour carte retirée du jeu)
var cartesRetournees=[]; // Tableau vide qui stockera les indices des cartes qui sont actuellement retournées
var nbPairesTrouvees=0; // Compteur du nombre de paires trouvées
var score = 0; // Initialisation du score à 0

// Récupération de toutes les images dans le tableau "tapis"
var imgCartes=document.getElementById("tapis").getElementsByTagName("img");		
for(var i=0; i<imgCartes.length; i++){
	imgCartes[i].noCarte=i; // Ajout d'une propriété 'noCarte' à chaque image pour garder une référence de son indice
	imgCartes[i].onclick=function(){
		controleJeu(this.noCarte); // Définition de la fonction à appeler lors d'un clic sur une carte
	}                      
}

initialiseJeu(); // Appel de la fonction pour initialiser le jeu en mélangeant les cartes

// Fonction pour mettre à jour l'affichage de la carte selon son état
function majAffichage(noCarte){
	switch(etatsCartes[noCarte]){
		case 0: // Si la carte est face cachée
			imgCartes[noCarte].src="fondcarte.png"; // On affiche l'image de fond de la carte
			break;
		case 1: // Si la carte a été retournée
			imgCartes[noCarte].src="carte"+motifsCartes[noCarte]+".png"; // On affiche le motif de la carte
			break;
		case -1: // Si la carte a été enlevée du jeu (une paire trouvée)
			imgCartes[noCarte].style.visibility="hidden"; // On rend la carte invisible
			break;
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

// Fonction pour mélanger les cartes au début du jeu
function initialiseJeu(){
	for(var position=motifsCartes.length-1; position>=1; position--){
		var hasard=Math.floor(Math.random()*(position+1)); // Génère un indice aléatoire
		var sauve=motifsCartes[position]; // Sauvegarde le motif de la carte actuelle
		motifsCartes[position]=motifsCartes[hasard]; // Echange les motifs entre les deux cartes
		motifsCartes[hasard]=sauve; // Place le motif sauvegardé dans la position aléatoire
	}
}

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
