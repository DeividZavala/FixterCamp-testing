<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

## Actualización

> El valor que se colocó en el video en la parte de `branch protection rule` es incorrecto, lo que se escribe en ese campo no es el nombre de la regla, el valor correcto es un patron para indocar a que ramas se les debe aplicar esta regla, puedes encontrar más información [aquí](https://docs.github.com/en/github/administering-a-repository/managing-a-branch-protection-rule). El valor que debemos poner en ese campo es `*` ya que esto indica que le aplica a todas las ramas.

![](https://i.imgur.com/9DLfJPp.png)

# Intro a coverage y codecov

Una vez que terminamos la configuración nos tocas crear un nuevo repo en `Github` que será la plataforma que estaremos usando, como ya mencionamos vamos a usar el proyecto que creamos sobre `msw.js` entonces una vez creado el repo vamos a enlazar el repo remoto con el local, hecho esto, vamos a regresar a la interfaz de github, en la interfaz, en la barra superior dentro del repo que acabamos de crear, veremos un botón llamado `actions`.

En esta sección nos encontraremos con bloques que nos permitirán crear un archivo de `github actions` con la configuración básica para crear un `workflow`.

![](https://i.imgur.com/3xNrELk.png)

En este caso la base que usaremos es la de `Node.js`

![](https://i.imgur.com/ILXCDMD.png)

El código base que tenemos es el siguiente:

```yaml
# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: Node.js CI

# Indica que el workflow se detona al hacer un push o pull_request a la rama master
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

# Los pasos del workflow
jobs:
  build:
    # Indicamos que queremos que nuestro workflow corra sobre ubuntu
    # (podemos seleccionar otros OS)
    runs-on: ubuntu-latest

    strategy:
      matrix:
        # Versión de Node.js que queremos usar
        node-version: [10.x, 12.x, 14.x, 15.x]
        # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v2
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

De aquí, es importante explicar a detalle algo, dentro de este código podemos ver lineas que comienzan con `- uses`, esto es importante por que estas lineas indican que estamos usando actions ya creadas, en este caso por ejemplo `actions/checkout@v2` y en particular esta action tiene el objetivo de permitirnos interactuar con el código del repositorio, otro ejemplo es `- uses: actions/setup-node@v2`, esta linea se encarga de preparar y configurar nodejs.

Lo que implica que podemos usar las actions que otros ya han creado.
Lo siguiente que resta explicar son las lineas con `- run` que nos van a permitir correr los scripts que tengamos configurados en el proyecto.

Explicado esto, ahora nos toca hacer los cambios pertinentes para que el workflow haga lo que nosotros queremos.

```yaml
# This workflow will do a clean install of node dependencies, build the source code and run tests across different versions of node
# For more information see: https://help.github.com/actions/language-and-framework-guides/using-nodejs-with-github-actions

name: Test coverage

on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x]

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install depencies
        run: yarn

      - name: Run tests and generate coverage reports
        run: yarn test:coverage

      - name: Upload coverage to codecov
        uses: codecov/codecov-action@v1
```

Los cambios que hicimos principalmente fueron en la parte de los Scrips que queremos que corriera nuestro `workflow`, agregamos nombres a cada comando para poder indentificar cada etapa a la hora de la ejecución y cambios las versiones de node que usariamos a que solo fuera la `12.x`.

Para la interacción con `codecov` agregamos un nuevo bloque hasta el final.

```yaml
- name: Upload coverage to codecov
  uses: codecov/codecov-action@v1
```

Esta action es oficial de la herramienta por lo que no tenemos que preocuparnos por nada, solo es importante mencionar que esto es para los repositorios publicos, en caso de los repositorios remotos, tenemos que agregar una key que nos dará codecov.

Es importante mencionar que este archivo será creado en una carpeta llamada `.github/workflows` a la misma altura de `src`.

## Codecov

El siguiente paso es ir a [codecov](https://about.codecov.io/) y crear una cuenta, nos podemos dar de alta con github,gitlab o bitbucket.

Una vez completado el proceso lo que resta es agregar nuestro repo.

![](https://i.imgur.com/wr0QdEa.png)

## Branch protection rule

Otro paso que no es indispensable pero puede ser muy útil al trabajar con `workflows` es que podemos crear reglas para proteger o asegurar que siertas condiciones se cumplan antes de hacer un merge por ejemplo.

Para configurarlas es necesario ir a la sección de `setting` de proyecto y posteriormente al apartado de `branches`, una vez ahí encontraremos una sección que dice `Branch protection rules` y una botón que dice `Add rule`. Damos click y veremos una seria de casillas que basta con seleccionar para determinar que reglas queremos aplicar.

Un punto importante a notar es que en la casilla de `Branch name pattern` es importante entender que aquí debemos de escribir los criterios para seleccionar a que ramas queremos que esta regla se aplique, en nuestro caso escribimos `*` lo que implica que la regla se debe aplicar a todas las ramás, puedes encontrar más información [aquí](https://docs.github.com/en/github/administering-a-repository/managing-a-branch-protection-rule).

## Probando la integración

Ya con estos pasos completados lo que tenemos que hacer es probar nuestra integración para asegurar que todo es correcto.

Lo que haremos es crear una nueva rama donde hagamos un cambio al código, puede ser cambiar una palabra o un queño bloque que de preferencia no implique hacer un cambio en nuestros test, recordemos que es simplemente para probar nuestra integración.

Al hacer push de nuestra rama, veremos algó así:

![](https://i.imgur.com/tKFGONt.png)

Si todos nuestros checks pasan podremos hacer el merge con nuestros cambios en la rama principal.
