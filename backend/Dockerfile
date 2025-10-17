# 1. Usar una imagen oficial de Node.js como base.
# Se utilizará una versión LTS (Long Term Support) reciente para mayor estabilidad y seguridad.
FROM node:22-alpine

# 2. Establecer el directorio de trabajo dentro del contenedor.
WORKDIR /workspace/backend

# 3. Copiar los archivos de definición de dependencias.
COPY package*.json ./

# 4. Instalar TODAS las dependencias del proyecto (incluidas las de desarrollo).
# La bandera '--include=dev' asegura que 'nodemon' y otras herramientas se instalen.
RUN npm install --include=dev

# 5. Copiar el resto del código fuente de la aplicación.
COPY . .

# 6. Exponer el puerto que utilizará el servidor Express.
EXPOSE 5001

# 7. El comando por defecto para ejecutar cuando el contenedor se inicie.
CMD ["npm", "start"]

