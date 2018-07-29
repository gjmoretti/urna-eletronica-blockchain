import "../stylesheets/app.css";
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import votacao_artefatos from '../../build/contracts/Votacao.json'
var Voting = contract(votacao_artefatos);

let candidatos = {"Alvaro Dias": "candidato-1", "Ciro Gomes": "candidato-2", "Flavio Rocha": "candidato-3", "Geraldo Alckmin": "candidato-4", "Jair Bolsonaro": "candidato-5", "Joao Amoedo": "candidato-6", "Manuela Davila": "candidato-7", "Marina Silva": "candidato-8"}

$(".card").click(function(){
	var id = $(this).attr("data-id");
	var img = $(this).find('img').attr('src');
	var name = $(this).find('.name').html();
	$("#modalImg").attr('src', img);
	$("#modalName").html(name);
	$('#voteBtn').attr("data-id", id);
	//Open modal
	$('.ui.basic.test.modal')
			.modal({
				blurring: true,
				closable  : true,
				onDeny    : function(){
					console.log("Cancelou!");;
				},
				onApprove : function() {
					 console.log("Votou!");
				}
			}).modal('show');
});

$("#voteBtn").click(function(){
	var id = $(this).attr("data-id");
	votoParaCandidato(id);
});

window.votoParaCandidato = function(nomeCandidato) {
  try {
    $("#msg").html("O seu voto foi registrado. A contagem de votos será atualizada assim que seu voto for registrado no blockchain. Por favor, aguarde.")

    Voting.deployed().then(function(contractInstance) {
	  contractInstance.votoParaCandidato(nomeCandidato, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {		  	
		let div_id = candidatos[nomeCandidato];
//		return contractInstance.totalVotosPara.call(nomeCandidato).then(function(v) {
//		  $("#" + div_id).html(v.toString());
//		  $("#msg").html("");
//		});
	  });
    });
  } catch (err) {
    console.log(err);
  }
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
  // Voting.defaults({from: window.web3.eth.accounts[0],gas:6721975});
  let nomeCandidatos = Object.keys(candidatos);
  for (var i = 0; i < nomeCandidatos.length; i++) {
    let name = nomeCandidatos[i];
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotosPara.call(name).then(function(v) {
        $("#" + candidatos[name]).html(v.toString());
      });
    })
  }
});