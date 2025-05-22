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
    const closeModalBtn = modal.querySelector('.close-modal-btn');

    // Données des projets (pourraient venir d'un JSON ou d'attributs data plus complexes)
    // Note: Les images sont des URL externes. Si vous voulez des images locales,
    // mettez-les dans votre dossier img/ et changez les chemins ici.
    const projectDetails = {
        modalHardis: { 
            title: "Site Hardis Group (Détails)", 
            image: "https://adrienlgls.github.io/portfolio/img/Hardis.png", // ou "img/hardis-detail.jpg"
            description: "Développement d'interfaces web responsives et interactives pour le site vitrine du groupe Hardis. Ce projet a impliqué une collaboration étroite avec les équipes de design pour assurer une expérience utilisateur optimale et une présentation claire des différents pôles d'activité de l'entreprise." 
        },
        modalNutriscore: { 
            title: "Analyse de Données Nutriscore (Détails)", 
            image: "https://adrienlgls.github.io/portfolio/img/Nutriscore.png", // ou "img/nutriscore-detail.jpg"
            description: "Exploration d'un dataset volumineux de produits alimentaires (Open Food Facts) à l'aide de SQL pour l'extraction et la préparation des données, puis avec le langage R (librairies dplyr, ggplot2) pour l'analyse statistique et la création de visualisations pertinentes (histogrammes, boxplots, etc.) afin de comprendre les facteurs déterminant le Nutriscore." 
        },
        modalPresse: { 
            title: "Analyse Sémantique de la Presse (Détails)", 
            image: "https://adrienlgls.github.io/portfolio/img/Presse.png", // ou "img/presse-detail.jpg"
            description: "Application de techniques de Traitement Automatique du Langage Naturel (NLP) sur un corpus d'articles de presse. Utilisation de Python et des librairies NLTK/spaCy pour la tokenisation, lemmatisation, reconnaissance d'entités nommées (NER) et analyse de sentiment, dans le but d'identifier des thèmes émergents et des tendances." 
        },
        modalAI: { 
            title: "Projet IA Concept (Détails)", 
            image: "", // Pas d'image spécifique pour ce concept, ou mettez un placeholder
            description: "Ce projet exploratoire vise à développer un prototype d'intelligence artificielle pour [Préciser l'objectif, ex: un système de recommandation simplifié, une classification d'images basique, ou l'analyse prédictive sur un petit dataset]. Les technologies ciblées sont Python, ainsi que les librairies Scikit-learn, TensorFlow ou PyTorch, selon la nature exacte du problème abordé. L'objectif est d'appliquer les concepts fondamentaux du machine learning et du deep learning à un cas concret." 
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
                    modalBody.querySelector('h3').textContent = details.title;
                    const imgElement = modalBody.querySelector('img');
                    if(details.image && details.image !== "") { // Si une image est fournie
                        imgElement.src = details.image;
                        imgElement.alt = details.title; // Bon pour l'accessibilité
                        imgElement.style.display = 'block'; // Affiche l'élément image
                    } else {
                        imgElement.style.display = 'none'; // Cache l'élément image s'il n'y en a pas
                    }
                    modalBody.querySelector('p').innerHTML = details.description; // Utilise innerHTML si la description peut contenir du HTML simple
                    
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
});