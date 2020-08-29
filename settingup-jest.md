<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Instalando jest

Para esta lección vamos a instalar y configurar jest en un proyecto simple hecho por nosotros desde cero, tranquilo, será un proyecto muy sencillo.

> Nota: De aquí en adelante asumiremos que ya tienes instalado nodejs, de no ser así, puedes descargarlo [aquí](https://nodejs.org/es/), sin embargo, te sugerimos intalarlo mediante [nvm](https://github.com/nvm-sh/nvm), un manejador de versiones de nodejs.

### Creando el proyecto

Nuestro proyecto estará construido de la siguiente manera:

1. Crearemos una carpeta donde estarán todo los archivos de nuestro proyecto con el comando `mkdir`, en mi caso lo nombraré como `jest-basics`.
2. Con el comando `yarn init` o `npm init` crearemos un package.json.
3. Crearemos un archivo llamado `app.test.js` dentro nuestra carpeta y a la misma altura de nuestro `package.json`.

Hasta este momento debemos tener una estructura como esta:

```
.
└── jest-basics/
    ├── package.json
    └── app.test.js
```

Una vez creado nuestro proyecto comenzaremos la configuración, a continuación los comandos y código que usaremos.

**Instalación de jest**

```
// yarn
$ yarn add -D jest

//npm
$ npm i -D jest
```

**package.json scripts**

```
{
  // ...package.json config
  "scripts": {
    "test": "jest --watchAll"
  }
}
```
