// Attend que le DOM soit entièrement chargé avant d'exécuter le script
document.addEventListener('DOMContentLoaded', function() {

    // =========== GESTION DU MENU MOBILE (BURGER) ===========
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const navLinkItems = navLinks.querySelectorAll('.nav-link'); // Tous les liens de la nav

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active'); // Affiche/cache le menu
            menuToggle.classList.toggle('active'); // Anime le bouton burger
            menuToggle.setAttribute('aria-expanded', isActive); // Pour l'accessibilité
            // Empêche le scroll du body quand le menu est ouvert
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Ferme le menu mobile quand un lien est cliqué
        navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        });
    }

    // =========== MISE À JOUR DE L'ANNÉE EN COURS DANS LE FOOTER ===========
    const currentYearElem = document.getElementById('currentYear');
    if (currentYearElem) {
        currentYearElem.textContent = new Date().getFullYear();
    }

    // =========== ANIMATION DES ÉLÉMENTS AU SCROLL (REVEAL ON SCROLL) ===========
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) { // Si l'élément est dans la viewport
                const delay = parseInt(entry.target.dataset.delay) || 0; // Récupère le délai s'il existe
                setTimeout(() => {
                    entry.target.classList.add('is-visible'); // Ajoute la classe pour l'animation
                }, delay);
                observer.unobserve(entry.target); // Arrête d'observer cet élément une fois animé
            }
        });
    }, { threshold: 0.1 }); // Seuil de 10% de visibilité pour déclencher

    revealElements.forEach(el => {
        revealObserver.observe(el); // Observe chaque élément concerné
    });

    // =========== STYLE DU HEADER AU SCROLL ===========
    const siteHeader = document.getElementById('siteHeader');
    // let lastScrollY = window.scrollY; // Non utilisé dans cette version du header

    if (siteHeader) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) { // Si l'utilisateur a scrollé de plus de 30px
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
            // Le comportement de disparition/réapparition au scroll a été retiré pour ce style de header
        });
    }

    // =========== MISE À JOUR DU LIEN ACTIF DANS LA NAVIGATION AU SCROLL ===========
    const sections = document.querySelectorAll('section[id]'); // Toutes les sections avec un ID
    function updateActiveLink() {
        let index = sections.length;
        const headerOffset = siteHeader ? siteHeader.offsetHeight + 40 : 100; // Hauteur du header + marge

        // Trouve la section actuellement visible en partant du bas
        while(--index >= 0 && window.scrollY + headerOffset < sections[index].offsetTop) {}

        navLinkItems.forEach((link) => link.classList.remove('active-link')); // Retire 'active-link' de tous les liens

        if (index >= 0 && sections[index]) { // Si une section est trouvée
          const activeSectionId = sections[index].id;
          const activeNavLink = document.querySelector(`.main-nav a[href="#${activeSectionId}"]`);
          if (activeNavLink) {
            activeNavLink.classList.add('active-link'); // Ajoute 'active-link' au lien correspondant
          }
        }
    }
    window.addEventListener('scroll', updateActiveLink); // Met à jour au scroll
    updateActiveLink(); // Met à jour au chargement de la page

    // =========== GESTION DE LA MODALE PROJET ===========
    const projectLinks = document.querySelectorAll('.project-link');
    const modal = document.getElementById('projectModal');
    const modalBody = document.getElementById('modalBody'); // Le conteneur du contenu de la modale
    const closeModalBtn = modal ? modal.querySelector('.close-modal-btn') : null;

    // Données des projets (pourraient venir d'un JSON ou d'attributs data plus complexes)
    // Note: Les images sont des URL externes. Si vous voulez des images locales,
    // mettez-les dans votre dossier img/ et changez les chemins ici.
    const projectDetails = {
        modalHardis: {
            title: "Artswipe (Détails)",
            image: "img/artswipe1.png", // ou "img/hardis-detail.jpg"
            description: "Dans le cadre d'un projet universitaire, nous devions réaliser une application visant a promouvoir le patrimoine culturel. En équipe de 6, nous avons donc développé un site web recommandant des musées en fonction des préférences collectés. L application fonctionne à l aide d un algorithme qui recueil un certain nombre de préférences grace à un système de swipe, et, au bout de 10 swipes, propose un musée proche de chez l utilisateur et en fonction de ses gouts. Pour ma part, étant chef de projet, j ai particulièrement du travailler sur le cadrage de projet et la répartition des tâches. Cependant, j ai aussi beaucoup travaillé sur l aspect conception (modélisation des classes, des IHM) et le développement des interfaces en React."
        },
        modalPresse: {
            title: "Projet personnel machine learning",
            image: "img/ia.png", // ou "img/presse-detail.jpg"
            description: "Exploration des concepts fondamentaux du Machine Learning incluant la mise en œuvre de modèles simples comme la régression linéaire et les k-plus proches voisins (k-NN). Entraînement d’un modèle de Deep Learning simulant l’atterrissage autonome d’une fusée sur la surface lunaire en 2D."
        },
        modalNutriscore: {
            title: "Analyse de Données Nutriscore (Détails)",
            image: "img/nutriscore.png", // ou "img/nutriscore-detail.jpg"
            description: "Exploration d'un dataset volumineux de produits alimentaires (Open Food Facts) à l'aide de SQL pour l'extraction et la préparation des données, puis avec le langage R (librairies dplyr, ggplot2) pour l'analyse statistique et la création de visualisations pertinentes (histogrammes, boxplots, etc.) afin de comprendre les facteurs déterminant le Nutriscore."
        },
        modalAI: {
            title: "Réalisation d'un guide d'installation d'un serveur Debian",
            image: "img/debian.png",
            description: "Réalisation, en individuel, d'un guide d'installation d'un serveur Debian 12. Ce guide contient, explications et commandes, pour l'installation et la configuration du serveur, ainsi que, sur ce serveur, la configuration d'Apache, PostgreSQL, PHP et phpPgAdmin."
        },
        modalElectricity: {
            title: "Prédiction des prix négatifs de l'électricité",
            image: "img/electricity-forecast.png",
            description: "Projet de session réalisé à l'UQAC pendant l'hiver 2026. L'objectif était de prédire les épisodes de prix day-ahead négatifs sur le marché électrique danois à partir de séries temporelles issues d'Open Power System Data. Le travail a mobilisé un pipeline Python, du feature engineering temporel, une comparaison de modèles et une analyse critique des limites. Le meilleur scénario court terme utilise un Random Forest avec une average precision de 0,67 et un ROC-AUC de 0,97 sur le jeu de test."
        },
        modalIroneo: {
            title: "Ironeo",
            image: "img/ironeo.png",
            description: "Ironeo est une plateforme éducative full-stack dédiée à la musculation et au fitness. Le projet regroupe des articles, des parcours d'apprentissage, une bibliothèque d'exercices, des programmes d'entraînement, un suivi de progression et une logique d'abonnement. Il m'a permis de travailler sur un produit complet : frontend React, backend Node.js/Express, base MongoDB, authentification, paiements, version mobile et contraintes de mise en production."
        },
        modalHyrid: {
            title: "Site Hyrid",
            image: "img/hyrid.png",
            description: "Hyrid est l'entreprise que j'ai créée avec trois collaborateurs après mon BUT Informatique. Le site hyrid.fr présente notre studio produit et nos applications web spécialisées, dont Ironeo. Ce projet met en avant une autre facette de mon parcours : cadrage d'une offre, construction d'une identité, développement d'un site Next.js, SEO, mise en production et coordination avec une petite équipe."
        },
        modalCeaStage: {
            title: "Stage CEA - Classification d'images de bactéries par IA",
            image: "img/cea-stage.png",
            description: "Stage de dix semaines au CEA Grenoble, au sein du projet européen SIMBLE. Mon travail portait sur l'amélioration d'un système d'IA capable d'identifier des espèces bactériennes à partir d'images obtenues par imagerie lensless. J'ai étudié le pipeline existant, préparé et nettoyé des jeux de données, automatisé plusieurs traitements en Python, expérimenté des modèles de Deep Learning avec PyTorch et exploré une nouvelle approche de classification à partir de signaux optiques temporels. Cette expérience m'a surtout fait progresser sur la rigueur expérimentale, la lecture de code scientifique existant, la documentation et l'autonomie dans un environnement de recherche."
        }
    };

    if (modal && closeModalBtn && modalBody) {
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Empêche le comportement par défaut du lien (#)
                const modalId = link.dataset.modalId; // Récupère l'ID de la modale depuis data-modal-id
                const details = projectDetails[modalId]; // Trouve les détails du projet correspondant

                if (details) {
                    // Met à jour le contenu de la modale
                    const titleElement = modalBody.querySelector('h3');
                    const imgElement = modalBody.querySelector('img');
                    const descriptionElement = modalBody.querySelector('p');

                    if (!titleElement || !imgElement || !descriptionElement) {
                        return;
                    }

                    titleElement.textContent = details.title;
                    if(details.image && details.image !== "") { // Si une image est fournie
                        imgElement.src = details.image;
                        imgElement.alt = details.title; // Bon pour l'accessibilité
                        imgElement.style.display = 'block'; // Affiche l'élément image
                    } else {
                        imgElement.style.display = 'none'; // Cache l'élément image s'il n'y en a pas
                    }
                    descriptionElement.textContent = details.description;

                    modal.style.display = 'flex'; // Affiche la modale (utilise flex pour le centrage CSS)
                    document.body.style.overflow = 'hidden'; // Empêche le scroll du body
                }
            });
        });

        // Fonction pour fermer la modale
        const closeTheModal = () => {
            modal.style.display = 'none'; // Cache la modale
            document.body.style.overflow = ''; // Réactive le scroll du body
        };

        closeModalBtn.addEventListener('click', closeTheModal); // Ferme avec le bouton X

        // Ferme la modale en cliquant à l'extérieur de son contenu
        modal.addEventListener('click', (e) => {
            if (e.target === modal) { // Si le clic est sur le fond de la modale (l'élément .modal lui-même)
                closeTheModal();
            }
        });

        // Ferme la modale avec la touche "Échap"
        document.addEventListener('keydown', (event) => {
            if (event.key === "Escape" && modal.style.display === 'flex') {
                closeTheModal();
            }
        });
    }

    const emailButton = document.querySelector('[data-copy-email]');
    if (emailButton) {
        emailButton.addEventListener('click', (event) => {
            event.preventDefault();
            const email = emailButton.dataset.copyEmail || emailButton.textContent.trim();
            copyEmailAndShowNotification(email);
        });
    }
});

