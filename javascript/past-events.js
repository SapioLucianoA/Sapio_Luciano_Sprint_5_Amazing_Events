const { createApp } = Vue

  createApp({
    data() {
      return {
        currentdate: [],
        message: '',
        eventos: [],
        searchInput: '',
        buscador: '',
        categorias: [],
        checkboxs: [],
        checked:[]
      }
    },
    created() {
      fetch(`https://mindhub-xj03.onrender.com/api/amazing`)
      .then(Response => Response.json())
      .then (data =>{
        console.log(data)
          this.currentdate= new Date (data.currentDate)
          this.eventos = data.events.filter(evento => new Date(evento.date) < this.currentdate)
         console.log(this.evento)
         this.buscador = this.eventos
         this.categorias = this.eventos.map(evento => evento.category )
         console.log(this.categorias)
         this.checkboxs = [... this.sacarRepetidos(this.categorias)]
         console.log(this.checkboxs)
        
        
      })
        .catch (err=> console.log(err))
      },
      methods: {
        sacarRepetidos(array){
         return Array.from(new Set (array))
        }
      },
      computed: {
         filterCards() {
      this.buscador = this.eventos.filter(evento => 
      evento.name.toLowerCase().includes(this.searchInput) && 
      (this.checked.length === 0 || this.checked.includes(evento.category))
      );
      if (this.buscador.length === 0) {
      this.message = '404 no hay resultados :c';
      } else {
      this.message = '';
      }
      },
      }
  }).mount('#app')