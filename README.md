Para Angular, si estás ejecutándolo normalmente con ng serve, la URL será:



http://localhost:4200

README.md actualizado



Reemplaza el contenido anterior de tu README.md por este:



\# Sistema de Gestión de Vehículos



Proyecto desarrollado para la asignatura de \*\*Programación Web I\*\*.



El sistema permite gestionar categorías, vehículos y mantenimientos, además de consultar información meteorológica mediante una API externa.



\---



\## Descripción del proyecto



La aplicación está desarrollada utilizando una arquitectura integrada por:



\- Frontend desarrollado con Angular.

\- Servicio SOAP para la gestión de categorías y vehículos.

\- Servicio REST para la gestión de mantenimientos.

\- API externa para la consulta del clima.

\- Base de datos SQL Server.



\---



\## Tecnologías utilizadas



\### Frontend



\- Angular

\- TypeScript

\- HTML

\- CSS



\### Backend



\- C#

\- .NET

\- SOAP

\- REST API



\### Base de datos



\- SQL Server



\### Herramientas



\- Visual Studio

\- Visual Studio Code

\- Postman

\- Git

\- GitHub



\---



\# Estructura del proyecto



```text

ProyectoVehiculos/

│

├── FrontendAngular/

│   └── Aplicación web Angular

│

├── VehiculosSOAPDB/

│   └── Servicio SOAP

│

├── VehiculosREST/

│   └── Servicio REST

│

└── README.md

Servicios del sistema

Servicio SOAP



El servicio SOAP se utiliza para la administración de:



Categorías

Vehículos



URL del servicio:



http://localhost:5284



El servicio SOAP contiene operaciones para:



Categorías

Obtener categorías

Agregar categoría

Actualizar categoría

Eliminar categoría

Vehículos

Obtener vehículos

Obtener vehículo por ID

Agregar vehículo

Actualizar vehículo

Eliminar vehículo

Obtener vehículos por marca

Obtener vehículos por categoría

Servicio REST



El servicio REST se utiliza para la administración de mantenimientos.



URL del servicio:



http://localhost:5234



Operaciones disponibles:



Obtener mantenimientos

Obtener mantenimiento por ID

Obtener mantenimientos por vehículo

Agregar mantenimiento

Actualizar mantenimiento

Eliminar mantenimiento

Frontend Angular



La aplicación Angular funciona como interfaz principal del sistema.



URL:



http://localhost:4200



Desde Angular se consumen los diferentes servicios:



&#x20;                        ┌─────────────────────┐

&#x20;                        │   Angular Frontend  │

&#x20;                        │  localhost:4200     │

&#x20;                        └──────────┬──────────┘

&#x20;                                   │

&#x20;                ┌──────────────────┼──────────────────┐

&#x20;                │                  │                  │

&#x20;                ▼                  ▼                  ▼

&#x20;       ┌────────────────┐  ┌────────────────┐  ┌────────────────┐

&#x20;       │  Servicio SOAP │  │  Servicio REST │  │   API Clima    │

&#x20;       │ localhost:5284 │  │ localhost:5234 │  │     Externa    │

&#x20;       └───────┬────────┘  └───────┬────────┘  └────────────────┘

&#x20;               │                   │

&#x20;               └─────────┬─────────┘

&#x20;                         ▼

&#x20;                 ┌─────────────────┐

&#x20;                 │    SQL Server   │

&#x20;                 │ VehiculosSOAPDB │

&#x20;                 └─────────────────┘

Conexión a la base de datos



Los servicios SOAP y REST utilizan SQL Server.



La base de datos utilizada es:



VehiculosSOAPDB



La cadena de conexión configurada en los servicios es:



"VehiculosConnection": "Server=LAPTOP-C35025B8;Database=VehiculosSOAPDB;Trusted\_Connection=True;TrustServerCertificate=True;"

Servidor

LAPTOP-C35025B8

Base de datos

VehiculosSOAPDB

Autenticación

Trusted\_Connection=True

Cómo ejecutar el proyecto



Para ejecutar correctamente el sistema se deben iniciar primero los servicios backend y posteriormente Angular.



1\. Ejecutar el servicio SOAP



Abrir el proyecto:



VehiculosSOAPDB



Ejecutarlo desde Visual Studio.



El servicio debe quedar disponible en:



http://localhost:5284

2\. Ejecutar el servicio REST



Abrir el proyecto:



VehiculosREST



Ejecutarlo desde Visual Studio.



El servicio debe quedar disponible en:



http://localhost:5234

3\. Ejecutar Angular



Abrir una terminal dentro de:



FrontendAngular



Instalar las dependencias si es necesario:



npm install



Después ejecutar:



ng serve



La aplicación estará disponible en:



http://localhost:4200

Orden recomendado de ejecución



Se recomienda iniciar los proyectos en el siguiente orden:



1\. SQL Server

&#x20;      ↓

2\. Servicio SOAP

&#x20;      ↓

3\. Servicio REST

&#x20;      ↓

4\. Angular



Una vez iniciados los servicios, ingresar desde el navegador a:



http://localhost:4200



Angular se encargará de consumir los servicios SOAP y REST mediante sus respectivos servicios TypeScript.



Funcionalidades

Categorías



Permite:



Registrar categorías.

Consultar categorías.

Actualizar categorías.

Eliminar categorías.



Tecnología utilizada:



SOAP

Vehículos



Permite:



Registrar vehículos.

Consultar vehículos.

Actualizar vehículos.

Eliminar vehículos.

Consultar vehículos por marca.

Consultar vehículos por categoría.



Tecnología utilizada:



SOAP

Mantenimientos



Permite:



Registrar mantenimientos.

Consultar mantenimientos.

Actualizar mantenimientos.

Eliminar mantenimientos.

Consultar mantenimientos por vehículo.



Tecnología utilizada:



REST

Clima



Permite:



Consultar el clima por ciudad.

Mostrar temperatura.

Mostrar sensación térmica.

Mostrar humedad.

Mostrar precipitación.

Mostrar velocidad del viento.

Mostrar recomendaciones relacionadas con el vehículo.



Tecnología utilizada:



API externa

Resumen de conexiones

Componente	URL / Configuración

Angular	http://localhost:4200

SOAP	http://localhost:5284

REST	http://localhost:5234

Base de datos	VehiculosSOAPDB

Servidor SQL	LAPTOP-C35025B8

