# LynoraLink — site vitrine

Site vitrine statique en HTML, CSS et JavaScript natifs, reprenant la structure, les contenus et la direction visuelle de la landing page de l’application. Aucune dépendance ni compilation n’est nécessaire.

## Prévisualiser

Servez ce dossier avec n’importe quel serveur de fichiers statiques pour que les pages dédiées et leurs chemins relatifs fonctionnent correctement. Par exemple, depuis ce dossier :

```sh
python -m http.server 8080
```

Puis ouvrez `http://localhost:8080`. Les images et le logo sont stockés dans `assets/`; seules les polices Google Fonts nécessitent une connexion Internet.

## Réutiliser

Copiez le dossier entier sur un hébergement statique (GitHub Pages, Netlify, Cloudflare Pages, Apache ou autre). Les liens d’action pointent vers l’application à `https://app.lynoralink.com` : FAQ, Conditions d’utilisation, Contact, Cookies, inscription et connexion. Le sélecteur de langue FR/EN et le carrousel sont fonctionnels sans serveur applicatif.

Le formulaire de contact est une prévisualisation désactivée ; l’envoi nécessite le backend de l’application.

La page n’utilise que des ressources locales, à l’exception des polices Google Fonts ; des polices système de remplacement restent disponibles hors ligne.

## Publier avec GitHub Pages

1. Créez un dépôt GitHub vide, sans README ni fichier `.gitignore` généré par GitHub.
2. Depuis ce dossier, initialisez Git et envoyez la branche `main` :

   ```sh
   git init -b main
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/VOTRE-NOM/VOTRE-DEPOT.git
   git push -u origin main
   ```

3. Dans le dépôt GitHub, ouvrez **Settings → Pages**, choisissez **Deploy from a branch**, puis sélectionnez `main` et `/ (root)`.

GitHub Pages publiera alors le site statique. Aucun secret ni fichier de configuration de build n’est nécessaire pour ce projet.
