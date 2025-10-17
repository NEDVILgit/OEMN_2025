# 1. Usar una imagen oficial de Node.js como base.
# Se utilizará una versión LTS (Long Term Support) reciente para mayor estabilidad y seguridad.
FROM node:22-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /workspace/frontend

# 3. Copiar los archivos de definición de dependencias.
COPY package*.json ./

# 4. Instalar las dependencias del proyecto.
RUN npm install

# 5. Copiar el resto del código fuente de la aplicación.
COPY . .

# 6. Exponer el puerto que el servidor de desarrollo de Vite usará.
EXPOSE 5173

# 7. El comando por defecto para ejecutar cuando el contenedor se inicie.
# El docker-compose.yml usa 'npm run dev' para el desarrollo.
CMD ["npm", "run", "dev"]

