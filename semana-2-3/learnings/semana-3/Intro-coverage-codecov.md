<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Intro a coverage y codecov

Cuando hablamos de test, una de las cosas que debemos de tener presentes es poder saber que tanto porcentaje de nuestro código estamos cubriendo con nuestras pruebas, un concepto que quizá ya hayas escuchado `coverage`.

En esta parte del curso veremos como saber el coverage de nuestra aplicación de forma local pero también veremos como podemos hacer uso de diversas herramientas para conocer el coverage de todas las ramas en un proyecto alojado en `github` o en cualquier otra plataforma.

Para esto vamos a usar `github` y `github actions` como herramienta de CI, para el coverage usaremos [codecov](https://about.codecov.io/).

En esta primera parte haremos las primeras configuraciones en nuestro proyecto.

## Paso 1. Test command

Lo primero que haremos es crear un comando que sea capaz de crear un reporte con el coverage de nuestro proyecto, para esta tarea usaremos jest ya que es capaz de crear este reporte para nosotros.

Dentro del `package.json` crearemos un nuevo script llamado `test:coverage`:

```js
"scripts": {
    ...
    "test:coverage": "yarn test --coverage --watchAll=false",
    ...
  },
```

Como podemos ver estamos usando 2 banderas en el script, la primera es `--coverage` y esta bandera es la que le indica a jest que necesitamos el reporte con el coverage de la aplicación, la segunda bandera de `--watchAll=false` es simplemente para decirle a jest que no se quede esperando cambios en los archivos de pruebas ya que solo nos interesa que se ejecute una vez y salga del proceso.

## Paso 2. Coverage reporters y excluyendo archivos

El segundo paso es igual de simple, en este caso lo que debemos configurar es un par de llaves en el `package.json` con la finalidad de configurar en que formato queremos que jest nos genere los reportes del coverage e indicarle de que archicos o carpetas queremos que nos genere estos reporte.

```js
// package.json

...
"jest": {
    "coverageReporters": [
      "json",
      "text",
      "html",
      "lcov"
    ],
    "collectCoverageFrom": [
      "src/**/*.{js,jsx}",
      "!src/index.js",
      "!src/setupTests.js",
      "!src/reportWebVitals.js"
    ]
}
...
```

Como podemos ver lo que hacemos es simple, agregar una nueva llave en nuestro archivo llamada `jest` que contiene un objeto con 2 llaves más `coverageReporters` que como ya dijimos simplemente indica en que formatos queremos los reportes y `collectCoverageFrom` que indica que archivos nos interesan para estos reportes, en mi caso lo que estoy haciendo es primero indicar que me interesan todos los archivos dentro `src` con las extensiones `js o jsx` y posteriormente decirle a jest que ignore 3 archivos que son de configuración de mi aplicación por lo que no me interesa cubrirlos.
