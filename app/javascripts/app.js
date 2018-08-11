import '../stylesheets/app.css';
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract';

import votacao_artefatos from '../../build/contracts/Votacao.json';
var Voting = contract(votacao_artefatos);

let candidatos = {"Alvaro Dias": "candidato-1", "Ciro Gomes": "candidato-2", "Geraldo Alckmin": "candidato-4", "Jair Bolsonaro": "candidato-5", "Joao Amoedo": "candidato-6", "Manuela Davila": "candidato-7", "Marina Silva": "candidato-8", "Henrique Meirelles": "candidato-9", "Fernando Haddad": "candidato-10", "Lula": "candidato-11", "Guilherme Boulos": "candidato-12", "Cabo Daciolo": "candidato-13"}

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
				closable  : true,
				onDeny    : function(){
					console.log("Cancelou!");;
				},
				onApprove : function() {
					 console.log("Votou!");
				}
			}).modal('setting', 'closable', false).modal('show');
        
        $('.second.modal')
          .modal('attach events', '.first.modal #voteBtn')
        ;
        
    $("#modalImg").attr('src', img);
    }); 

$("#voteBtn").click(function(){
	var id = $(this).attr("data-id");
	votoParaCandidato(id);
});

window.votoParaCandidato = function(nomeCandidato) {
  try {
    $("#msg").html("O seu voto foi registrado. A contagem de votos será atualizada assim que seu voto for registrado no blockchain.")

    Voting.deployed().then(function(contractInstance) {
	  contractInstance.votoParaCandidato(nomeCandidato, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {		  	
		let div_id = candidatos[nomeCandidato];
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
});