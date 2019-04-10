/*
var Vue = require('vue')
var VueFire = require('vuefire')
var Firebase = require('firebase')
*/

var firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDlYP1dzM8SP8gpGCQFvu-metnAjGIZ5-c",
    authDomain: "digitacao-97415.firebaseapp.com",
    databaseURL: "https://digitacao-97415.firebaseio.com",
    projectId: "digitacao-97415",
    storageBucket: "digitacao-97415.appspot.com",
    messagingSenderId: "605149481934"
})

var db = firebaseApp.database()

var placarRef = db.ref('placar');

new Vue({
    el: '#app',
    data: {
        fase: 1,
        digitado: '',
        dificuldade: 0,
        timer: '',
        jogador: '',
        classeStatus: 'form-control-info',
        pontuacao: 0,
        cronometro: 0,
        statusJogo: 'inicio',
        frases:[
            { texto: 'Oi', tempo: 300 },
            { texto: 'Tudo bem?', tempo: 300 },
            { texto: 'Jogando um jogo', tempo: 350 },
            { texto: 'Digitando rápido', tempo: 350 },
            { texto: 'Bacon é vida', tempo: 400 },
            { texto: 'Papibaquígrafo', tempo: 400 },
            { texto: 'Ninho de mafagafos', tempo: 450 },
            { texto: 'Esse jogo é outra coisa', tempo: 450 },
            { texto: 'Três pratos de trigo para três tigres tristes', tempo: 500 },
            { texto: 'Quem chegou aqui é topson', tempo: 500 },
            { texto: 'Falta só essa frase para terminar tudo', tempo: 500 }
        ],
        dificuldades: [
            {nome: 'Fácil', modificador: 0.5, tempoAdicional: 1000},
            {nome: 'Médio', modificador: 2, tempoAdicional: 500},
            {nome: 'Difícil', modificador: 5, tempoAdicional: 0},
        ],
    },
    firebase: {
        placar: placarRef
    },
    computed: {
        placares() {
            return _.orderBy(this.placar, 'pontos', 'desc');
        },
        verificaDigitacao() {
            if (this.digitado.length > 1) {
                if (this.digitado == this.fraseAtual.texto) {
                    this.classeStatus = 'form-control-success';
                    this.digitado = '';
                    this.paraTimer();
                    this.pontuacao += (((this.fraseAtual.texto.split(" ").length)) * (this.cronometro) * 10) * this.dificuldadeAtual.modificador;

                    //passa de fase
                    if (this.fase < this.frases.length) {
                        this.classeStatus = 'form-control-info';
                        this.fase++;
                        this.cronometro += this.fraseAtual.tempo + this.dificuldadeAtual.tempoAdicional;

                        this.iniciaTimer();
                    } else {
                        this.gameOver();
                    }
                } else {
                    if (this.digitado == this.fraseAtual.texto.substr(0, this.digitado.length)) {
                        this.classeStatus = 'form-control-success';
                    } else {
                        this.classeStatus = 'form-control-danger';
                    }

                }
            }
        },
        fraseAtual() {
            return this.frases[this.fase - 1];
        },
        dificuldadeAtual() {
            return this.dificuldades[this.dificuldade];
        },
    },
    methods:{
        iniciaJogo: function(){
            if(this.jogador != ''){
                this.statusJogo = 'jogando'
                this.digitado = ''
                this.fase = 1
                this.cronometro = this.fraseAtual.tempo + this.dificuldadeAtual.tempoAdicional
                this.pontuacao = 0
                this.iniciaTimer()
            }
            return false;
        },
        iniciaTimer: function () {
            const self = this;
            this.timer =
                setInterval(function(){
                    self.cronometro -= 1;
                    if(self.cronometro <= 0) {
                        self.gameOver();
                    }
                },1);
        },
        paraTimer: function() {
            clearInterval(this.timer);
        },
        gameOver: function() {
            clearInterval(this.timer);
            if (this.pontuacao > 0) {
                var pontuacaoAtual = {nome: this.jogador, pontos: this.pontuacao, fase: this.fase, dificuldade: this.dificuldadeAtual.nome}
                placarRef.push(pontuacaoAtual);
            }
            this.statusJogo = "inicio";
        },
        filterPlacar(dificuldade){
            return _.take(_.filter(this.placares, item => {
                return item.dificuldade.indexOf(dificuldade) >=0;
            }),15);
        },
    },
    filters: {
        formatNumber: function (value) {
            let val = (value/1).toFixed(0).replace('.', ',')
            return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    },
    directives: {
        focus: function (el) {
            el.focus()
        }
    }
});
