<img alt="logo fixter" width="300" src="https://fixter.camp/static/media/geek_completo.7e1e87a7.png" />

# Tipos de Test

Cuando empezamos a escuchar sobre testing, términos como `test unitario` o `end to end` pueden ser muy recurrentes, pero no siempre sabes a qué se refiere. En esta lección vamos a, por fin, aprender de qué se tratan.

Dentro del testing hay diferentes formas en las que vamos pensar o estructurar nuestras pruebas dependiendo y teniendo bien presente que es lo que queremos testear, eso puede ir desde casos muy simples como solo probar una funcion utilitaria de nuestro código o hasta probar todo un flujo de nuestra aplicación. Con el proposito de identificar mejor cuál es la intencion de un test, estos se segmentan en 3 grupos:

- Test Unitarios
- Test de Implementación
- Test end to end o e2e.

**Pero, ¿De que se trata cada uno?**

## Tests unitarios

Este tipo de test se caracteriza por prubas que abarcan unicamente una pieza de tu código a la vez, es decir, sin importar la cantidad de funciones o componentes que tengamos y cómo se comporten en conjunto con otros bloques de código, unicamente probaremos que ese elemento en particular, se comporte como debe de hacerlo.

# Tests de Integración

Al contrario de los test unitarios, los `test de integración` buscan abarcar comportamientos más completos, sin cubir un flujo completo de nuestra aplicación, estos test buscan probar la interación que hay entre multiples componentes de nuestra aplicación.

# Tests end to end

Las pruebas end to end o e2e como lo podemos encontrar en algunos articulos, son pruebas que buscan abarcar un flujo completo como por ejemplo un login. Son pruebas que de forma implicita probarán que cada uno de los bloques que forman parte ese flujo este funcionando correctamente.

Estas pruebas son un tanto diferente a las anteriores, mientras los test unitarios y de integración son código que ejecutamos en nuestras terminales y vemos el resultado, los test e2e tienen un entorno de ejecución diferente, el navegador. Estos test van a estar orientados a emular el comportamiento que un usuario tendrá al interactuar con nuestro sitio, desde abrir el navegador y entrar a nuestro sitio web hasta ingresar sus credenciales, dar click y ser redireccionado a otra sección de nuestra aplicación.
