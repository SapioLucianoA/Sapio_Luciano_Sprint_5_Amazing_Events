const { createApp } = Vue

createApp({
  data() {
    return {
      eventos: [],
      currentdate: [],
      eventosAssist:[],
      primero: null,
      ultimo: null,
      eventosPorCapacidad: [],
      capacityMayor: null,
      eventosEstimate: [],
      ordenarPorCategoriasUp: [],
      SumaUP: [],
      ordenarPorCategoriasPast: [],
      SumaPast:[]
    }
  },
  created() {
    fetch(`https://mindhub-xj03.onrender.com/api/amazing`)
      .then(response => response.json())
      .then(data => {
        this.currentdate= new Date (data.currentDate)
        this.eventos = data.events;

        // ----------------------------INICIO DEL CUADRO 1----------------------------------
        this.eventosAssist = this.eventos.filter(evento => new Date(evento.date) < this.currentdate);
        this.eventosAssist.sort((a, b) => (b.assistance / (b.capacity/100)) - (a.assistance / (a.capacity/100)));
        console.log(this.eventosAssist)
        // primero y ultimo
        this.primero = this.eventosAssist[0];
        this.ultimo = this.eventosAssist[this.eventosAssist.length - 1];
        // capacity obtencion
        let eventosPorCapacidad = [...this.eventos].sort((a, b) => b.capacity - a.capacity);
        this.capacityMayor = eventosPorCapacidad[0];
//----------------------------FIN DEL CUADRO 1------------------------------------------

// ----------------------------CUADRO 2 upcoming-------------------------------------------
        this.eventosEstimate = this.eventos.filter(evento => new Date(evento.date) > this.currentdate);
        this.ordenarPorCategoriasUp =  this.ordenarPorCategoria(this.eventosEstimate);
         console.log(this.ordenarPorCategoriasUp)
        
        this.SumaUP = this.sumarDatos(this.ordenarPorCategoriasUp);
        // console.log(this.SumaUP)
// -------------------------------FIN CUADRO 2 Upcoming-------------------------------------------------

// -------------------------------CUADRO 3 PAST ---------------------------------------------------
        this.ordenarPorCategoriasPast = this.ordenarPorCategoria(this.eventosAssist)
        // console.log(this.ordenarPorCategoriasPast)
        this.SumaPast = this.sumarDatos(this.ordenarPorCategoriasPast)
         console.log(this.SumaPast)

      })
      .catch(error => console.log(error));
  },
  methods: {
    calcularPorcentaje(assistance, capacity) {
      return (assistance / (capacity/100)).toFixed(2);
    },
    ordenarPorCategoria(array) {
      let categorias = {};

      // iteramos sobre cada evento
      for (let evento of array) {
        
        if (!categorias.hasOwnProperty(evento.category)) {
          categorias[evento.category] = [];
        }
        categorias[evento.category].push(evento);
      }

      // Convertimos los valores del objeto a un array y lo devolvemos
      return Object.values(categorias);
    },
    sumarDatos(arrays) {
      return arrays.map(array => {
        return array.reduce((acumulador, objeto) => {
          // no assistance? pos uso estimate
          let assistance = objeto.assistance || objeto.estimate;
          // Sumamos las propiedades al acumulador
          acumulador.capacity += objeto.capacity;
          acumulador.assistance += assistance;
          // Añadimos category and price
          acumulador.category = objeto.category;
          // Calculamos la recaudación de este objeto y la sumamos al acumulador
          let recaudacion = assistance * objeto.price;
          acumulador.recaudacion += recaudacion;
          return acumulador;
        }, {capacity: 0, assistance: 0, recaudacion: 0}); // Inicializamos el acumulador con 0
      });
    }
  },
}).mount('#app')