function copyEmailAndShowNotification(emailText) {
    // Vérifie si l'API Clipboard est supportée
    if (!navigator.clipboard) {
        // Fallback pour les navigateurs plus anciens ou contextes non sécurisés (HTTP)
        try {
            const textArea = document.createElement("textarea");
            textArea.value = emailText;
            textArea.style.position = "fixed";  // Empêche le défilement en haut
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.width = "2em";
            textArea.style.height = "2em";
            textArea.style.padding = "0";
            textArea.style.border = "none";
            textArea.style.outline = "none";
            textArea.style.boxShadow = "none";
            textArea.style.background = "transparent";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            // Afficher le popup de succès
            const popup = document.getElementById('copyPopup');
            if (popup) {
                popup.textContent = "Email copié !";
                popup.style.backgroundColor = 'var(--text-primary)'; // Couleur de succès
                popup.classList.add('show');
                setTimeout(() => {
                    popup.classList.remove('show');
                }, 2500); // Masquer après 2.5 secondes
            }
            return; // Sortir de la fonction après la copie fallback

        } catch (err) {
            console.error('Fallback copy failed: ', err);
            const popup = document.getElementById('copyPopup');
            if (popup) {
                popup.textContent = "Copie échouée. Essayez manuellement.";
                popup.style.backgroundColor = 'var(--accent-primary)';
                popup.classList.add('show');
                setTimeout(() => {
                    popup.classList.remove('show');
                    setTimeout(() => { popup.style.backgroundColor = 'var(--text-primary)'; }, 400);
                }, 3000);
            }
            return; // Sortir si le fallback échoue aussi
        }
    }

    // Utilisation de l'API Clipboard moderne
    navigator.clipboard.writeText(emailText).then(function() {
        const popup = document.getElementById('copyPopup');
        if (popup) {
            popup.textContent = "Email copié !"; // Message de succès
            popup.style.backgroundColor = 'var(--text-primary)'; // Assurer la couleur de succès
            popup.classList.add('show');
            // Masquer le popup après un délai
            setTimeout(() => {
                popup.classList.remove('show');
            }, 2500); // Popup visible pendant 2.5 secondes
        }
    }).catch(function(err) {
        console.error('Erreur lors de la copie de l\'email: ', err);
        const popup = document.getElementById('copyPopup');
        if (popup) {
            popup.textContent = "Erreur de copie"; // Message d'erreur
            popup.style.backgroundColor = 'var(--accent-primary)'; // Couleur d'erreur (rouge)
            popup.classList.add('show');
            // Masquer le popup après un délai
            setTimeout(() => {
                popup.classList.remove('show');
                // Réinitialiser la couleur de fond après le masquage pour la prochaine notification
                setTimeout(() => {
                    popup.style.backgroundColor = 'var(--text-primary)';
                }, 400); // Attendre la fin de la transition de masquage
            }, 3000); // Popup d'erreur visible pendant 3 secondes
        }
    });
}
