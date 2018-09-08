import '../stylesheets/app.css';
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import votacao_artefatos from '../../build/contracts/Votacao.json';
var Voting = contract(votacao_artefatos);

let candidatos = {"Alvaro Dias": "candidato-1", "Ciro Gomes": "candidato-2", "Geraldo Alckmin": "candidato-4", "Jair Bolsonaro": "candidato-5", "Joao Amoedo": "candidato-6", /* "Manuela Davila": "candidato-7",*/ "Marina Silva": "candidato-8", "Henrique Meirelles": "candidato-9", /*"Fernando Haddad": "candidato-10", "Lula": "candidato-11", */ "Guilherme Boulos": "candidato-12", "Cabo Daciolo": "candidato-13"}

$(".vote").click(function(){
    location.reload();
});

$(".about").click(function(){
    $("#main").load("about.html");
});

$('.ui.sidebar').sidebar({
  context: $('.bottom.segment')
}).sidebar('setting', {transition: 'overlay'})
.sidebar('attach events', '.launch');

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  $(".attached.menu").css("font-size", "1.5em");
  $(".sidebar").css("font-size", "2em");
  $(".desktop").hide();
}else{
  $(".mobile").hide();
}

$(".card").click(function(){
    var id = $(this).attr("data-id");
    var img = $(this).find('img').attr('src');
    var name = $(this).find('.name').html();
    $("#modalName").html(name);
    $('#voteBtn').attr("data-id", id);
    //Open modal
    $('.ui.basic.first.modal')
            .modal({
                allowMultiple: false,
                blurring: true,
                closable  : false,
                onDeny    : function(){
                    console.log("Cancelou!");
                    location.reload();
                }
            }).modal('show');
    $("#modalImg").attr('src', img);
}); 

$("#voteBtn").click(function(){
	
	// Check Wallet:
    if (typeof web3 !== 'undefined') {		
		var network = web3.version.network;
		console.log("Network ID: " + network);
		
		// Check Network (1 - Main, 2 - Morden, 3 - Ropsten, 4 - Rinkeby, 42 - Kovan):
		if (network !== '4') {
			callNetworkNotFound();
		}
		else {
			// Check User logged:
			// console.log("User: " + web3.eth.accounts[0]);
			if (web3.eth.accounts[0] == null) {
				callNoUserLogged();	
			}
			else {
				console.log("Usuário corretamente logado à MetaMask");
				var id = $(this).attr("data-id");
				votoParaCandidato(id);					
			}
		}
    } 
	else {
        callPluginNotFound();
    }
});

window.votoParaCandidato = function(nomeCandidato) {
  var mobile = false;
  
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	console.log("Mobile");
	mobile = true;
  }
  else {
	console.log("PC/Laptop");
  }  
	
  try {
    Voting.deployed().then(function(contractInstance) {
	  let div_id = candidatos[nomeCandidato];
	  
	  if (mobile === true) {
		// Caso o usuário esteja utilizando algum dispositivo móvel, o pop-up da Wallet não será aberto. A aplicação não deve aguardar o retorno da função: 
		contractInstance.votoParaCandidato(nomeCandidato, {gas: 140000, from: web3.eth.accounts[0]});  
		// O usuário deverá acessar a Wallet para enviar a transação.
		callTransactionConfirmationPending();
	  }
	  else {
		// Caso o usuário esteja utilizando um PC/Laptop, o pop-up da Wallet não será aberto e a aplicação vai aguardar o retorno da função, confirmando que a transação foi confirmada na BlockChain.
        // Para verificar a conclusão da transação, que é uma operação Assincrona, utiliza-se uma "Promise" (function."then")		
		contractInstance.votoParaCandidato(nomeCandidato, {gas: 140000, from: web3.eth.accounts[0]}).then(successCallback, failureCallback);
	  }
	  
    });   
  } catch (err) {
    console.error(err);
  }
}

function successCallback(result) {
  console.log("Transação confirmada com sucesso. Mensagem: " + result);
  callBlockChainConfirmation();	
}

function failureCallback(error) {
  console.error("Transação não confirmada. Mensagem de Erro: " + error);
}


function callBlockChainConfirmation(){
    $('.second.modal').modal({
                closable  : false,
                onDeny : function(){
                    console.log("Transação confirmada na BlockChain");
                    location.reload();
                }
            }).modal('show');
}

function callPluginNotFound(){
    $('.third.modal').modal({
                closable  : false,
                onDeny : function(){
                    console.log("Web3 Provider (MetaMask) não encontrado!");
                    location.reload();
                }
            }).modal('show');
}

function callNetworkNotFound(){
    $('.fourth.modal').modal({
                closable  : false,
                onDeny : function(){
                    console.log("Rede Rinkeby não identificada!");
                    location.reload();
                }
            }).modal('show');
}

function callTransactionConfirmationPending(){
    $('.fifth.modal').modal({
                closable  : false,
                onDeny : function(){
                    console.log("Transação enviada para a Wallet");
                    location.reload();
                }
            }).modal('show');
}

function callBlockChainError(){
    $('.sixth.modal').modal({
                closable  : false,
                onDeny : function(){
                    console.error("Transação não confirmada na BlockChain");
                    location.reload();
                }
            }).modal('show');
}

function callUserVerificationError(){
    $('.seventh.modal').modal({
                closable  : false,
                onDeny : function(){
					console.error("Ocorreu uma falha ao verificar o usuário.");
                    location.reload();
                }
            }).modal('show');
}

function callNoUserLogged(){
    $('.eighth.modal').modal({
                closable  : false,
                onDeny : function(){
					console.log("Usuário não conectado à MetaMask");
                    location.reload();
                }
            }).modal('show');
}

$( document ).ready(function() {  
  
  if (typeof web3 !== 'undefined') {
    console.warn("Usando o web3, detectado a partir de uma fonte externa como o Metamask")
    // Usando Mist/MetaMask's como provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("Web3 não detectado.");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Voting.setProvider(web3.currentProvider);
});

$(".result").click(function(){  
  if (typeof web3 !== 'undefined') {
	  
	var network = web3.version.network;
	console.log("Network ID: " + network);
		
	// Check Network (1 - Main, 2 - Morden, 3 - Ropsten, 4 - Rinkeby, 42 - Kovan):
	if (network !== '4') {
		callNetworkNotFound();
	}
	else {
		
		$("#main").html('<br><canvas id="canvas"></canvas>');
		var ctx = document.getElementById("canvas").getContext("2d");
		var myChart = new Chart(ctx, {
		  type: 'horizontalBar',
		  data: {
			  labels: [],
			  datasets: [{
				  label: 'Votos',
				  data: [],
				  backgroundColor: [],
				  borderColor: [],
				  borderWidth: 1
			  }]
		  },
		  options: {
			  scales: {
				  yAxes: [{
					  ticks: {
						  beginAtZero:true
					  }
				  }]
			  }
		  }
		});

		Voting.setProvider(web3.currentProvider);
		let nomeCandidatos = Object.keys(candidatos);

		for (var i = 0; i < nomeCandidatos.length; i++) {
		  let name = nomeCandidatos[i];
		  Voting.deployed().then(function(contractInstance) {
			contractInstance.totalVotosPara.call(name).then(function(v) {
			  var newColor = getRandomColor();
			  myChart.data.labels.push(name);
			  myChart.data.datasets.forEach((dataset) => {
				  dataset.data.push(parseInt(v));
				  dataset.borderColor.push(newColor);
				  dataset.backgroundColor.push(newColor);
			  });

			  myChart.update();
			});
		  })
		}
	}
 
  } else {
    callPluginNotFound();
  }
});

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
