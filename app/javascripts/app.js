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