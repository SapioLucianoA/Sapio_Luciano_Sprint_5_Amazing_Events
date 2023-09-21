const { createApp } = Vue

createApp({
  data() {
    return {
      eventos: [],
      evento: null
    }
  },
  created() {
    let parametro = new URLSearchParams(window.location.search).get('parametro');
    fetch(`https://mindhub-xj03.onrender.com/api/amazing`)
      .then(response => response.json())
      .then(data => {
        this.eventos = data.events;
        this.evento = this.eventos.find(evento => String(evento._id) === String(parametro));
        console.log(this.evento)
      })
      .catch(error => console.log(error));
  },
  methods: {
    
  },
}).mount('#app')
      