/* const { Component, mount, xml } = owl;

// Owl Components
class Root extends Component {
  static template = xml`<div>Hello Owl</div>`;
}

mount(Root, document.body); */

/* (function () {
    console.log("hello owl", owl.__info__.version);
  })(); */

  (function() {
  //creando el primer componente 
  const { Component, mount, xml, useRef, onMounted, useState, reactive, useEnv } = owl;
  //useRef: para referenciar un elemento del DOM
  //onMounted: para ejecutar una funcion cuando el componente se monta
  //useState: para manejar el estado del componente
  //xml: para crear templates
  //Component: para crear componentes
  //mount: para montar un componente en el DOM
  //t-att-class: para cambiar la clase de un elemento
  //t-att-checked: para cambiar el estado de un input
  //t-on-click: para manejar eventos de click
  //t-esc: para escapar texto
  //t-foreach: para iterar sobre una lista
  //t-as: para definir un alias para cada item de la lista
  //t-key: para definir una clave unica para cada item de la lista
  //t-ref: para referenciar un elemento del DOM en el componente
  //t-on-keyup: para manejar eventos de teclado
  //t: para crear fragmentos
  //dev: para activar el modo de desarrollo
  //setup: para ejecutar codigo cuando el componente se monta
  //el: para acceder al elemento del DOM referenciado con t-ref
  //focus: para enfocar un elemento del DOM
  //nextId: para generar un id unico para cada tarea
  //tasks: para almacenar las tareas
  //addTask: para agregar una tarea
  //toggleTask: para cambiar el estado de una tarea
  //deleteTask: para eliminar una tarea
  //saveTasks: para guardar las tareas en el almacenamiento local
  //initialTasks: para obtener las tareas del almacenamiento local
  //taskStore: para almacenar las tareas
  //createTaskStore: para crear el almacenamiento de tareas
  //displayedTasks: para obtener las tareas a mostrar segun el filtro
  //filter: para almacenar el filtro actual
  //setFilter: para cambiar el filtro actual
  //env: para almacenar el almacenamiento de tareas
  //useStore: para obtener el almacenamiento de tareas
  //t-if: para mostrar un elemento si se cumple una condicion
  //t-foreach: para iterar sobre una lista
  //t-att-class: para cambiar la clase de un elemento
  //t-att-for: para asociar un input con una etiqueta
 
    



 //VAMOS A implementar una almacenamiento local para las tareas
// -------------------------------------------------------------------------
// Store
// -------------------------------------------------------------------------
function useStore() {
  const env = useEnv();
  return useState(env.store);
}


//lo separamos en funciones 
class TaskList {
  constructor(tasks) {
    this.tasks = tasks || [];
    const taskIds = this.tasks.map((t) => t.id);
    this.nextId = taskIds.length ? Math.max(...taskIds) + 1 : 1;}

  ///funcion para agregar funciones 
  addTask(text) {
    text = text.trim();
    if (text) {
      const task = {
        id: this.nextId++,
        text: text,
        isCompleted: false,
      };
      this.tasks.push(task);
    }
  }

  toggleTask(task) {
    task.isCompleted = !task.isCompleted;
  }

  deleteTask(task) {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(index, 1);
  }
}

//para crear y guardar las tareas
function createTaskStore() {
  const saveTasks = () => localStorage.setItem("todoapp", JSON.stringify(taskStore.tasks));
  const initialTasks = JSON.parse(localStorage.getItem("todoapp") || "[]");
  const taskStore = reactive(new TaskList(initialTasks), saveTasks);
  saveTasks();
  return taskStore;
}


  //para que se enfoque en la barra de busqueda
// Owl Components
//owl trabja con clases 
class Task extends Component {
    static template = xml /* xml */`
      <div class="task" t-att-class="props.task.isCompleted ? 'done' : ''">
        <input type="checkbox" 
        t-att-id="props.task.id"
        t-att-checked="props.task.isCompleted" 
        t-on-click="() => store.toggleTask(props.task)" />
        <label t-att-for="props.task.id"><t t-esc="props.task.text"/></label>
        <span class="delete" t-on-click="() => store.deleteTask(props.task)">🗑</span>
      </div>`;
    static props = ["task"];

    //
    setup() {
      this.store = useStore();
    }
  }

  //este es el componnente raiz
    //creando el segundo componente
    //COMPONENTE RAIZ
    class Root extends Component {
        static template = xml /* xml */`
        <div class="todo-app">
    <input placeholder="Ingrese una Tarea" t-on-keyup="addTask" t-ref="add-input" />
          <div class="task-list">
            <t t-foreach="displayedTasks" t-as="task" t-key="task.id">
              <Task task="task"/>
            </t>
          </div>
          <div class="task-panel" t-if="store.tasks.length">
            <div class="task-counter">
             <t t-esc="displayedTasks.length"/>
             <t t-if="displayedTasks.length lt store.tasks.length">
                / <t t-esc="store.tasks.length"/>
              </t>
            Tarea(s)
          </div>
          <div>
            <span t-foreach="['Todas', 'Activas', 'Completadas']"
              t-as="f" t-key="f"
              t-att-class="{active: filter.value===f}"
              t-on-click="() => this.setFilter(f)"
              t-esc="f"/>
          </div>
        </div>
      </div>
          `;

          static components = { Task };
          
          setup() {
            const inputRef = useRef("add-input");
            onMounted(() => inputRef.el.focus());
            this.store = useStore();
            this.filter = useState({ value: "Todas" });
          }

          addTask(ev) {
            // 13 is keycode for ENTER
            if (ev.keyCode === 13) {
              this.store.addTask(ev.target.value);
              ev.target.value = "";
            }
          }

          get displayedTasks() {
            const tasks = this.store.tasks;
            switch (this.filter.value) {
              case "Activas":
                return tasks.filter((t) => !t.isCompleted);
              case "Completadas":
                return tasks.filter((t) => t.isCompleted);
              case "Todas":
                return tasks;
            }
          }

          setFilter(filter) {
            this.filter.value = filter;
          }
      }

  // -------------------------------------------------------------------------
  // Setup
  const env = { store: createTaskStore() };
  mount(Root, document.body, { dev: true, env });
})();

