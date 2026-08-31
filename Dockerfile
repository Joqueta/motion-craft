# Portfolio front (site statique, ES modules natifs, pas de build)
FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY index.html index.js config.js robots.txt sitemap.xml /usr/share/nginx/html/
COPY assets/ /usr/share/nginx/html/assets/
COPY components/ /usr/share/nginx/html/components/
COPY lib/ /usr/share/nginx/html/lib/
COPY mocks/ /usr/share/nginx/html/mocks/
COPY pages/ /usr/share/nginx/html/pages/
COPY routes/ /usr/share/nginx/html/routes/
COPY services/ /usr/share/nginx/html/services/
COPY store/ /usr/share/nginx/html/store/
COPY styles/ /usr/share/nginx/html/styles/

ENV PORT=8080
EXPOSE 8080
