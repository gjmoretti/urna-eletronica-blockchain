var Voting = artifacts.require("./Votacao.sol");

module.exports = function(deployer) {
  deployer.deploy(Voting, ['Alvaro Dias', 'Ciro Gomes', 'Flavio Rocha', 'Geraldo Alckmin', 'Jair Bolsonaro', 'Joao Amoedo', 'Manuela Davila', 'Marina Silva', 'Henrique Meirelles', 'Fernando Haddad', 'Lula', 'Guilherme Boulos', 'Cabo Daciolo'], {gas: 6700000});
};
