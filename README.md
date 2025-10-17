Diseña tu Estilo - Web App

Este es el repositorio para la aplicación web "Diseña tu Estilo", un sistema interactivo que permite a los clientes diseñar productos personalizados como mochilas, bolsos y bolsos materos.

Arquitectura del Proyecto

El proyecto está containerizado usando Docker y se gestiona con Docker Compose. La arquitectura se divide en tres servicios principales:

frontend: Una aplicación de una sola página (SPA) construida con React y Vite. Utiliza Three.js (@react-three/fiber) para el renderizado 3D interactivo y Tailwind CSS para la interfaz. Se ejecuta en el puerto 5173.

backend: Una API RESTful construida con Node.js y Express. Se conecta a la base de datos MongoDB para gestionar los diseños, usuarios y pedidos. Se ejecuta en el puerto 5001.

database: Una instancia de MongoDB que almacena todos los datos de la aplicación.

Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu MacBook M4 Pro:

Docker Desktop

Visual Studio Code

La extensión Dev Containers en VS Code.

Cómo Empezar (Usando Dev Containers)

Este es el método recomendado, ya que configura todo el entorno de desarrollo de forma automática.

Clona el repositorio en tu máquina local.

Abre la carpeta del proyecto en Visual Studio Code.

VS Code detectará automáticamente el archivo .devcontainer/devcontainer.json y te mostrará una notificación en la esquina inferior derecha. Haz clic en "Reopen in Container".

Espera a que se construyan los contenedores. La primera vez puede tardar unos minutos, ya que Docker descargará las imágenes y el comando postCreateCommand instalará todas las dependencias (npm install) para el frontend y el backend.

Una vez finalizado, tu VS Code estará conectado al contenedor backend. Los puertos 5001 (backend) y 5173 (frontend) se reenviarán automáticamente a tu máquina local.

¡Listo! El entorno de desarrollo está en marcha.

El servidor del backend ya estará corriendo (puedes verlo en la terminal de VS Code).

El servidor del frontend también estará corriendo. Abre tu navegador y ve a http://localhost:5173 para ver la aplicación.

Cualquier cambio que hagas en el código en VS Code se reflejará automáticamente en la aplicación gracias a la sincronización de volúmenes y a nodemon / Vite HMR.

Próximos Pasos

Este código base es un punto de partida sólido. Aquí tienes los siguientes pasos para expandir el proyecto:

Modelado 3D: Reemplaza el cubo de ejemplo en Canvas3D.jsx con modelos .glb reales de tu mochila, bolso y bolso matero. Asegúrate de que las diferentes partes del modelo (tiras, frontal, etc.) sean mallas separadas con nombres claros para poder aplicarles materiales individualmente.

API Backend: Desarrolla las rutas de la API (endpoints) para:

Guardar y cargar diseños.

Autenticación de usuarios (con Google/Facebook usando Passport.js).

Gestión de plantillas y materiales (para el modo administrador).

Procesamiento de pedidos.

Interfaz de Usuario (UI):

Implementa la galería de inspiración.

Crea el flujo de registro e inicio de sesión.

Desarrolla el panel de administración.

Añade la funcionalidad para subir imágenes y aplicar textos personalizados en el lienzo 3D.

Persistencia de Datos: Conecta las acciones del frontend (como guardar un diseño) para que realicen llamadas a la API del backend y almacenen los datos en MongoDB.