// DEFINIR LAS VARIABLES NECESARIAS DE LOS ELEMENTOS HTML
const taskInput = document.querySelector('.input-text'); // el input de ingresar tarea
const addForm = document.querySelector('.add-form'); // el form completo
const tasksContainer = document.querySelector('.tasks-list'); // el ul completo
const deleteAllBtn = document.querySelector('.deleteAll-btn'); // el boton de borrar tareas

//Definimos la lista de tareas. Si existe un array de tarea en el LS vamos a traer esa lista, pero en caso que no esté, será un array vacío
let taskList = JSON.parse(localStorage.getItem('tasks')) || []; /* getItem, nos sirve para traernos
elementos desde el localStorage, para convertir la cadena de texto JSON en un objeto
nuevamente */
/* El método JSON.parse() convierte una cadena de texto que contiene datos en formato
   JSON y devuelve un objeto JavaScript que representa estos datos.*/

/*localStorage es un objeto del navegador web que permite a los desarrolladores web
almacenar datos localmente en la máquina del usuario de manera persistente */
  
//función que guarda en el LS el array de tareas
const saveLocalStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(taskList)); /*setItem, permite
  guardar elementos en el localStorage para transformar nuestro objeto en una cadena de
  texto JSON que se pueda guardar correctamente en el mismo. */
};
/*JSON.stringify() es un método de JavaScript que convierte un objeto JavaScript en una
cadena de texto en formato JSON (JavaScript Object Notation) */



//Función que crea el HTML de una tarea
//función generadora
const createTask = (task) => // el task es el valor de entrada de nuestra funcion (argumento)
`<li>${task.name}<img class="delete-btn" src="assets/delete.svg" alt="boton de borrar" data-id="${task.id}"></li>`;

//Función que renderiza (moldea) la lista de tareas. RENDERIZAR: Se refiere a una representación gráfica, una imagen o vídeo creado a través de un software. El objetivo del render es crear una imagen o vídeo con el que mostrar un concepto, idea o proyecto de forma digital y realista.
//el .join() es para evitar que aparezca una coma entre las tareas a la hora de renderizar
const renderTaskList = () => {
  tasksContainer.innerHTML = taskList.map((task) => createTask(task)).join("");
};  // en taskContainer tengo todas mis listas de tareas, entonces le creo un innerHTML, y agregamos la lista de tareas "taskList" de localStorage que es donde se guarda el todo de mi lista. El map va a recorrer cada tarea, y por cada tarea que recorra la funcion generadora "createTask" ira creando las tares que el usuario vaya escribiendo.



/* Primer Paso Terminado. Todo el codigo de arriba nos sirve para generar mi lista de tareas y usar el ul completo (tasksContainer) */




//función que oculta o muestra el botón borrar todas las tareas. Depender de si el array esta vacío o no.
const toggleDeleteAllButton = () => {
  if (!taskList.length /*La negacion sirve como para decir.. "sino tengo tal cosa", en este caso seria si no tengo tareas en mi variable taskList. */)  {
    deleteAllBtn.classList.add('hidden');
    return /*para que no se siga ejecutando*/
  }
  deleteAllBtn.classList.remove('hidden');
}

//función que convierte el value del taskInput en un string sin espacios al principio y al final(trim) y sin multiespaciado interno(replace)
const correctInputValue = () => {
  return taskInput.value.trim().replace(/\s+/g, " ");
  /*El método trim( ) elimina los espacios en blanco en ambos extremos del string */
};

//función que verifica si la tarea ingresada es válida (no vacía y no repetida). esta funcion se usar para la funcion con evento submit, no es que esta aislada
const isValidTask = (taskName) => {
  let isValid = true;
  if (!taskName.length) {
    alert("Por favor, ingresa una tarea");
    isValid = false;
  } else if (taskList.some((task) => task.name.toLowerCase() === taskName.toLowerCase())) {
    alert("Ya existe una tarea con ese nombre");
    isValid = false;
  }
  return isValid;
}

const addTask = (e) => {
  e.preventDefault(); // prevenir el comportamiento por default
  const taskName = correctInputValue(); // validar el value 
  if (isValidTask(taskName)) {
    taskList = [...taskList, { name: taskName, id: Date.now() }]; // Date.now nos da un id que no se va a pisar con un id existente.
    addForm.reset(); // resetear form
    renderTaskList();
    saveLocalStorage();
    toggleDeleteAllButton(); 
    // todas estas funciones anteriormente creadas debemos llamarlas en la funcion addTask con el evento submit para que funcione en el momento que el usuario comienza a interactuar con el documento
  }
};


// funcion para borrar una tarea o varias con el click en la imagen del tacho
const removeTask = (e) => {
  if (!e.target.classList.contains('delete-btn')) return; // si el usuario no clickea exactamente en la imagen tacho de basura entonces le decimos que nos retorne hasta que el usuario clickee
  const filterID = Number(e.target.dataset.id); //  Cada elemento del DOM tiene asociada la propiedad dataset, que es un objeto tipo DOMStringMap con todos sus atributos data-*. De aqui tomamos cada data-id de cada li de la ul que tenemos invocada en la variable taskContainer.
  taskList = taskList.filter((task) => task.id !== filterID); // cada vez que tengamos que eliminar algo la mayoria de las veces va a ser a travez de un metodo filter. 
  renderTaskList();
  saveLocalStorage();
  toggleDeleteAllButton();
};


//función que borra todas las tareas del array de tareas
//convertimos la tasklist de nuevo en un array vacío y volvemos a realizar los pasos de renderizar la lista de tareas, guardar en LS y verificar si se debe mostrar o no el botón de borrar

const removeAll = () => {
  taskList = []; // cuando se hace click en el boton de borras todas las tareas mi taskList se convierte en un array vacio
  renderTaskList();
  saveLocalStorage();
  toggleDeleteAllButton();
}

const init = () => {  /* La función init() se puede utilizar para realizar tareas de inicialización, como configurar
el estado inicial de una aplicación, cargar datos de una fuente de datos o configurar
los eventos y controladores de eventos necesarios para interactuar con la página. Por
lo general, la función init() se llama en la parte inferior del archivo JavaScript que se utiliza
en una página web o en el archivo principal de la aplicación.*/
  /* en esta variable vamos a ir poniendo los eventos con los nombres de sus funciones. Arriba iremos haciendo las funciones de dicho evento. Cada evento recibe una funcion. ejecutar renderTaskList en el evento DOMContentLoaded*/
  document.addEventListener('DOMContentLoaded', renderTaskList);
  document.addEventListener('DOMContentLoaded', toggleDeleteAllButton);
  addForm.addEventListener('submit', addTask);
  tasksContainer.addEventListener('click', removeTask);
  deleteAllBtn.addEventListener('click', removeAll);
};



//ejecutar la función init
init();