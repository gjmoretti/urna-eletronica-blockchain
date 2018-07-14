pragma solidity ^0.4.18;
// Deve ser especificada qual a versão do compilador que será utilizada para compilar este código

contract Votacao {
  // O mapeamento de campos abaixo é equivalente à um array associativo ou hash.
  // A chave do mapeamento é o nome do candidato, armazenado como tipo bytes32 e o valor é um número inteiro que armazena a contagem de votos
  
  mapping (bytes32 => uint8) public votosRecebidos;
  
  // O Solidity ainda não permite passar um array de strings no constructor. Sendo assim, utilizamos um array de bytes32 para armazenar a lista de candidatos:  
  bytes32[] public listaCandidatos;

  // Este é o construtor que será chamado uma vez, quando for feito o deploy do contrato no blockchain. No deploy do contrato, deve ser passada a lista de candidatos que estarão disputando na eleição:  
  function Votacao(bytes32[] nomesCandidatos) public {
    listaCandidatos = nomesCandidatos;
  }

  // Esta função retorna o total de votos que um candidato recebeu até o momento:
  function totalVotosPara(bytes32 candidato) view public returns (uint8) {
    require(candidatoValido(candidato));
    return votosRecebidos[candidato];
  }

  // Esta função incrementa a contagem de votos para o candidato especificado. Isso é equivalente a votar:
  function votoParaCandidato(bytes32 candidato) public {
    require(candidatoValido(candidato));
    votosRecebidos[candidato] += 1;
  }

  function candidatoValido(bytes32 candidato) view public returns (bool) {
    for(uint i = 0; i < listaCandidatos.length; i++) {
      if (listaCandidatos[i] == candidato) {
        return true;
      }
    }
    return false;
  }
}