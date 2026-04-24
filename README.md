# 🚀 TaskFlow App

Aplicación web desarrollada con **Angular** para la gestión de tareas, que consume la API **TaskFlowAPI**. Permite administrar tareas con jerarquía (padre-hijo), aplicar filtros, ordenamiento, paginación y realizar operaciones CRUD.

---

## 🧠 Descripción

TaskFlow App es el frontend del sistema TaskFlow, diseñado para interactuar con una API REST y permitir al usuario:

- Visualizar tareas
- Crear, editar y eliminar tareas
- Organizar tareas en subtareas
- Filtrar y ordenar resultados
- Autenticarse mediante JWT

---

## ⚙️ Tecnologías utilizadas

- Angular 21
- TypeScript
- Angular Signals
- Angular Material
- TailwindCSS
- RxJS
- HttpClient

---

## 🔐 Autenticación

La aplicación consume endpoints protegidos mediante JWT.

- Login de usuario
- Almacenamiento de token
- Envío del token en cada request al backend

---

## 📦 Funcionalidades principales

### 📝 Gestión de tareas

- Crear tareas mediante modal
- Editar tareas reutilizando el mismo modal
- Eliminar tareas con confirmación
- Ver detalle de tarea en modal

---

### 🌳 Jerarquía de tareas

- Visualización de tareas padre e hijas
- Soporte de múltiples niveles de subtareas

---

### 🔍 Filtros dinámicos

Se pueden aplicar filtros por:

- Nombre
- Estado
- Prioridad

---

### 🔽 Ordenamiento

- Ordenar por distintos campos
- Selección de dirección (ascendente / descendente)

---

### 📊 Paginación

- Control de página
- Cantidad de registros por página
- Integración con backend mediante headers

---

### 🎨 Interfaz

- Diseño con TailwindCSS
- Componentes con Angular Material
- Uso de modales para:
  - Crear tareas
  - Editar tareas
  - Ver detalle
  - Confirmar eliminación

---

## 📁 Estructura del proyecto

```
src/
 ├── app/
 │    ├── tareas/
 │    ├── seguridad/
 │    ├── compartidos/
 │    └── ...
```

---

## 🚀 Servidor de desarrollo

Para iniciar el servidor local:

```
ng serve
```

Luego abrir en el navegador:

```
http://localhost:4200/
```

---

## 🏗 Build

Para compilar el proyecto:

```
ng build
```

Los archivos se generan en:

```
dist/
```

---

## 🧪 Tests

Ejecutar pruebas unitarias:

```
ng test
```

---

## 🔗 Integración

Este proyecto está diseñado para trabajar junto a:

👉 **TaskFlowAPI (backend en ASP.NET Core)**

---

## 👨‍💻 Autor

Proyecto desarrollado como práctica de frontend enfocado en:

- Consumo de APIs REST
- Manejo de estado con Angular Signals
- Diseño de interfaces modernas
- Implementación de funcionalidades reales de negocio
